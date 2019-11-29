flexbox = {
  flexbox_arr: {
    type: "flex",
    altText: "Flex Message",
    contents: {
      type: "carousel",
      contents: []
    }
  },
  flexbox_travel: {
    type: "flex",
    altText: "Flex Message",
    contents: {
      type: "bubble",
      hero: {
        type: "image",
        url:
          "https://developers.line.biz/assets/images/services/bot-designer-icon.png",
        size: "full",
        aspectRatio: "20:13",
        aspectMode: "cover"
      },
      body: {
        type: "box",
        layout: "vertical",
        spacing: "sm",
        contents: [
          {
            type: "text",
            text: "name Default",
            size: "xl",
            weight: "bold",
            wrap: true
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
                text: "ที่อยู่",
                flex: 8,
                size: "sm",
                align: "start",
                weight: "regular",
                wrap: true
              }
            ]
          },
          {
            type: "box",
            layout: "baseline",
            contents: [
              {
                type: "icon",
                url:
                  "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png",
                size: "sm"
              },
              {
                type: "icon",
                url:
                  "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png",
                size: "sm"
              },
              {
                type: "icon",
                url:
                  "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png",
                size: "sm"
              },
              {
                type: "icon",
                url:
                  "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png",
                size: "sm"
              },
              {
                type: "icon",
                url:
                  "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png",
                size: "sm"
              },
              {
                type: "text",
                text: "5.0 ",
                flex: 3,
                margin: "sm",
                size: "sm",
                align: "start",
                weight: "regular"
              }
            ]
          },
          {
            type: "box",
            layout: "baseline",
            contents: [
              {
                type: "text",
                text: "จำนวนการรีวิว:",
                flex: 3,
                margin: "sm",
                size: "sm",
                align: "start",
                weight: "bold"
              },
              {
                type: "text",
                text: "total_rating",
                flex: 4,
                margin: "sm",
                size: "sm",
                align: "start",
                weight: "regular"
              }
            ]
          },
          {
            type: "box",
            layout: "baseline",
            contents: [
              {
                type: "text",
                text: "เบอร์โทร:",
                flex: 3,
                margin: "sm",
                size: "sm",
                align: "start",
                weight: "bold"
              },
              {
                type: "text",
                text: "phone number",
                flex: 8,
                margin: "sm",
                size: "sm",
                align: "start",
                weight: "regular"
              }
            ]
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
                text: "status_open",
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
                text: "เว็บไซต์:",
                flex: 3,
                size: "md",
                gravity: "bottom",
                weight: "bold"
              },
              {
                type: "text",
                text: "https://www.google.com/",
                flex: 8,
                size: "sm",
                align: "start",
                weight: "regular",
                wrap: true
              }
            ]
          }
        ]
      },
      footer: {
        type: "box",
        layout: "horizontal",
        spacing: "sm",
        contents: [
          {
            type: "button",
            action: {
              type: "uri",
              label: "โทร",
              uri: "tel:+66871745761"
            },
            flex: 3,
            color: "#03B037",
            style: "primary"
          },
          {
            type: "button",
            action: {
              type: "uri",
              label: "เว็บไซต์",
              uri: "http://www.google.com"
            },
            flex: 3,
            color: "#028E7D",
            height: "md",
            style: "primary"
          }
        ]
      }
    }
  },
  flexbox_transit: {
    type: "bubble",
    hero: {
      type: "image",
      url:
        "https://scdn.line-apps.com/n/channel_devcenter/img/fx/01_5_carousel.png",
      size: "full",
      aspectRatio: "20:13",
      aspectMode: "cover"
    },
    body: {
      type: "box",
      layout: "vertical",
      spacing: "sm",
      contents: [
        {
          type: "text",
          text: "ชื่อป้าย:",
          size: "sm",
          weight: "bold",
          wrap: true
        },
        {
          type: "box",
          layout: "baseline",
          contents: [
            {
              type: "text",
              text: "ที่ตั้ง:",
              flex: 0,
              size: "sm",
              weight: "bold",
              wrap: true
            },
            {
              type: "text",
              text: "Default"
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
            type: "uri",
            label: "ดูรายละเอียด",
            uri: "https://linecorp.com"
          },
          color: "#ef754f",
          style: "primary"
        }
      ]
    }
  }
};
module.exports = flexbox;
