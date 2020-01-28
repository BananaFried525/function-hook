/* eslint-disable promise/always-return */
/* eslint-disable promise/always- */
/*********************************** import Database - Firestore ***********************************/
const db = require("../services/firestore");
var templace = require("../config/config-flexbox")["flexbox_prototypePlace"];
const express = require("express");
const Router = express.Router();
const googleapi = require("../services/google-api");
const fs = require("fs");
const _ = require("underscore");
const temp = require('../template/busdirection.json')
// functions/src/template/busdirection.json
/*********************************** import undercore js ***********************************/

Router.get(`/jay`, async (req, res) => {
  try {
    const dataApi = await googleapi.textSearch("ชลบุรี+โรงแรม");
    var objectPlace = await getSeletedPlace(dataApi.data);
    console.log(objectPlace[0].contents.contents);
    console.log(objectPlace[1].contents.contents);
    // eslint-disable-next-line no-empty
  } catch (error) {
    res.status(400).send("error");
  }
  // eslint-disable-next-line promise/catch-or-return
});
/**
 *
 * *Test only
 */
Router.get("/ohm", async (req, res) => {
  try {
    let bus_res = await googleapi.sortedBus({
      origin: `13.805207063673178,100.50962261751535`,
      destination: `เดอะมอลล์บางกะปิ`
    });
    let steps = bus_res.routes[0].legs[0].steps;
    let result = [];
    await steps.forEach((step, i) => {
      if (step.travel_mode === "WALKING") {
        console.log(step.html_instructions);
        let walking = {
          type: "text",
          text: `${step.html_instructions}`,
          wrap: true
        };
        result.push(walking);
      } else if (step.travel_mode === "TRANSIT") {
        console.log(`เป้าหมาย => `, step.transit_details.headsign);
        console.log(`หมายเลขรถ =>`, step.transit_details.line.short_name);
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
        result.push(bus1, bus2);
      }
      let separator = {
        type: "separator",
        margin: "xs",
        color: "#3F3F3F"
      };
      result.push(separator);
    });
    console.log(result)
    temp.contents.body.content = result;
    res.status(200).json(temp);
  } catch (error) {
    res.status(500).json(JSON.stringify(error));
  }
});

function getSeletedPlace(arr) {
  return new Promise((res, rej) => {
    var results = arr;
    var data = [];
    var content1 = {
      type: "flex",
      altText: "Flex Message",
      contents: {
        type: "carousel",
        contents: []
      }
    };
    var content2 = _.clone(content1);

    // eslint-disable-next-line prefer-promise-reject-errors

    results.forEach((results, index) => {
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
      flex.body.contents[0].text = results.name;
      flex.body.contents[2].contents[1].text = results.address;
      flex.body.contents[4].contents[1].text = results.status;
      results.status === "เปิดอยู่"
        ? (flex.body.contents[4].contents[1].color = "#459950")
        : (flex.body.contents[4].contents[1].color = "#cccccc");
      flex.body.contents[5].contents[2].text = results.rateing;
      flex.footer.contents[0].action.data = `placeId_hotel,${results.place_id},${results.photo}`;
      if (index < 10) {
        content1.contents.contents.push(flex);
      } else {
        content2.contents.contents.push(flex);
      }
    });
    if (results.length < 10) {
      data = [content1];
    } else {
      data = [content1, content2];
    }
    res(data);
  });
}
module.exports = Router;
