const functions = require("firebase-functions");
const webHook = require("./src/webhook/webhook");
const requestIp = require("request-ip");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((req, res) => {
  ret = {
    statusCode: 200,
    statusMsg: "Hello world",
    message: req.headers
  };
  const clientIp = requestIp.getClientIp(req);

  ret.message = clientIp;
  return res.send(ret);
});

exports.webhook = functions.https.onRequest(webHook);
