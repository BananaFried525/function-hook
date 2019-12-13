/* eslint-disable promise/always-return */
const db = require("./firestore");
const transition = require("../schema/transition.schema");
const googleApi = require("./google-api");

module.exports.handleEvent = function (event) {
  var message = event.message;
  var replyToken = event.replyToken;
  var result;

  if (event.type === "postback") {
    result = postbackHandle(event);
  } else {
    switch (message.type) {
      case "text":
        result = replyText(message);
        console.info("text message detected");
        break;
      case 'location':
        var user_locate = message.latitude+','+message.longitude;
        googleApi.nearBySearch(user_locate)
          .then((res)=>{
            result = { type: 'text', text: JSON.stringify(res.data)};
          }).catch((err)=>{
            result = { type: 'text', text: JSON.stringify(err.message)};
          }); // มัน return ก่อน+++

        // if(res.status){
        //   result = { type: 'text', text: JSON.stringify(res.data) };
        // }else{
        //   result = { type: 'text', text: JSON.stringify(res.message) };
        // }
        break;
      default:
        result = { type: 'text', text: 'ไม่สามารถค้นหาคำสั่งนี้พบ' }
        break;
    }
  }

  return [replyToken, result];
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

      var trans = db.collection("transitions").doc();
      var userTrans = trans.set({ data })
        .then(() => {
          console.info("Put to firestore");
        })
        .catch(err => {
          console.err(err);
          return;
        });

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
    case 'richmenu_hotel':
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
      break;
    default:
      break;
  }

  return reply;
}
