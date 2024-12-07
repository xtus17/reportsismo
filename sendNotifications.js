const { Expo } = require("expo-server-sdk");
const fetch = require("node-fetch");
const expo = new Expo();

const RTDatabase = "https://ajedrez-a65a1-default-rtdb.firebaseio.com/";

const sendNotifications = async (customBody) => {
  console.log("Custom Body recibido:", customBody);
};


module.exports = { sendNotifications };
