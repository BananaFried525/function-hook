/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable no-case-declarations */
/* eslint-disable promise/always-return */
const googleApi = require("./google-api");
const flexService = require("./service-flex");
const userService = require("./user");
const lovService = require("./lov");
const transactionService = require("./transaction");
const tempDirectionBus = require("../template/busdirection.json");
const _ = require("underscore");

module.exports.handleEvent = function(event, USER) {
  return new Promise(async (resolve, reject) => {
    let message = event.message;
    let replyToken = event.replyToken;
    let result;
    let userId = event.source.userId;
    let userDetail = USER;

    try {
      if (event.type === "postback") {
        let isDetail =
          event.postback.data.split(`^`)[3] === "detail" ? true : false;
        if (isDetail) {
          let resDetail = await checkDetail(event);
          result = resDetail;
          resolve([replyToken, result]);
        } else {
          let resPostback = await postbackHandle(event);
          result = resPostback;
          resolve([replyToken, result]);
        }
      } else {
        let isComplete = false; // เอาไว้ใช้ในกรณีที่ทำ action เสร็จ
        var temp = {
          type: "flex",
          altText: "Flex Message",
          contents: {
            type: "carousel",
            contents: []
          }
        };
        /**
         * !Search Hotel
         */
        if (userDetail.action === "richmenu_hotel") {
          if (message.type === "text") {
            userDetail.transaction.location = message.text;
            userDetail.transaction.timeStamp = new Date();
            await userService.updateUser(userDetail);
            let resProvice = await lovService.getLov(message.text);
            if (resProvice) {
              const dataApi = await googleApi.textSearch(
                `${resProvice.lovName}+โรงแรม`
              );
              const objectPlace = await flexService.getSeletedPlace(
                temp,
                dataApi.data,
                "placeId_hotel"
              );
              console.info(`Line response =>`, objectPlace);
              result = objectPlace;
              isComplete = true;
            } else {
              console.error("invalid provice");
              result = {
                type: "text",
                text: "กรุณาพิมพ์ชื่อจังหวัดให้ถูกต้อง"
              };
            }
          } else {
            let user_locate = message.latitude + "," + message.longitude;
            userDetail.transaction.location = user_locate;
            userDetail.transaction.timeStamp = new Date();
            await userService.updateUser(userDetail);
            let resNearby = await googleApi.nearBySearch(
              user_locate,
              "lodging"
            );
            if (resNearby.data.length === 0) {
              console.error(`not found`);
              result = { type: "text", text: "ไม่พบสิ่งที่ค้นหา" };
            } else {
              console.info(``, resNearby.data);
              // แก้ตัวแมพ
              let objectPlace = await flexService.getSeletedPlace(
                temp,
                resNearby.data,
                "placeId_hotel"
              );
              console.info(`Line response =>`, objectPlace);
              result = objectPlace;
              isComplete = true;
            }
          }
          if (isComplete) completeAction(userId);
          resolve([replyToken, result]);
        } else if (userDetail.action === "richmenu_bus") {
          if (message.type !== `location`) {
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
            resolve([replyToken, result]);
          }
          /**
           * !Direction Bus
           */
          if (!userDetail.transaction.origin) {
            let origin = message.latitude + "," + message.longitude;
            console.log(`User origin => ${origin}`);
            userDetail.transaction.origin = origin;
            userDetail.transaction.timeStamp = new Date();
            await userService.updateUser(userDetail);
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
          } else if (!userDetail.transaction.destination) {
            let destination = message.latitude + "," + message.longitude;
            console.log(`userDetail destination => ${destination}`);
            userDetail.transaction.destination = destination;
            userDetail.transaction.timeStamp = new Date();
            console.log(`Sort by location`);
            //พอกำหนดเสร็จให้ทำการ search ทันที
            let resSort = await googleApi.sortedBus(userDetail.transaction);
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
            userDetail.transaction.isComplete = true;
            await userService.updateUser(userDetail);
          }
          // Clear user action
          if (isComplete) completeAction(userId);
          resolve([replyToken, result]);
        } else if (userDetail.action === "richmenu_restaurant") {
          /**
           * !Search Restaurant
           */
          if (message.type === "text") {
            userDetail.transaction.location = message.text;
            userDetail.transaction.timeStamp = new Date();
            await userService.updateUser(userDetail);
            let resProvice = await lovService.getLov(message.text);
            if (resProvice) {
              const dataApi = await googleApi.textSearch(
                `${resProvice.lovName}+ร้านอาหาร`
              );
              const objectPlace = await flexService.getSeletedPlace(
                temp,
                dataApi.data,
                "placeId_restaurant"
              );
              console.info(`Line response =>`, objectPlace);
              result = objectPlace;
              isComplete = true;
            } else {
              console.error("invalid provice");
              result = {
                type: "text",
                text: "กรุณาพิมพ์ชื่อจังหวัดให้ถูกต้อง"
              };
            }
          } else {
            let user_locate = message.latitude + "," + message.longitude;
            userDetail.transaction.location = user_locate;
            userDetail.transaction.timeStamp = new Date();
            await userService.updateUser(userDetail);
            let resNearby = await googleApi.nearBySearch(
              user_locate,
              "restaurant"
            );
            if (resNearby.data.length === 0) {
              console.error(`not found`);
              result = { type: "text", text: "ไม่พบสิ่งที่ค้นหา" };
            } else {
              console.info(``, resNearby.data);
              // แก้ตัวแมพ
              let objectPlace = await flexService.getSeletedPlace(
                temp,
                resNearby.data,
                "placeId_restaurant"
              );
              console.info(`Line response =>`, objectPlace);
              result = objectPlace;
              isComplete = true;
            }
          }
          if (isComplete) completeAction(userId);
          resolve([replyToken, result]);
        } else if (userDetail.action === "richmenu_tourist") {
          /**
           * !Search Tourist_attraction
           */
          if (message.type === "text") {
            userDetail.transaction.location = message.text;
            userDetail.transaction.timeStamp = new Date();
            await userService.updateUser(userDetail);
            let resProvice = await lovService.getLov(message.text);
            if (resProvice) {
              const dataApi = await googleApi.textSearch(
                `${resProvice.lovName}+แหล่งท่องเที่ยว`
              );
              const objectPlace = await flexService.getSeletedPlace(
                temp,
                dataApi.data,
                "placeId_touristattraction" // แก้
              );
              console.info(`Line response =>`, objectPlace);
              result = objectPlace;
              isComplete = true;
            } else {
              console.error("invalid provice");
              result = {
                type: "text",
                text: "กรุณาพิมพ์ชื่อจังหวัดให้ถูกต้อง"
              };
            }
          } else {
            let user_locate = message.latitude + "," + message.longitude;
            userDetail.transaction.location = user_locate;
            userDetail.transaction.timeStamp = new Date();
            await userService.updateUser(userDetail);
            let resNearby = await googleApi.nearBySearch(
              user_locate,
              "tourist_attraction"
            );
            if (resNearby.data.length === 0) {
              console.error(`not found`);
              result = { type: "text", text: "ไม่พบสิ่งที่ค้นหา" };
            } else {
              console.info(``, resNearby.data);
              // แก้ตัวแมพ
              let objectPlace = await flexService.getSeletedPlace(
                temp,
                resNearby.data,
                "placeId_touristattraction"
              );
              console.info(`Line response =>`, objectPlace);
              result = objectPlace;
              isComplete = true;
            }
          }
          if (isComplete) completeAction(userId);
          resolve([replyToken, result]);
        } else {
          switch (message.type) {
            case "text":
              result = replyText(message);
              console.info("text message detected");
              resolve([replyToken, result]);
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
    text: "กรุณาเลือกทำรายการ"
  };
  return reply;
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
      console.info(`PostbackHandle Action =>`, action);
      let transaction = await transactionService.addTransaction(action);
      /************************************Start user data update action**********************************/
      let userData = {
        userId,
        action,
        lastedUse: new Date(),
        transaction
      };
      console.log(`New user data`, userData);
      await userService.updateUser(userData);
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
            text: "กรุณาเลือกสถานที่ปัจจุบันหรือพิมพ์ชื่อจังหวัด",
            quickReply: {
              items: [
                {
                  type: "action",
                  action: {
                    type: "location",
                    label: "กรุณาเลือกสถานที่"
                  }
                }
              ]
            }
          };
          resolve(reply);
          break;
        case "richmenu_restaurant":
          reply = {
            type: "text",
            text: "กรุณาเลือกสถานที่ปัจจุบันหรือพิมพ์ชื่อจังหวัด",
            quickReply: {
              items: [
                {
                  type: "action",
                  action: {
                    type: "location",
                    label: "กรุณาเลือกสถานที่"
                  }
                }
              ]
            }
          };
          resolve(reply);
          break;
        case "richmenu_tourist":
          reply = {
            type: "text",
            text: "กรุณาเลือกสถานที่ปัจจุบันหรือพิมพ์ชื่อจังหวัด",
            quickReply: {
              items: [
                {
                  type: "action",
                  action: {
                    type: "location",
                    label: "กรุณาเลือกสถานที่"
                  }
                }
              ]
            }
          };
          resolve(reply);
          break;
        default:
          reply = {
            type: "text",
            text: "เรายังไม่เปิดให้ใช้งานหรืออยู่ในการปรับปรุง"
          };
          resolve(reply);
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

/**
 *
 */
async function checkDetail(element) {
  return new Promise(async (resolve, reject) => {
    /**
     * !จับ error case
     * *เว็บและเบอร์โทรไม่มีข้อมูล
     */
    switch (element.postback.data) {
      case "error_web":
        resolve({
          type: "text",
          text: "ขออภัยด้วยครับเราไม่ข้อมูลเว็บดังกล่าว :("
        });
        break;
      case "error_tel":
        resolve({
          type: "text",
          text: "ขออภัยด้วยครับเราไม่ข้อมูลเบอร์โทรดังกล่าว :("
        });
        break;
      // eslint-disable-next-line no-fallthrough
      default:
        break;
    }

    var details = element.postback.data.split("^")[0];
    var place_id = element.postback.data.split("^")[1];
    var photo_ref = element.postback.data.split("^")[2];

    var flexTime_result;
    var flexReivew_result;

    /**
     * !จับ เคส detail
     */
    const url_photo = await googleApi.placePhotoreFerence(photo_ref);
    const getdetail = await googleApi.PlaceDetail(place_id);
    const detail = getdetail.data.result;

    const review = detail.reviews;
    const time_open = detail.opening_hours;
    const flexDetail_result = await flexService.flexdetail(
      detail,
      url_photo.data
    );

    time_open ? (flexTime_result = await flexService.flextime(time_open)) : "";
    review ? (flexReivew_result = await flexService.flexreview(review)) : "";
    let prototype = {
      type: "flex",
      altText: "Flex Message",
      contents: {
        type: "carousel",
        contents: []
      }
    };

    prototype.contents.contents.push(flexDetail_result.data);
    flexTime_result
      ? prototype.contents.contents.push(flexTime_result.data)
      : "";
    flexReivew_result.data.forEach(e => {
      prototype.contents.contents.push(e);
    });
    resolve(prototype, {
      type: "text",
      text: "คุณต้องการจะสอบถามเรื่องอื่นอีกหรือไม่"
    });
  });
}
