/* eslint-disable promise/always-return */
const googleApi = require("./google-api");
const userService = require("./user");

module.exports.handleEvent = function(event) {
  return new Promise((resolve, reject) => {
    let message = event.message;
    let replyToken = event.replyToken;
    let result;
    let userData = {
      userId: event.source.userId
    };

    if (event.type === "postback") {
      postbackHandle(event)
        .then(rt => {
          result = rt;
          resolve([replyToken, result]);
        })
        .catch(err => {
          result = err;
          resolve([replyToken, result]);
        });
    } else {
      switch (message.type) {
        case "text":
          result = replyText(message);
          console.info("text message detected");
          resolve([replyToken, result]);
          break;
        case "location":
          let user_locate = message.latitude + "," + message.longitude;
          /************************************************************** */
          googleApi
            .nearBySearch(user_locate)
            .then(res => {
              if (res.length > 0) {
                result = { type: "text", text: "ไม่พบสิ่งที่ค้นหา" };
              } else {
                console.log(res);
                console.log(typeof res);
                result = { type: "text", text: JSON.stringify(res.data[0]) };
              }
              resolve([replyToken, result]);
            })
            .catch(err => {
              result = { type: "text", text: JSON.stringify(err.message) };
              resolve([replyToken, result]);
            });
          /************************************************************** */
          break;
        default:
          result = { type: "text", text: "ไม่สามารถค้นหาคำสั่งนี้พบ" };
          resolve([replyToken, result]);
          break;
      }
    }
  });
};

function replyText(message) {
  let reply = "";
  reply = {
    type: "text",
    text: message.text
  };

  return reply;
}

function postbackHandle(event) {
  return new Promise((resolve, reject) => {
    let reply = {
      type: "text",
      text: event.postback.data
    };

    let userId = event.source.userId;
    let action = event.postback.data;

    /************************************Start user data update action**********************************/
    let userData = {
      userId,
      action,
      lastedUse: new Date()
    };

    userService
      .updateUser(userData)
      .then(doc => {
        switch (action) {
          case "richmenu_bus":
            reply = {
              type: "text",
              text: "กรุณาเลือกสถานที่ต้นทางด้วยครับ",
              quickReply: {
                items: [
                  {
                    type: "action",
                    action: {
                      type: "location",
                      label: "Send location"
                    }
                  }
                ]
              }
            };
            resolve(reply);
            break;
          case "richmenu_hotel":
            reply = {
              type: "text",
              text: "กรุณาเลือกสถานที่ปัจจุบัน",
              quickReply: {
                items: [
                  {
                    type: "action",
                    action: {
                      type: "location",
                      label: "เลือกสถานที่"
                    }
                  }
                ]
              }
            };
            resolve(reply);
            break;
          default:
            break;
        }  
      })
      .catch(err => {
        console.error("Error getting document", err);
        reply.text("Error");
        reject(reply);
      });
    /************************************End user data update action**********************************/
  });
}
