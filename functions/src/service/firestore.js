const firebase = require("firebase");
const config = {
  apiKey: "AIzaSyAAm6Jci_ckEgvGkb98Q15R1h8RtIsjt_8",
  authDomain: "linebot-01-auoaao.firebaseapp.com",
  databaseURL: "https://linebot-01-auoaao.firebaseio.com/",
  projectId: "linebot-01-auoaao",
  storageBucket: "linebot-01-auoaao.appspot.com",
  messagingSenderId: "391523060557"
};
const fireBase = firebase.initializeApp(config);
const db = fireBase.firestore();

module.exports = db