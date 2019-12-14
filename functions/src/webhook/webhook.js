/* eslint-disable promise/always-return */
const line = require("@line/bot-sdk");
const configLine = require("../config/config.json")["line"];
const handle = require('../service/handle-event');
const db = require('../service/firestore');
const client = new line.Client(configLine);

module.exports = (req, res) => {
  console.log(JSON.stringify(req.body.events[0]));
  if(req.body.events[0].replyToken === '00000000000000000000000000000000'){
    console.debug("Test pass");
    return res.status(200).send(send('Code:200,Message:Test'));
  }

  var message = req.body.events[0];
  var result = [];
  result = handle.handleEvent(message);

  console.info("result => ",result[1]);
  client.replyMessage(result[0], result[1]).then(()=>{
    console.info("OK");
    return res.status(200).send('Code:200');
  })
    .catch(err => {
      console.error(err);
      return res.status(500).send('Code:500');
    });

};
