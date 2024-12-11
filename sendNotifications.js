/*import { Expo } from "expo-server-sdk";
import fetch from "node-fetch";

const expo = new Expo();
const RTDatabase = "https://empoderadasapp-default-rtdb.firebaseio.com/";

// Función para enviar notificaciones
const sendNotifications = async () => {

  try {
    // Obtener usuarios desde la base de datos
    const response = await fetch(`${RTDatabase}/users.json`);
    const data = await response.json();

    if (!data) {
      console.error("No hay usuarios registrados para notificaciones.");
      return;
    }

    // Recopilar los tokens de los usuarios
    const somePushTokens = [];
    Object.keys(data).forEach((item) => {
      const token = data[item]?.token;
      if (token) somePushTokens.push(token);
    });

    if (somePushTokens.length === 0) {
      console.log("No hay tokens disponibles para enviar notificaciones.");
      return;
    }

    // Construir mensajes
    const messages = somePushTokens
      .map((pushToken) => {
        if (!Expo.isExpoPushToken(pushToken)) {
          console.warn(`Token inválido: ${pushToken}`);
          return null;
        }

        return {
          to: pushToken,
          sound: "default",
          title: "Alerta Sismica Hualmay",
          body: process.env.SISMO_RESPONSE || "Sin datos de sismo.",
        };
      })
      .filter((message) => message !== null);

    // Enviar mensajes en chunks
    const chunks = expo.chunkPushNotifications(messages);
    for (const chunk of chunks) {
      const receipts = await expo.sendPushNotificationsAsync(chunk);
      console.log("Receipts:", receipts);
    }

    console.log("Notificaciones enviadas exitosamente.");
  } catch (error) {
    console.error("Error al enviar notificaciones:", error.message);
  }
};

// Ejecutar función
sendNotifications();
*/

/*
import { Expo } from "expo-server-sdk";
import admin from "firebase-admin";
import serviceAccount from "./earthsismo.json" assert { type: "json" };

// Inicializar Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log("Firebase Admin SDK inicializado:", admin.apps.length > 0);

}

const expo = new Expo();
const firestore = admin.firestore();

// Función para guardar los datos del sismo en Firestore
const saveSismoToFirestore = async (sismoResponse) => {
  console.log("Sismo Response:", sismoResponse);

  try {
    const sismoData = JSON.parse(sismoResponse); // Convertir la respuesta en un objeto JSON

    if (!sismoData.success || !sismoData.data) {
      console.error("La respuesta del sismo no es válida.");
      return;
    }

    const [date, time, magnitude, place, latLng, depth] = sismoData.data;
    const [latitude, longitude] = latLng
      .split(",")
      .map((coord) => parseFloat(coord.trim()));

    // Crear documento en Firestore
    const timestamp = Date.now(); // Usar timestamp actual como ID del documento
    await firestore
      .collection("earthquake")
      .doc(String(timestamp))
      .set({
        date,
        time,
        magnitude: parseFloat(magnitude),
        place,
        latitude,
        longitude,
        depth: parseFloat(depth),
      });

    console.log(`Sismo guardado en Firestore con ID: ${timestamp}`);
    console.log("Datos procesados:", {
      date,
      time,
      magnitude,
      place,
      latitude,
      longitude,
      depth,
    });
    
  } catch (error) {
    console.error("Error al guardar el sismo en Firestore:", error.message);
  }
};

// Función para enviar notificaciones
const sendNotifications = async () => {
  try {
    const sismoResponse = process.env.SISMO_RESPONSE || '{"success":false}';

    // Guardar el sismo en Firestore
    await saveSismoToFirestore(sismoResponse);

    // Aquí puedes mantener la lógica de las notificaciones
    const response = await fetch(
      "https://empoderadasapp-default-rtdb.firebaseio.com/users.json"
    );
    const data = await response.json();

    if (!data) {
      console.error("No hay usuarios registrados para notificaciones.");
      return;
    }

    // Recopilar los tokens de los usuarios
    const somePushTokens = [];
    Object.keys(data).forEach((item) => {
      const token = data[item]?.token;
      if (token) somePushTokens.push(token);
    });

    if (somePushTokens.length === 0) {
      console.log("No hay tokens disponibles para enviar notificaciones.");
      return;
    }

    // Construir mensajes
    const messages = somePushTokens
      .map((pushToken) => {
        if (!Expo.isExpoPushToken(pushToken)) {
          console.warn(`Token inválido: ${pushToken}`);
          return null;
        }

        return {
          to: pushToken,
          sound: "default",
          title: "Alerta de Sismo - EasySOS App",
          body: `Sismo detectado: ${JSON.parse(sismoResponse).data[3]}`,
        };
      })
      .filter((message) => message !== null);

    // Enviar mensajes en chunks
    const chunks = expo.chunkPushNotifications(messages);
    for (const chunk of chunks) {
      const receipts = await expo.sendPushNotificationsAsync(chunk);
      console.log("Receipts:", receipts);
    }

    console.log("Notificaciones enviadas exitosamente.");
  } catch (error) {
    console.error("Error al enviar notificaciones:", error.message);
  }
};

// Ejecutar función
sendNotifications();
*/





import dotenv from "dotenv";
dotenv.config();

/*
const firebaseCredentials = {
  "type": "service_account",
  "project_id": "earthsismo",
  "private_key_id": "d10fe086ebaf2728417e5e7772f37e376b7424b2",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEuQIBADANBgkqhkiG9w0BAQEFAASCBKMwggSfAgEAAoIBAQC5Lx/k8TQPgp20\nya7I0ujJiY5rbXRD0DQ8DmUS+r4DJcndn++FAes0ZVdcFNHxLSlWVERqEmYDXVfz\nFZ6ue4Ld9+v8gptjUBDQJGBPVS+UlyZ3ONYyjtSzb9dOJIbNbwxFRgfbTqHRXwTR\nrNgOe5VL53KJ/VxnV/5YAutJFuplNNusxnl6Rofggs7Qa801jnyHTbQyUOLWUsTP\n1XEXVmFXox4VjljUmJKDxmyDn7poJFvo8IBtqxx09zvkxDWkc5hIE1ldza3b77JH\n78HV5lmsQG0xoaZ/EwnPTnz760A2jFek7L+Egm0KgJIGV4VHSDrdPNeBgQP32uM/\n2hpy13gxAgMBAAECgf8iUW0SylGvP2MEZ9ILIJS+deH9mlAUBhBs/RaM3xwmR/Mc\nGltN7VbzKK1Rtux/+56U5f8WgdJcEjBczVsMGFePrZh1huYnhmUhGetweYU/MIim\nhavJ5AbzTaQ7Zc5uJkiuoYHwxPVpSN7vcrFIwrvZd61kx54EiNjZzzqGVe78yFD6\ndgRe5CiesfwO64k7NFJ+fU/vp6lZjfnCH+696pif5+llkIU5+vpySMoOcE4xBmFe\nGBrBrdW71XPX+lZXJBbAEuxgoHLlleDeZLs1vLaTyhVc8EQwrEWBDRF9TxVNKnRB\nvCg0kgNEkliLrM6tGn/QA0TdxeDbWNgZo0gvNcUCgYEA/Z8GcrJWnHbn4rn9Dc6/\nZP4NOFzWYOYaBzEO50M/Rpq6EQpSdGQGcNJ8yb2dJxI9QYOKLWl6iCC4NVPNcLh6\njlM0jppGKyk9rxg8ky6KG5LCI7g4H6WiOkY4yr+ESlgBsNZFramg682mfLGhmjn9\nkYnHGAt4K61QoNT5ni8wHN0CgYEAuuvGEdvWO+Cw4FezCbbd9B4JLoLzfrIkg3so\n63gikBZzzXXUd0KYtJxCCLRiX8ksIyyRVPafU7x0ZWNembJKXGrpejCHTnp5h4hO\nFvSHGW6sooQwe0JePEPKR6c4mSBWN8at9+xVEZ/OyAMjdmMs3d8RsFcyLJQJvuoy\nKmpMmWUCf1A/AMtJoh3fgX87WdYElIpf1879kNcX9yRPYWfK3zp3umep3Gz3ORJ5\nhwJN/GtgWgFgnVfBCAQKVj6JRXdk52Ig8YAtUAZYBixgfsoS75/Jz6N9pkRdI/dM\nQKvl7PWY4vAQ2/sWsNPrPcI2cetabeCet1/kQSGQtPIucMycIZ0CgYABjTN3snt0\nw8i0FAZIblwpSpaI7E1ZH+FttfgA/F5NE+KiMfgxhTv/Q8zIhbbLVMApCpWqPuHT\nsBzHOqvuWqyDV9/YQ87bt+iKV3dOeXklnOWR88bzPvnJRkbHkXvGyZ3tmJiZFj0e\niFUPE/eXY/tbXB6peA/SjugFzavc7kT0gQKBgQCuYB2YaJVRGvMRzzt2ptv1UL8u\nbG6DJLSHA1DnUQ/XcJecSyWjXIpvc+8aNIzUah3L/djn5HH2hIWI4Lx+rF2jyR7r\ntoqcqLhikDWEeJBjzD+C8PxsUf0qqs/SZk1+w0JwilICS85BTL++c69cM/4wR/PB\nGn/CUrbWu9CatI076w==\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-h7ttm@earthsismo.iam.gserviceaccount.com",
  "client_id": "107266830424641089936",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-h7ttm%40earthsismo.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
};*/

const firebaseCredentials = {
  apiKey: "AIzaSyA6bSjw1tYjZ99Ol9qZ9_FgAEPK0hUjRRc",
  authDomain: "earthsismos.firebaseapp.com",
  projectId: "earthsismos",
  storageBucket: "earthsismos.firebasestorage.app",
  messagingSenderId: "147937053167",
  appId: "1:147937053167:web:c4e7f4f1ddc75b6b1e0e1a",
};



import { Expo } from "expo-server-sdk";
import admin from "firebase-admin";

// Inicializar Firebase Admin SDK

if (!admin.apps.length) {
  console.log(firebaseCredentials);
 /* admin.initializeApp({
    credential: admin.credential.cert(firebaseCredentials),
  });*/
  admin.initializeApp(firebaseConfig);
  console.log("Firebase Admin SDK inicializado:", admin.apps.length > 0);
}

const expo = new Expo();
const firestore = admin.firestore();

// Función para guardar los datos del sismo en Firestore
const saveSismoToFirestore = async (sismoResponse) => {
  console.log("Sismo Response:", sismoResponse);

  try {
    const sismoData = JSON.parse(sismoResponse); // Convertir la respuesta en un objeto JSON

    if (!sismoData.success || !sismoData.data) {
      console.error("La respuesta del sismo no es válida.");
      return;
    }

    const [date, time, magnitude, place, latLng, depth] = sismoData.data;
    const [latitude, longitude] = latLng
      .split(",")
      .map((coord) => parseFloat(coord.trim()));

    // Crear documento en Firestore
    const timestamp = Date.now(); // Usar timestamp actual como ID del documento
    await firestore
      .collection("earthquake")
      .doc(String(timestamp))
      .set({
        date,
        time,
        magnitude: parseFloat(magnitude),
        place,
        latitude,
        longitude,
        depth: parseFloat(depth),
      });

    console.log(`Sismo guardado en Firestore con ID: ${timestamp}`);
    console.log("Datos procesados:", {
      date,
      time,
      magnitude,
      place,
      latitude,
      longitude,
      depth,
    });
  } catch (error) {
    console.error("Error al guardar el sismo en Firestore:", error.message);
  }
};

// Función para enviar notificaciones
const sendNotifications = async () => {
  try {
    const sismoResponse = process.env.SISMO_RESPONSE || '{"success":false}';

    // Guardar el sismo en Firestore
    await saveSismoToFirestore(sismoResponse);

    // Aquí puedes mantener la lógica de las notificaciones
    const response = await fetch(
      "https://empoderadasapp-default-rtdb.firebaseio.com/users.json"
    );
    const data = await response.json();

    if (!data) {
      console.error("No hay usuarios registrados para notificaciones.");
      return;
    }

    // Recopilar los tokens de los usuarios
    const somePushTokens = [];
    Object.keys(data).forEach((item) => {
      const token = data[item]?.token;
      if (token) somePushTokens.push(token);
    });

    if (somePushTokens.length === 0) {
      console.log("No hay tokens disponibles para enviar notificaciones.");
      return;
    }

    // Construir mensajes
    const messages = somePushTokens
      .map((pushToken) => {
        if (!Expo.isExpoPushToken(pushToken)) {
          console.warn(`Token inválido: ${pushToken}`);
          return null;
        }

        return {
          to: pushToken,
          sound: "default",
          title: "Alerta de Sismo - EasySOS App",
          body: `Sismo detectado: ${JSON.parse(sismoResponse).data[3]}`,
        };
      })
      .filter((message) => message !== null);

    // Enviar mensajes en chunks
    const chunks = expo.chunkPushNotifications(messages);
    for (const chunk of chunks) {
      const receipts = await expo.sendPushNotificationsAsync(chunk);
      console.log("Receipts:", receipts);
    }

    console.log("Notificaciones enviadas exitosamente.");
  } catch (error) {
    console.error("Error al enviar notificaciones:", error.message);
  }
};

// Ejecutar función
sendNotifications();
