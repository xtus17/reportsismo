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

import { Expo } from "expo-server-sdk";
import admin from "firebase-admin";
import serviceAccount from "./earthsismo_Clave.json";

// Inicializar Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const expo = new Expo();
const firestore = admin.firestore();

// Función para guardar los datos del sismo en Firestore
const saveSismoToFirestore = async (sismoResponse) => {
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
