const express = require("express");
const cors = require("cors");

const middleware = require('@line/bot-sdk').middleware;
const JSONParseError = require('@line/bot-sdk').JSONParseError;
const SignatureValidationFailed = require('@line/bot-sdk').SignatureValidationFailed;
const configLine = require('./config/config.json')['line'];

const db = require('./service/firestore');

const webHook = require('../src/webhook/webhook');
const test = require('./test/test');


const app = express();

app.use(cors({ origin: true }));
app.get('/test',test);

app.use(middleware(configLine));
app.post('/webhook', webHook);
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