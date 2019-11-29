const line = require("@line/bot-sdk");
const configLine = require("../config/config.json")["line"];

const client = new line.Client(configLine);
module.exports = (req, res) => {
  console.log(JSON.stringify(req.body.events[0]));
};
