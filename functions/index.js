const functions = require('firebase-functions');
const serviceWebHook = require('./src/webhook/webhook');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((req, res) => {
  ret ={
    statusCode:200,
    statusMsg:"Hello world",
    message:req.headers
  }

  return res.send(ret);
});

exports.webhook = functions.https.onRequest(serviceWebHook.webhook);
