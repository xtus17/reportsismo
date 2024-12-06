const { Expo } = require("expo-server-sdk");
const fetch = require("node-fetch");
const expo = new Expo();

const RTDatabase = "https://ajedrez-a65a1-default-rtdb.firebaseio.com/";

const sendNotifications = async (customBody) => {
  try {
    // Verificar si el mensaje es válido
    if (!customBody || typeof customBody !== "string") {
      throw new Error("El mensaje proporcionado es inválido.");
    }

    const response = await fetch(`${RTDatabase}/users.json`);
    const data = await response.json();

    const somePushTokens = [];
    Object.keys(data).forEach((item) => {
      const token = data[item].token;
      somePushTokens.push(token);
    });

    const messages = somePushTokens
      .map((pushToken) => {
        if (!Expo.isExpoPushToken(pushToken)) {
          return null;
        }

        return {
          to: pushToken,
          sound: "default",
          title: "Este es un mensaje de Alerta de EasySOS App",
          body: customBody,
        };
      })
      .filter((message) => message !== null);

    const chunks = expo.chunkPushNotifications(messages);

    for (const chunk of chunks) {
      await expo.sendPushNotificationsAsync(chunk);
    }

    console.log("Notificaciones enviadas exitosamente.");
    return true;
  } catch (error) {
    console.error("Error al enviar notificaciones:", error.message);
    throw error;
  }
};

// Si se ejecuta directamente
if (require.main === module) {
  const customBody = process.env.CUSTOM_BODY || "Mensaje de prueba";
  sendNotifications(customBody).catch((error) => {
    console.error("Error ejecutando el envío de notificaciones:", error);
    process.exit(1);
  });
}

module.exports = { sendNotifications };
