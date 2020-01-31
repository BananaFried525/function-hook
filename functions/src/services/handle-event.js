/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable no-case-declarations */
/* eslint-disable promise/always-return */
const googleApi = require("./google-api");
const flexService = require("./service-flex");
const userService = require("./user");
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
      if (event.type === "postback") {
        let isDetail = event.postback.data.split(`^`)[0] ? true : false;
        if (isDetail) {
          let resDetail = await checkDetail(event);
          result = resDetail;
          resolve([replyToken, result]);
        } else {
          let resPostback = await postbackHandle(event);
          result = resPostback;
          resolve([replyToken, result]);
        }
        // /**
        //  * !จับ error case
        //  * *เว็บและเบอร์โทรไม่มีข้อมูล
        //  */
        // switch (event.postback.data) {
        //   case "error_web":
        //     resolve([
        //       replyToken,
        //       {
        //         type: "text",
        //         text: "ขออภัยด้วยครับเราไม่ข้อมูลเว็บดังกล่าว :("
        //       }
        //     ]);
        //     break;
        //   case "error_tel":
        //     resolve([
        //       replyToken,
        //       {
        //         type: "text",
        //         text: "ขออภัยด้วยครับเราไม่ข้อมูลเบอร์โทรดังกล่าว :("
        //       }
        //     ]);
        //     break;
        //   // eslint-disable-next-line no-fallthrough
        //   default:
        //     break;
        // }
        // var details = event.postback.data.split("^")[0];
        // var place_id = event.postback.data.split("^")[1];
        // var photo_ref = event.postback.data.split("^")[2];
        // /**
        //  * !จับ เคส detail
        //  * *
        //  */
        // switch (details) {
        //   case "placeId_hotel":
        //     const url_photo = await googleApi.placePhotoreFerence(photo_ref);
        //     const getdetail = await googleApi.PlaceDetail(place_id);
        //     const detail = getdetail.data.result;
        //     const review = detail.reviews;
        //     const time_open = detail.opening_hours;
        //     const flexDetail_result = await flexService.flexdetail(
        //       detail,
        //       url_photo.data
        //     );
        //     var flexTime_result;
        //     var flexReivew_result;
        //     time_open
        //       ? (flexTime_result = await flexService.flextime(time_open))
        //       : "";
        //     review
        //       ? (flexReivew_result = await flexService.flexreview(review))
        //       : "";
        //     let prototype = {
        //       type: "flex",
        //       altText: "Flex Message",
        //       contents: {
        //         type: "carousel",
        //         contents: []
        //       }
        //     };
        //     prototype.contents.contents.push(flexDetail_result.data);
        //     flexTime_result
        //       ? prototype.contents.contents.push(flexTime_result.data)
        //       : "";
        //     flexReivew_result.data.forEach(e => {
        //       prototype.contents.contents.push(e);
        //     });
        //     resolve([
        //       replyToken,
        //       [
        //         prototype,
        //         { type: "text", text: "คุณต้องการจะสอบถามเรื่องอื่นอีกหรือไม่" }
        //       ]
        //     ]);
        //     break;
        //   default:
        //     break;
        // }
        // } else if (event.type === "postback") {
        //   let resPostback = await postbackHandle(event);
        //   result = resPostback;
        //   resolve([replyToken, result]);
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
                  var tempflex = {
                    type: "flex",
                    altText: "Flex Message",
                    contents: {
                      type: "carousel",
                      contents: []
                    }
                  };
                  const dataApi = await googleApi.textSearch("ชลบุรี+โรงแรม");
                  const objectPlace = await flexService.getSeletedPlace(
                    tempflex,
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
                  var tempflex = {
                    type: "flex",
                    altText: "Flex Message",
                    contents: {
                      type: "carousel",
                      contents: []
                    }
                  };
                  const dataApi = await googleApi.textSearch("ระยอง+ร้านอาหาร");
                  const objectPlace = await flexService.getSeletedPlace(
                    tempflex,
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
                  var tempflex = {
                    type: "flex",
                    altText: "Flex Message",
                    contents: {
                      type: "carousel",
                      contents: []
                    }
                  };
                  const dataApi = await googleApi.textSearch("น่าน+โรงแรม");
                  const objectPlace = await flexService.getSeletedPlace(
                    tempflex,
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
                var tempflex = {
                  type: "flex",
                  altText: "Flex Message",
                  contents: {
                    type: "carousel",
                    contents: []
                  }
                };
                const dataApi = await googleApi.textSearch(
                  "ลำปาง+แหล่งท่องเที่ยว"
                );
                const objectPlace = await flexService.getSeletedPlace(
                  tempflex,
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
        resolve([
          replyToken,
          {
            type: "text",
            text: "ขออภัยด้วยครับเราไม่ข้อมูลเว็บดังกล่าว :("
          }
        ]);
        break;
      case "error_tel":
        resolve([
          replyToken,
          {
            type: "text",
            text: "ขออภัยด้วยครับเราไม่ข้อมูลเบอร์โทรดังกล่าว :("
          }
        ]);
        break;
      // eslint-disable-next-line no-fallthrough
      default:
        break;
    }

    var details = element.postback.data.split("^")[0];
    var place_id = element.postback.data.split("^")[1];
    var photo_ref = element.postback.data.split("^")[2];

    /**
     * !จับ เคส detail
     */
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
        var flexTime_result;
        var flexReivew_result;

        time_open
          ? (flexTime_result = await flexService.flextime(time_open))
          : "";
        review
          ? (flexReivew_result = await flexService.flexreview(review))
          : "";
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
        resolve([
          replyToken,
          [
            prototype,
            { type: "text", text: "คุณต้องการจะสอบถามเรื่องอื่นอีกหรือไม่" }
          ]
        ]);
        break;
      default:
        break;
    }
  });
}
