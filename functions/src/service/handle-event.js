/* eslint-disable promise/always-return */
const googleApi = require("./google-api");
var templace = require("../config/config-flexbox")["flexbox_prototypePlace"];
var FlexSelected = require("../config/config-flexbox")["flexbox_placeSelect"];
const userService = require("./user");

const _ = require("underscore");
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
          // eslint-disable-next-line no-empty
          if (message.text === "ชลบุรี") {
            googleApi
              .textSearch("ชลบุรี+โรงแรม")
              .then(result => {
                var data = result.data;
                return data;
              })
              .then(data => {
                console.log(data);
                var tempplaceFlexbox = _.clone(templace);
                // eslint-disable-next-line promise/no-nesting
                getSeletedPlace(tempplaceFlexbox, data)
                  .then(result => {
                    resolve([replyToken, result]);
                  })
                  .catch(error => {
                    resolve([replyToken, { type: "text", text: error }]);
                  });
              })
              .catch(error => {
                resolve([replyToken, { type: "text", text: error }]);
              });
          } else {
            result = replyText(message);
            console.info("text message detected");
          }
          break;

        case "location":
          // eslint-disable-next-line no-case-declarations
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
function showdetailPlace(temp, jsondata) {
  return new Promise((res, rej) => {
    var result = jsondata;
    if (result) {
      const flexbox_placeDetail = {};
      const flexbox_placeTime = {};
      const flexbox_placeReview = {};
    } else {
      rej(error);
    }
  });
}
function getSeletedPlace(temp, arr) {
  return new Promise((res, rej) => {
    var results = arr;
    if (results.length > 10) {
      for (let i = 0; i < 10; i++) {
        const flex = {
          type: "bubble",
          body: {
            type: "box",
            layout: "vertical",
            spacing: "sm",
            contents: [
              {
                type: "text",
                text: "ครัวเมืองลำปาง",
                size: "lg",
                align: "start",
                weight: "bold",
                wrap: true
              },
              {
                type: "separator"
              },
              {
                type: "box",
                layout: "baseline",
                contents: [
                  {
                    type: "text",
                    text: "สถานที่ตั้ง:",
                    flex: 4,
                    size: "md",
                    gravity: "bottom",
                    weight: "bold"
                  },
                  {
                    type: "text",
                    text:
                      "100 ถนน ห้วยแก้ว ตำบลสุเทพ อำเภอเมืองเชียงใหม่ เชียงใหม่ 50200",
                    flex: 8,
                    size: "sm",
                    align: "start",
                    weight: "regular",
                    wrap: true
                  },
                  {
                    type: "spacer"
                  }
                ]
              },
              {
                type: "separator"
              },
              {
                type: "box",
                layout: "baseline",
                contents: [
                  {
                    type: "text",
                    text: "สถานะการให้บริการ:",
                    flex: 3,
                    margin: "sm",
                    size: "sm",
                    align: "start",
                    weight: "bold"
                  },
                  {
                    type: "text",
                    text: "เปิดอยู่",
                    flex: 2,
                    margin: "sm",
                    size: "sm",
                    align: "start",
                    weight: "bold",
                    color: "#0CF929"
                  }
                ]
              },
              {
                type: "box",
                layout: "baseline",
                contents: [
                  {
                    type: "text",
                    text: "คะแนนเฉลี่ย",
                    flex: 3,
                    size: "sm",
                    align: "start",
                    weight: "bold"
                  },
                  {
                    type: "icon",
                    url:
                      "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png",
                    size: "xs"
                  },
                  {
                    type: "text",
                    text: "4.0",
                    flex: 5,
                    margin: "sm",
                    size: "sm",
                    align: "start",
                    gravity: "center",
                    weight: "regular"
                  }
                ]
              }
            ]
          },
          footer: {
            type: "box",
            layout: "vertical",
            spacing: "sm",
            contents: [
              {
                type: "button",
                action: {
                  type: "postback",
                  label: "ดูรายละเอียด",
                  data: '{"DATA":"BACD"}'
                },
                color: "#459950",
                style: "primary"
              }
            ]
          }
        };
        flex.body.contents[0].text = results[i].name;
        flex.body.contents[2].contents[1].text = results[i].address;
        flex.body.contents[4].contents[1].text = results[i].status;
        results[i].status === "เปิดอยู่"
          ? (flex.body.contents[4].contents[1].color = "#459950")
          : (flex.body.contents[4].contents[1].color = "#cccccc");
        flex.body.contents[5].contents[2].text = results[i].rateing.toString();
        flex.footer.contents[0].action.data = `placeId_hotel,${results[i].place_id},${results[i].photo}`;
        temp.contents.contents.push(flex);
      }
    } else if (results.length < 10) {
      results.forEach(result => {
        const flex = {
          type: "bubble",
          body: {
            type: "box",
            layout: "vertical",
            spacing: "sm",
            contents: [
              {
                type: "text",
                text: "ครัวเมืองลำปาง",
                size: "lg",
                align: "start",
                weight: "bold",
                wrap: true
              },
              {
                type: "separator"
              },
              {
                type: "box",
                layout: "baseline",
                contents: [
                  {
                    type: "text",
                    text: "สถานที่ตั้ง:",
                    flex: 4,
                    size: "md",
                    gravity: "bottom",
                    weight: "bold"
                  },
                  {
                    type: "text",
                    text:
                      "100 ถนน ห้วยแก้ว ตำบลสุเทพ อำเภอเมืองเชียงใหม่ เชียงใหม่ 50200",
                    flex: 8,
                    size: "sm",
                    align: "start",
                    weight: "regular",
                    wrap: true
                  },
                  {
                    type: "spacer"
                  }
                ]
              },
              {
                type: "separator"
              },
              {
                type: "box",
                layout: "baseline",
                contents: [
                  {
                    type: "text",
                    text: "สถานะการให้บริการ:",
                    flex: 3,
                    margin: "sm",
                    size: "sm",
                    align: "start",
                    weight: "bold"
                  },
                  {
                    type: "text",
                    text: "เปิดอยู่",
                    flex: 2,
                    margin: "sm",
                    size: "sm",
                    align: "start",
                    weight: "bold",
                    color: "#0CF929"
                  }
                ]
              },
              {
                type: "box",
                layout: "baseline",
                contents: [
                  {
                    type: "text",
                    text: "คะแนนเฉลี่ย",
                    flex: 3,
                    size: "sm",
                    align: "start",
                    weight: "bold"
                  },
                  {
                    type: "icon",
                    url:
                      "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png",
                    size: "xs"
                  },
                  {
                    type: "text",
                    text: "4.0",
                    flex: 5,
                    margin: "sm",
                    size: "sm",
                    align: "start",
                    gravity: "center",
                    weight: "regular"
                  }
                ]
              }
            ]
          },
          footer: {
            type: "box",
            layout: "vertical",
            spacing: "sm",
            contents: [
              {
                type: "button",
                action: {
                  type: "postback",
                  label: "ดูรายละเอียด",
                  data: '{"DATA":"BACD"}'
                },
                color: "#459950",
                style: "primary"
              }
            ]
          }
        };
        flex.body.contents[0].text = result.name;
        flex.body.contents[2].contents[1].text = result.address;
        flex.body.contents[4].contents[1].text = result.status;
        result.status === "เปิดอยู่"
          ? (flex.body.contents[4].contents[1].color = "#459950")
          : (flex.body.contents[4].contents[1].color = "#cccccc");
        flex.body.contents[5].contents[2].text = results.rateing.toString();
        flex.footer.contents[0].action.data = `placeId_hotel,${results.place_id},${result.photo}`;
        temp.contents.contents.push(flex);
      });
    } else {
      rej(error);
    }
    var obj = temp;
    res(obj);
  });
}

function postbackHandle(event) {
  var reply = {
    type: "text",
    text: event.postback.data
  };
  var userId = event.source.userId;
  var fnType = event.postback.data;
  var timestamp = new Date();

  return new Promise((resolve, reject) => {
    let reply = {
      type: "text",
      text: event.postback.data
    };

    let userId = event.source.userId;
    let action = event.postback.data;
    let place_action = action.split(",");
    /************************************Start user data update action**********************************/
    let userData = {
      userId,
      action,
      lastedUse: new Date()
    };
    // eslint-disable-next-line no-empty
    if (place_action[0] === "placeId_hotel") {
      const place_id = _.isString(place_action[1]) ? place_action[1] : "";
      const photo_ref = _.isString(place_action[2]) ? place_action[2] : "";
      // eslint-disable-next-line promise/catch-or-return
      // const templace = _.clone(templace);
      googleApi
        .PlaceDetail(place_id)
        .then(result => {
          return result.data; // obj placeDetail;
        })
        .then(data => {
          console.log(data);
          resolve({ type: "text", text: `${place_id},${photo_ref}` });
        })
        .catch(error_data => {
          if (error_data)
            resolve({
              type: "text",
              text: `เกิดข้อผิดพลาด กรุณาทำรายการใหม่อีกครั้ง`
            });
        });
    }
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
                      type: "ค้นหาโรงแรมรอบๆ",
                      label: "Send location"
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
            resolve(reply);
            break;
          case "richmenu_hotel":
            // eslint-disable-next-line no-case-declarations
            reply = {
              type: "text",
              text: "เลือกวิธีการค้นหาได้เลยครับ",
              quickReply: {
                items: [
                  {
                    type: "action",
                    action: {
                      type: "location",
                      label: "เลือกสถานที่รอบๆ"
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
            resolve(reply);
            break;
          case "action_hotel":
            // eslint-disable-next-line promise/no-nesting
            resolve({
              type: "text",
              text: "กรุณาพิมพ์ชื่อจังหวัดที่คุณต้องการค้นหาได้เลยครับ"
            });
          // eslint-disable-next-line no-fallthrough

          // eslint-disable-next-line no-fallthrough
          case "placeId_hotel":
            resolve({
              type: "text",
              text: "test01"
            });
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
