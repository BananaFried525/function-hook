/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable no-case-declarations */
/* eslint-disable promise/always-return */
const googleApi = require("./google-api");
const flexService = require("./service-flex");
const userService = require("./user");
var templace = require("../config/config-flexbox")["flexbox_prototypePlace"];
const transactionService = require("./transaction");
const tempDirectionBus = require("../template/busdirection.json");

module.exports.handleEvent = function(event) {
  return new Promise(async (resolve, reject) => {
    let message = event.message;
    let replyToken = event.replyToken;
    let result;
    let userId = event.source.userId;

    try {
      if (event.type === "postback") {
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
            let review1 = {
              type: "flex",
              altText: "Flex Message",
              content: {
                type: "bubble",
                header: {
                  type: "box",
                  layout: "horizontal",
                  content: [
                    {
                      type: "text",
                      text: "REVIEW",
                      size: "sm",
                      weight: "bold",
                      color: "#AAAAAA"
                    }
                  ]
                },
                hero: {
                  type: "image",
                  url:
                    "https://lh4.ggpht.com/-bXx83tZHuW8/AAAAAAAAAAI/AAAAAAAAAAA/R9umGJGU518/s128-c0x00000000-cc-rp-mo-ba4/photo.jpg",
                  size: "xl",
                  aspectRatio: "20:13",
                  action: {
                    type: "uri",
                    label: "Action",
                    uri: "https://linecorp.com/"
                  }
                },
                body: {
                  type: "box",
                  layout: "vertical",
                  spacing: "md",
                  content: [
                    {
                      type: "box",
                      layout: "vertical",
                      content: [
                        {
                          type: "text",
                          text: "ลุงยุทธ บานไม่รู้โรย",
                          flex: 8,
                          size: "lg",
                          align: "center",
                          gravity: "bottom",
                          weight: "bold",
                          wrap: true
                        },
                        {
                          type: "separator"
                        }
                      ]
                    },
                    {
                      type: "box",
                      layout: "vertical",
                      content: [
                        {
                          type: "text",
                          text: "ความคิดเห็น:",
                          flex: 8,
                          size: "md",
                          align: "start",
                          gravity: "center",
                          weight: "bold",
                          wrap: true
                        },
                        {
                          type: "text",
                          text:
                            "รสอาหารใช่ได้แต่พนักควรเปลี่ยนยกทีมไปซืัอกินนะไม่ได้ขอกินฟรีพูดจาไม่ดีสมควรเปลี่ยนยกทีมเลย",
                          flex: 1,
                          size: "md",
                          align: "start",
                          wrap: true
                        }
                      ]
                    },
                    {
                      type: "box",
                      layout: "baseline",
                      content: [
                        {
                          type: "text",
                          text: "การให้คะแนน:",
                          flex: 0,
                          margin: "sm",
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
                          text: " 2.5"
                        }
                      ]
                    },
                    {
                      type: "box",
                      layout: "baseline",
                      content: [
                        {
                          type: "text",
                          text: "แสดงความคิดเห็นเมื่อ",
                          flex: 6,
                          margin: "sm",
                          size: "sm",
                          align: "start",
                          weight: "bold"
                        },
                        {
                          type: "text",
                          text: "2 ปีที่แล้ว",
                          flex: 4,
                          margin: "sm",
                          size: "sm",
                          align: "start",
                          weight: "bold",
                          color: "#EA7F7F"
                        }
                      ]
                    }
                  ]
                },
                footer: {
                  type: "box",
                  layout: "horizontal",
                  content: [
                    {
                      type: "button",
                      action: {
                        type: "uri",
                        label: "ดูรายละเอียดผู้รีวิว",
                        uri:
                          "https://www.google.com/maps/contrib/110408252214450046707/reviews/@14.108896,99.6294087,9.94z"
                      },
                      color: "#04A4B6",
                      style: "primary"
                    }
                  ]
                }
              }
            };
            var time = {
              type: "bubble",
              body: {
                type: "box",
                layout: "vertical",
                spacing: "sm",
                content: [
                  {
                    type: "box",
                    layout: "vertical",
                    spacing: "xl",
                    content: [
                      {
                        type: "text",
                        text: "วันเวลาที่เปิดทำการ",
                        margin: "sm",
                        size: "lg",
                        align: "center",
                        weight: "bold"
                      },
                      {
                        type: "separator"
                      },
                      {
                        type: "text",
                        text: "วันอาทิตย์ 8:00–18:00",
                        align: "center"
                      },
                      {
                        type: "separator"
                      },
                      {
                        type: "text",
                        text: "วันจันทร์ 8:00–18:00",
                        align: "center"
                      },
                      {
                        type: "separator"
                      },
                      {
                        type: "text",
                        text: "วันอังคาร 8:00–18:00",
                        align: "center"
                      },
                      {
                        type: "separator"
                      },
                      {
                        type: "text",
                        text: "วันพุธ 8:00–18:00",
                        align: "center"
                      },
                      {
                        type: "separator"
                      },
                      {
                        type: "text",
                        text: "วันพฤหัสบดี 8:00–18:00",
                        align: "center"
                      },
                      {
                        type: "separator"
                      },
                      {
                        type: "text",
                        text: "วันศุกร์ 8:00–18:00",
                        align: "center"
                      },
                      {
                        type: "separator"
                      },
                      {
                        type: "text",
                        text: "วันเสาร์ 8:00–18:00",
                        align: "center"
                      },
                      {
                        type: "separator"
                      }
                    ]
                  },
                  {
                    type: "box",
                    layout: "baseline",
                    spacing: "xl",
                    content: [
                      {
                        type: "text",
                        text: "สถานะการให้บริการ:",
                        flex: 3,
                        margin: "sm",
                        size: "lg",
                        align: "start",
                        weight: "bold"
                      },
                      {
                        type: "text",
                        text: "เปิดอยู่",
                        flex: 1,
                        margin: "sm",
                        size: "lg",
                        align: "start",
                        weight: "bold",
                        color: "#0CF929"
                      }
                    ]
                  }
                ]
              }
            };
            resolve([
              replyToken,
              [
                {
                  type: "flex",
                  altText: "Flex Message",
                  contents: {
                    type: "carousel",
                    contents: [
                      flexDetail_result.data,
                      time,
                      {
                        type: "bubble",
                        header: {
                          type: "box",
                          layout: "horizontal",
                          contents: [
                            {
                              type: "text",
                              text: "REVIEW",
                              size: "sm",
                              weight: "bold",
                              color: "#AAAAAA"
                            }
                          ]
                        },
                        hero: {
                          type: "image",
                          url:
                            "https://lh4.ggpht.com/-bXx83tZHuW8/AAAAAAAAAAI/AAAAAAAAAAA/R9umGJGU518/s128-c0x00000000-cc-rp-mo-ba4/photo.jpg",
                          size: "xl",
                          aspectRatio: "20:13",
                          action: {
                            type: "uri",
                            label: "Action",
                            uri: "https://linecorp.com/"
                          }
                        },
                        body: {
                          type: "box",
                          layout: "vertical",
                          spacing: "md",
                          contents: [
                            {
                              type: "box",
                              layout: "vertical",
                              contents: [
                                {
                                  type: "text",
                                  text: "ลุงยุทธ บานไม่รู้โรย",
                                  flex: 8,
                                  size: "lg",
                                  align: "center",
                                  gravity: "bottom",
                                  weight: "bold",
                                  wrap: true
                                },
                                {
                                  type: "separator"
                                }
                              ]
                            },
                            {
                              type: "box",
                              layout: "vertical",
                              contents: [
                                {
                                  type: "text",
                                  text: "ความคิดเห็น:",
                                  flex: 8,
                                  size: "md",
                                  align: "start",
                                  gravity: "center",
                                  weight: "bold",
                                  wrap: true
                                },
                                {
                                  type: "text",
                                  text:
                                    "รสอาหารใช่ได้แต่พนักควรเปลี่ยนยกทีมไปซืัอกินนะไม่ได้ขอกินฟรีพูดจาไม่ดีสมควรเปลี่ยนยกทีมเลย",
                                  flex: 1,
                                  size: "md",
                                  align: "start",
                                  wrap: true
                                }
                              ]
                            },
                            {
                              type: "box",
                              layout: "baseline",
                              contents: [
                                {
                                  type: "text",
                                  text: "การให้คะแนน:",
                                  flex: 0,
                                  margin: "sm",
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
                                  text: " 2.5"
                                }
                              ]
                            },
                            {
                              type: "box",
                              layout: "baseline",
                              contents: [
                                {
                                  type: "text",
                                  text: "แสดงความคิดเห็นเมื่อ",
                                  flex: 6,
                                  margin: "sm",
                                  size: "sm",
                                  align: "start",
                                  weight: "bold"
                                },
                                {
                                  type: "text",
                                  text: "2 ปีที่แล้ว",
                                  flex: 4,
                                  margin: "sm",
                                  size: "sm",
                                  align: "start",
                                  weight: "bold",
                                  color: "#EA7F7F"
                                }
                              ]
                            }
                          ]
                        },
                        footer: {
                          type: "box",
                          layout: "horizontal",
                          contents: [
                            {
                              type: "button",
                              action: {
                                type: "uri",
                                label: "ดูรายละเอียดผู้รีวิว",
                                uri:
                                  "https://www.google.com/maps/contrib/110408252214450046707/reviews/@14.108896,99.6294087,9.94z"
                              },
                              color: "#04A4B6",
                              style: "primary"
                            }
                          ]
                        }
                      },
                      {
                        type: "bubble",
                        header: {
                          type: "box",
                          layout: "horizontal",
                          contents: [
                            {
                              type: "text",
                              text: "REVIEW",
                              size: "sm",
                              weight: "bold",
                              color: "#AAAAAA"
                            }
                          ]
                        },
                        hero: {
                          type: "image",
                          url:
                            "https://lh6.ggpht.com/-G4Ww6palWT8/AAAAAAAAAAI/AAAAAAAAAAA/GL4_WgqxtYI/s128-c0x00000000-cc-rp-mo-ba3/photo.jpg",
                          size: "xl",
                          aspectRatio: "20:13",
                          action: {
                            type: "uri",
                            label: "Action",
                            uri: "https://linecorp.com/"
                          }
                        },
                        body: {
                          type: "box",
                          layout: "vertical",
                          spacing: "md",
                          contents: [
                            {
                              type: "box",
                              layout: "vertical",
                              contents: [
                                {
                                  type: "text",
                                  text: "jintanan kangwankiatichai",
                                  flex: 8,
                                  size: "lg",
                                  align: "center",
                                  gravity: "bottom",
                                  weight: "bold",
                                  wrap: true
                                },
                                {
                                  type: "separator"
                                }
                              ]
                            },
                            {
                              type: "box",
                              layout: "vertical",
                              contents: [
                                {
                                  type: "text",
                                  text: "ความคิดเห็น:",
                                  flex: 8,
                                  size: "md",
                                  align: "start",
                                  gravity: "center",
                                  weight: "bold",
                                  wrap: true
                                },
                                {
                                  type: "text",
                                  text:
                                    "อาหารเหนือและอาหารตามสั่ง อาหารเหนือจะมีทำไว้อยู่แล้ว เลือกจากในหม้อเอา น้ำพริกอ่องอร่อยดี",
                                  flex: 1,
                                  size: "md",
                                  align: "start",
                                  wrap: true
                                }
                              ]
                            },
                            {
                              type: "box",
                              layout: "baseline",
                              contents: [
                                {
                                  type: "text",
                                  text: "การให้คะแนน:",
                                  flex: 0,
                                  margin: "sm",
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
                                  text: " 4.4"
                                }
                              ]
                            },
                            {
                              type: "box",
                              layout: "baseline",
                              contents: [
                                {
                                  type: "text",
                                  text: "แสดงความคิดเห็นเมื่อ",
                                  flex: 6,
                                  margin: "sm",
                                  size: "sm",
                                  align: "start",
                                  weight: "bold"
                                },
                                {
                                  type: "text",
                                  text: "2 เดือนที่แล้ว",
                                  flex: 4,
                                  margin: "sm",
                                  size: "sm",
                                  align: "start",
                                  weight: "bold",
                                  color: "#EA7F7F"
                                }
                              ]
                            }
                          ]
                        },
                        footer: {
                          type: "box",
                          layout: "horizontal",
                          contents: [
                            {
                              type: "button",
                              action: {
                                type: "uri",
                                label: "ดูรายละเอียดผู้รีวิว",
                                uri:
                                  "https://www.google.com/maps/contrib/112186095773426382645/reviews"
                              },
                              color: "#04A4B6",
                              style: "primary"
                            }
                          ]
                        }
                      },
                      {
                        type: "bubble",
                        header: {
                          type: "box",
                          layout: "horizontal",
                          contents: [
                            {
                              type: "text",
                              text: "REVIEW",
                              size: "sm",
                              weight: "bold",
                              color: "#AAAAAA"
                            }
                          ]
                        },
                        hero: {
                          type: "image",
                          url:
                            "https://lh6.ggpht.com/-8fvHpUpV66E/AAAAAAAAAAI/AAAAAAAAAAA/hYGvE-lZQl4/s128-c0x00000000-cc-rp-mo-ba4/photo.jpg",
                          size: "xl",
                          aspectRatio: "20:13",
                          action: {
                            type: "uri",
                            label: "Action",
                            uri: "https://linecorp.com/"
                          }
                        },
                        body: {
                          type: "box",
                          layout: "vertical",
                          spacing: "md",
                          contents: [
                            {
                              type: "box",
                              layout: "vertical",
                              contents: [
                                {
                                  type: "text",
                                  text: "overdose13",
                                  flex: 8,
                                  size: "lg",
                                  align: "center",
                                  gravity: "bottom",
                                  weight: "bold",
                                  wrap: true
                                },
                                {
                                  type: "separator"
                                }
                              ]
                            },
                            {
                              type: "box",
                              layout: "vertical",
                              contents: [
                                {
                                  type: "text",
                                  text: "ความคิดเห็น:",
                                  flex: 8,
                                  size: "md",
                                  align: "start",
                                  gravity: "center",
                                  weight: "bold",
                                  wrap: true
                                },
                                {
                                  type: "text",
                                  text: "อาหารอร่อย แนะนำครับ",
                                  flex: 1,
                                  size: "md",
                                  align: "start",
                                  wrap: true
                                }
                              ]
                            },
                            {
                              type: "box",
                              layout: "baseline",
                              contents: [
                                {
                                  type: "text",
                                  text: "การให้คะแนน:",
                                  flex: 0,
                                  margin: "sm",
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
                                  text: " 4.4"
                                }
                              ]
                            },
                            {
                              type: "box",
                              layout: "baseline",
                              contents: [
                                {
                                  type: "text",
                                  text: "แสดงความคิดเห็นเมื่อ",
                                  flex: 6,
                                  margin: "sm",
                                  size: "sm",
                                  align: "start",
                                  weight: "bold"
                                },
                                {
                                  type: "text",
                                  text: "ปีที่แล้ว",
                                  flex: 4,
                                  margin: "sm",
                                  size: "sm",
                                  align: "start",
                                  weight: "bold",
                                  color: "#EA7F7F"
                                }
                              ]
                            }
                          ]
                        },
                        footer: {
                          type: "box",
                          layout: "horizontal",
                          contents: [
                            {
                              type: "button",
                              action: {
                                type: "uri",
                                label: "ดูรายละเอียดผู้รีวิว",
                                uri:
                                  "https://www.google.com/maps/contrib/112186095773426382645/reviews"
                              },
                              color: "#04A4B6",
                              style: "primary"
                            }
                          ]
                        }
                      }
                    ]
                  }
                },
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
                  const dataApi = await googleApi.textSearch("ชลบุรี+โรงแรม");
                  const objectPlace = await getSeletedPlace(
                    dataApi.data,
                    templace
                  );
                  resolve([replyToken, objectPlace.data]);
                } catch (error) {
                  console.log(error);
                  resolve([
                    replyToken,
                    { type: "text", text: "กรุณาลองใหม่อีกครั้ง" }
                  ]);
                }
              } else if (message.text === "น่าน") {
                try {
                  const dataApi = await googleApi.textSearch("น่าน+ร้านอาหาร");
                  const objectPlace = await getSeletedPlace(
                    dataApi.data,
                    templace
                  );
                  resolve([replyToken, objectPlace.data]);
                } catch (error) {
                  console.log(error);
                  resolve([
                    replyToken,
                    { type: "text", text: "กรุณาลองใหม่อีกครั้ง" }
                  ]);
                }
              } else if (message.text === "เชียงใหม่") {
                try {
                  const dataApi = await googleApi.textSearch(
                    "เชียงใหม่+แหล่งท่องเที่ยว"
                  );
                  const objectPlace = await getSeletedPlace(
                    dataApi.data,
                    templace
                  );
                  resolve([replyToken, objectPlace.data]);
                } catch (error) {
                  console.log(error);
                  resolve([
                    replyToken,
                    { type: "text", text: "กรุณาลองใหม่อีกครั้ง" }
                  ]);
                }
                เชียงใหม่แหล่งท่องเที่ยว;
              } else if (message.text === "ธนา") {
                resolve([
                  replyToken,
                  {
                    type: "flex",
                    altText: "Flex Message",
                    content: {
                      type: "bubble",
                      direction: "ltr",
                      header: {
                        type: "box",
                        layout: "vertical",
                        content: [
                          { type: "text", text: "เส้นทาง", align: "center" }
                        ]
                      },
                      body: {
                        type: "box",
                        layout: "vertical",
                        content: [
                          {
                            type: "text",
                            text:
                              "เดินไปที่ ป้ายรถประจำทาง โรงเรียนพระรามหกเทคโนโลยี",
                            wrap: true
                          },
                          { type: "separator", margin: "xs", color: "#3F3F3F" },
                          {
                            type: "text",
                            text: "ปลายทาง: ป้ายรถประจำทาง โรงเรียนเทศบาล 2"
                          },
                          {
                            type: "text",
                            text: "รถเมล์สาย: 175ร (ตลาดพลู - ตลาดนนท์)"
                          },
                          { type: "separator", margin: "xs", color: "#3F3F3F" },
                          {
                            type: "text",
                            text: "ปลายทาง: ป้ายรถประจำทาง ธนาคารทหารไทย สนญ 2"
                          },
                          {
                            type: "text",
                            text: "รถเมล์สาย: 90ร (บางพูน - ย่านสินค้าพหลโยธิน)"
                          },
                          { type: "separator", margin: "xs", color: "#3F3F3F" },
                          {
                            type: "text",
                            text: "ปลายทาง: ป้ายรถประจำทาง แยกถนนนิมิตรใหม่"
                          },
                          {
                            type: "text",
                            text: "รถเมล์สาย: 8ปอ (สะพานพุทธ - แฮปปี้แลนด์)"
                          },
                          { type: "separator", margin: "xs", color: "#3F3F3F" },
                          {
                            type: "text",
                            text:
                              "เดินไปที่ ป้ายรถประจำทาง โรงเรียนพระรามหกเทคโนโลยี",
                            wrap: true
                          },
                          { type: "separator", margin: "xs", color: "#3F3F3F" }
                        ]
                      },
                      footer: {
                        type: "box",
                        layout: "horizontal",
                        content: [
                          {
                            type: "button",
                            action: {
                              type: "postback",
                              label: "รายงานความผิดผลาด",
                              text: "รายงานความผิดผลาด",
                              data: "REPORT"
                            }
                          }
                        ]
                      }
                    }
                  }
                ]);
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
function getSeletedPlace(arr) {
  return new Promise((res, rej) => {
    var ret = {};
    if (!arr) {
      ret.status = false;
      ret.message = "error";
      rej(ret);
    }
    var temp = {
      type: "flex",
      altText: "Flex Message",
      content: {
        type: "carousel",
        content: []
      }
    };
    var results = arr;
    if (results.length > 10) {
      for (let i = 0; i < 10; i++) {
        const flex = {
          type: "bubble",
          body: {
            type: "box",
            layout: "vertical",
            spacing: "sm",
            content: [
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
                content: [
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
                content: [
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
                content: [
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
            content: [
              {
                type: "button",
                action: {
                  type: "postback",
                  label: "ดูรายละเอียด",
                  text: "ดูรายละเอียด",
                  data: '{"DATA":"BACD"}'
                },
                color: "#459950",
                style: "primary"
              }
            ]
          }
        };
        flex.body.content[0].text = results[i].name;
        flex.body.content[2].content[1].text = results[i].address;
        flex.body.content[4].content[1].text = results[i].status;
        results[i].status === "เปิดอยู่"
          ? (flex.body.content[4].content[1].color = "#459950")
          : (flex.body.content[4].content[1].color = "#cccccc");
        flex.body.content[5].content[2].text = results[i].rateing.toString();
        flex.footer.content[0].action.data = `placeId_hotel^${results[i].place_id}^${results[i].photo}`;
        temp.content.content.push(flex);
      }
    } else {
      results.forEach(result => {
        const flex = {
          type: "bubble",
          body: {
            type: "box",
            layout: "vertical",
            spacing: "sm",
            content: [
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
                content: [
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
                content: [
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
                content: [
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
            content: [
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
        flex.body.content[0].text = result.name;
        flex.body.content[2].content[1].text = result.address;
        flex.body.content[4].content[1].text = result.status;
        result.status === "เปิดอยู่"
          ? (flex.body.content[4].content[1].color = "#459950")
          : (flex.body.content[4].content[1].color = "#cccccc");
        flex.body.content[5].content[2].text = results.rateing.toString();
        flex.footer.content[0].action.data = `placeId_hotel,${results.place_id},${result.photo}`;
        temp.content.content.push(flex);
      });
    }
    ret.status = true;
    ret.data = temp;

    res(ret);
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
