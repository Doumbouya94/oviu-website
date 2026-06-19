const admin = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

const serviceAccount = require("./oviu-69a64-firebase-adminsdk-fbsvc-0f87adc763.json");

admin.initializeApp({
  credential: admin.cert(serviceAccount),
});

const db = getFirestore();

module.exports = db;