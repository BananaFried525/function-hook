/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable no-case-declarations */
/* eslint-disable promise/always-return */
const googleApi = require("./google-api");
const flexService = require("./service-flex");
const userService = require("./user");
var templace = require("../config/config-flexbox")["flexbox_prototypePlace"];
const transactionService = require("./transaction");
const tempDirectionBus = require("../template/busdirection.json");
const _ = require("underscore");
module.exports.handleEvent = function(event) {
  return new Promise(async (resolve, reject) => {
    let message = event.message;
    let replyToken = event.replyToken;
    let result;
    let userId = event.source.userId;

    try {
      if (event.type === "postback" && event.postback.text === "ดูรายละเอียด") {
        const details = event.postback.data.split("^")[0];
        const place_id = event.postback.data.split("^")[1];
        const photo_ref = event.postback.data.split("^")[2];
        switch (details) {
          case "placeId_hotel":
            const url_photo = await googleApi.placePhotoreFerence(photo_ref);
            const getdetail = await googleApi.PlaceDetail(place_id);
            const detail = getdetail.data.result;
            const review = detail.reviews;
            const time_open = detail.opening_hours;
            const flexDetail_result = await flexService.flexdetail(
              detail,
              url_photo.data
            );
            console.log(time_open, "time_open");
            // const flexTime_result = await flexService.flextime(time_open);
            // console.log(flexTime_result.data, "flex result");

            resolve([
              replyToken,
              [
                flexDetail_result.data,
                {
                  type: "text",
                  text: "คุณต้องการที่จะสอบเรื่องอื่นอีกมั้ยครับ ?"
                }
              ]
            ]);

            break;
          default:
            break;
        }
      } else if (event.type === "postback") {
        let resPostback = await postbackHandle(event);
        result = resPostback;
        resolve([replyToken, result]);
      } else {
        let isComplete = false; // เอาไว้ใช้ในกรณีที่ทำ action เสร็จ
        // ดึง User เพื่อเช็ค action
        let User = await userService.getUser(userId);
        if (User.action === "richmenu_hotel") {
          // ดัก action
          // แก้การใช้ function
          let user_locate = message.latitude + "," + message.longitude;
          let resGoogle = await googleApi.nearBySearch(user_locate);
          if (resGoogle.data.length === 0) {
            result = { type: "text", text: "ไม่พบสิ่งที่ค้นหา" };
          } else {
            console.log(resGoogle);
            console.log(typeof resGoogle);
            result = {
              type: "text",
              text: JSON.stringify(resGoogle.data[0])
            };
          }
          isComplete = true;

          // Clear user action
          if (isComplete) completeAction(userId);
          resolve([replyToken, result]);
        } else if (User.action === "richmenu_bus") {
          if (!User.transaction.origin) {
            let origin = message.latitude + "," + message.longitude;
            console.log(`User origin => ${origin}`);
            User.transaction.origin = origin;
            User.transaction.timeStamp = new Date();
            await userService.updateUser(User);
            result = {
              type: "text",
              text: "กรุณาเลือกสถานที่ปลายทางด้วยครับ",
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

            /**
             * !Direction Bus
             */
          } else if (!User.transaction.destination) {
            let destination = message.latitude + "," + message.longitude;
            console.log(`User destination => ${destination}`);
            User.transaction.destination = destination;
            User.transaction.timeStamp = new Date();
            console.log(`Sort by location`);
            //พอกำหนดเสร็จให้ทำการ search ทันที
            let resSort = await googleApi.sortedBus(User.transaction);
            let steps = resSort.routes[0].legs[0].steps;
            let content = [];
            let temp = tempDirectionBus;
            await steps.forEach((step, i) => {
              if (step.travel_mode === "WALKING") {
                console.log(step.html_instructions);
                let walking = {
                  type: "text",
                  text: `${step.html_instructions}`,
                  wrap: true
                };
                content.push(walking);
              } else if (step.travel_mode === "TRANSIT") {
                console.log(`เป้าหมาย => `, step.transit_details.headsign);
                console.log(
                  `หมายเลขรถ =>`,
                  step.transit_details.line.short_name
                );
                console.log(`รถเมล์สาย =>`, step.transit_details.line.name);
                console.log(`นั่ง => `, step.html_instructions);
                let bus1 = {
                  type: "text",
                  text: `ปลายทาง: ${step.transit_details.headsign}`,
                  wrap: true
                };
                let bus2 = {
                  type: "text",
                  text: `รถเมล์สาย: ${step.transit_details.line.short_name} (${step.transit_details.line.name})`,
                  wrap: true
                };
                content.push(bus1, bus2);
              }
              let separator = {
                type: "separator",
                margin: "xs",
                color: "#3F3F3F"
              };
              content.push(separator);
            });
            temp.contents.body.contents = content;
            console.info(temp);
            result = temp;
            isComplete = true;
            User.transaction.isComplete = true;
            await userService.updateUser(User);
          }

          // Clear user action
          if (isComplete) completeAction(userId);

          resolve([replyToken, result]);
        } else {
          switch (message.type) {
            case "text":
              if (message.text === "ชลบุรี") {
                try {
                  // var tempplaceFlexbox = _.clone(templace);
                  const dataApi = await googleApi.textSearch("ชลบุรี+โรงแรม");
                  const objectPlace = await getSeletedPlace(
                    templace,
                    dataApi.data
                  );
                  resolve([replyToken, objectPlace]);
                  // eslint-disable-next-line no-empty
                } catch (error) {
                  console.log(error);

                  resolve([
                    replyToken,
                    { type: "text", text: "กรุณาลองใหม่อีกครั้ง" }
                  ]);
                }
              } else if (message.text === "ระยอง") {
                try {
                  // eslint-disable-next-line no-redeclare

                  const dataApi = await googleApi.textSearch("ระยอง+ร้านอาหาร");
                  const objectPlace = await getSeletedPlace(
                    templace,
                    dataApi.data
                  );
                  resolve([replyToken, objectPlace]);
                  // eslint-disable-next-line no-empty
                } catch (error) {
                  console.log(error);

                  resolve([
                    replyToken,
                    { type: "text", text: "กรุณาลองใหม่อีกครั้ง" }
                  ]);
                }
              } else if (message.text === "น่าน") {
                try {
                  // eslint-disable-next-line no-redeclare

                  const dataApi = await googleApi.textSearch("น่าน+ร้านอาหาร");
                  const objectPlace = await getSeletedPlace(
                    templace,
                    dataApi.data
                  );
                  resolve([replyToken, objectPlace]);
                  // eslint-disable-next-line no-empty
                } catch (error) {
                  console.log(error);

                  resolve([
                    replyToken,
                    { type: "text", text: "กรุณาลองใหม่อีกครั้ง" }
                  ]);
                }
              } else if (message.text === "ลำปาง") {
                // eslint-disable-next-line no-redeclare
                var tempplaceFlexbox = _.clone(templace);
                const dataApi = await googleApi.textSearch(
                  "ลำปาง+แหล่งท่องเที่ยว"
                );
                const objectPlace = await getSeletedPlace(
                  templace,
                  dataApi.data
                );
                resolve([replyToken, objectPlace]);
                // eslint-disable-next-line no-empty
              } else {
                result = replyText(message);
                console.info("text message detected");
                resolve([replyToken, result]);
              }

              break;
            default:
              result = { type: "text", text: "ไม่สามารถค้นหาคำสั่งนี้พบ" };
              resolve([replyToken, result]);
              break;
          }
        }
      }
    } catch (err) {
      result = err;
      result = { type: "text", text: err };
      reject([replyToken, result]);
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
                  data: ""
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
  return new Promise(async (resolve, reject) => {
    let reply = {
      type: "text",
      text: event.postback.data
    };

    try {
      let userId = event.source.userId;
      let action = event.postback.data;
      let transaction = await transactionService.addTransaction(action);
      console.info(`PostbackHandle Action => ${action}`);
      /************************************Start user data update action**********************************/
      let userData = {
        userId,
        action,
        lastedUse: new Date(),
        transaction
      };
      console.log(`New user data`, userData);
      let doc = await userService.updateUser(userData);
      switch (action) {
        case "richmenu_bus":
          reply = [
            { type: "text", text: `คุณได้ทำการเลือกการค้นหาเส้นทางรถเมล์` },
            {
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
            }
          ];
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
    } catch (error) {
      console.error("Error getting document", error);
      reply.text("Error");
      reject(reply);
    }
  });
}

async function completeAction(userId) {
  let actionChange = {
    userId,
    lastedUse: new Date(),
    action: "non"
  };
  await userService.updateUser(actionChange);
}
