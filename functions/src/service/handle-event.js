/* eslint-disable promise/always-return */
const db = require("./firestore");
const transition = require("../schema/transition.schema");
const googleApi = require("./google-api");

module.exports.handleEvent = function(event) {
  return new Promise((resolve, reject) => {
    var message = event.message;
    var replyToken = event.replyToken;
    var result;

    if (event.type === "postback") {
      result = postbackHandle(event);
      resolve([replyToken, result]);
    } else {
      switch (message.type) {
        case "text":
          result = replyText(message);
          console.info("text message detected");

          break;
        case "location":
          var user_locate = message.latitude + "," + message.longitude;
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
  var reply = "";
  reply = {
    type: "text",
    text: message.text
  };

  return reply;
}

function postbackHandle(event) {
  var reply = {
    type: "text",
    text: event.postback.data
  };

  var userId = event.source.userId;
  var fnType = event.postback.data;
  var timestamp = new Date();

  var data = {
    userId,
    fnType,
    timestamp
  };

  var validate = new transition(data);
  if (validate.isErrors()) {
    console.error(validate.getErrors());
  }
  switch (fnType) {
    case "bus_direction":
      // var trans = db.collection("transitions").doc();
      // var userTrans = trans
      //   .set({ data })
      //   .then(() => {
      //     console.info("Put to firestore");
      //   })
      //   .catch(err => {
      //     console.err(err);
      //     return;
      //   });

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
                label: "ค้นหาโรงแรมโดยรอบ"
              }
            },
            {
              type: "action",
              action: {
                type: "postback",
                label: "ค้นหาโรงแรมจากจังหวัด",
                data: "action_hotel"
              }
            }
          ]
        }
      };

      break;
    default:
      break;
  }

  return reply;
}
