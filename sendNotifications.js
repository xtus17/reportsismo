import { Expo } from "expo-server-sdk";
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
          title: "Este es un mensaje de Alerta de EasySOS App",
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
