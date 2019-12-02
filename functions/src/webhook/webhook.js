const line = require("@line/bot-sdk");
const configLine = require("../config/config.json")["line"];
const handle = require('../service/handle-event');

const client = new line.Client(configLine);
module.exports = (req, res) => {
  console.log(JSON.stringify(req.body.events[0]));

  var message = req.body.events[0];
  var result = [];
  result = handle.handleEvent(message);

  client.replyMessage(result[0], result[1])
    .then(() => {
      console.info("OK");
      res.status(200).send("OK");
    })
    .catch(err => {
      console.error(err);
      res.status(500).send("Failed");
    });
};
