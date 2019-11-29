const express = require("express");
const cors = require("cors");
const middleware = require('@line/bot-sdk').middleware;
const JSONParseError = require('@line/bot-sdk').JSONParseError;
const SignatureValidationFailed = require('@line/bot-sdk').SignatureValidationFailed;

const configLine = require('./config/config.json')['line'];

const app = express();
const config = {
  channelAccessToken: configLine.channelAccessToken,
  channelSecret: configLine.channelSecret
}

app.use(cors({ origin: true }));
app.use(middleware(config))

app.post('/webhook', (req, res) => {
  console.log(req.body);
  res.json(req.body.events) // req.body will be webhook event object
})

app.use((err, req, res, next) => {
  if (err instanceof SignatureValidationFailed) {
    res.status(401).send(err.signature)
    return
  } else if (err instanceof JSONParseError) {
    res.status(400).send(err.raw)
    return
  }
  next(err) // will throw default 500
})

module.exports = app;