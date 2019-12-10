/* eslint-disable promise/always-return */
const functions = require("firebase-functions");
// const admin = require("firebase-admin");
const express = require("./src/express");
const requestIp = require("request-ip");

// var firebase = require("firebase");
// const config = {
//   apiKey: "AIzaSyAAm6Jci_ckEgvGkb98Q15R1h8RtIsjt_8",
//   authDomain: "linebot-01-auoaao.firebaseapp.com",
//   databaseURL: "https://linebot-01-auoaao.firebaseio.com/",
//   projectId: "linebot-01-auoaao",
//   storageBucket: "linebot-01-auoaao.appspot.com",
//   messagingSenderId: "391523060557"
// };
// var fireBase = firebase.initializeApp(config);
// const db = fireBase.firestore();

exports.helloWorld = functions.https.onRequest((req, res) => {
  ret = {
    statusCode: 200,
    statusMsg: "Hello world",
    message: "dasd"
  };

  return res.send(ret);
});

exports.linebot = functions.https.onRequest(express);
