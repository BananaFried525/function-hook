/* eslint-disable handle-callback-err */
/* eslint-disable promise/no-nesting */
/* eslint-disable promise/catch-or-return */
/* eslint-disable promise/always-return */
const line = require("@line/bot-sdk");
const configLine = require("../config/config.json")["line"];
const handle = require("../services/handle-event");
const userService = require("../services/user");
const client = new line.Client(configLine);

module.exports = async (req, res) => {
  console.log(JSON.stringify(req.body.events[0]));
  if (req.body.events[0].replyToken === "00000000000000000000000000000000") {
    console.debug("Test pass");

    return res.status(200).send("Code:200,Message:Test");
  }

  var event = req.body.events[0];
  console.log(event.source.userId);
  try {
    let user = await userService.findUser(event.source.userId);
    if (!user) {
      userService.createUser(event.source);
    }
    let resHandle = await handle.handleEvent(event);
    await console.log("Result =>", resHandle[1]);
    let resClient = await client.replyMessage(resHandle[0], resHandle[1]);
    return res.status(200).send("Code:200");
  } catch (err) {
    console.error("Error message =>", err);
    return res.status(500).send("Code:500");
  }
  // userService
  //   .findUser(event.source.userId)
  //   .then(user=>{
  //     if(!user){
  //       userService.createUser(event.source);
  //     }
  //     handle.handleEvent(event).then(result => {
  //       console.info("result => ", result[1]);
  //       client
  //         .replyMessage(result[0], result[1])
  //         .then(() => {
  //           console.info("OK");
  //           return res.status(200).send("Code:200");
  //         })
  //         .catch(err => {
  //           console.error(err);
  //           return res.status(500).send("Code:500");
  //         });
  //     });
  //   })
  //   .catch(err => {
  //     console.error();
  //     return res.status(500).send("Code:500");
  //   });
};
