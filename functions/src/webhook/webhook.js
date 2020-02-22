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
    // let user = await userService.findUser(event.source.userId);
    let user = await userService.getUser(event.source.userId);
    if (!user) {
      console.log("New user come");
      userService.createUser(event.source);
    }
    let resHandle = await handle.handleEvent(event, user);
    await console.log("Result =>", JSON.stringify(resHandle[1]));
    await client.replyMessage(resHandle[0], resHandle[1])
    return res.status(200).send("Code:200");
  } catch (err) {
    console.error("Error message =>", err.message);
    // await client.replyMessage(event.replyToken, {
    //   type: "text",
    //   text: "เกิดข้อผิดพลาดทางเทคนิคกรุณาลองใหม่"
    // });
    return res.status(500).send("Code:500");
  }
};
