/*********************************** Start import Server  ***********************************/
const express = require("express");
const cors = require("cors");
/*********************************** End import Server   ***********************************/

/*********************************** Start import Line config  ***********************************/
const middleware = require("@line/bot-sdk").middleware;
const JSONParseError = require("@line/bot-sdk").JSONParseError;
const SignatureValidationFailed = require("@line/bot-sdk")
  .SignatureValidationFailed;
const configLine = require("./config/config.json")["line"];
/*********************************** End import Line config  ***********************************/

/*********************************** Start import route  ***********************************/
const webHook = require("../src/webhook/webhook");
const test = require("./test/test");
/*********************************** End import route  ***********************************/

const app = express();

app.use(cors({ origin: true }));

app.get("/test", test);

/*********************************** Start middle,catch err for line webhook ***********************************/
app.use(middleware(configLine));
app.post("/webhook", webHook);
app.use((err, req, res, next) => {
  if (err instanceof SignatureValidationFailed) {
    res.status(401).send(err.signature);
    return;
  } else if (err instanceof JSONParseError) {
    res.status(400).send(err.raw);
    return;
  }
  next(err); // will throw default 500
});
/*********************************** End middle,catch err for line webhook ***********************************/

module.exports = app;
