const functions = require("firebase-functions");
const express = require("./src/express");
const requestIp = require("request-ip");


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

exports.linebot = functions.https.onRequest(express);
