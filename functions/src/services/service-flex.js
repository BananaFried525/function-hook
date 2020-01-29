module.exports.flexdetail = function(detail, url_photo) {
  return new Promise(async (res, rej) => {
    var ret = {};
    var phone = "ไม่มีข้อมูล";
    var website = "ไม่มีข้อมูล";
    let action_phone = {
      type: "message",
      label: "โทร",
      text: "ขออภัยเราไม่มีข้อมูลดังกล่าว"
    };
    let action_website = {
      type: "message",
      label: "เว็บไซต์",
      text: "ขออภัยเราไม่มีข้อมูลดังกล่าว"
    };

    if (detail.formatted_phone_number) {
      phone = detail.formatted_phone_number;
      url_phone = `tel:${detail.formatted_phone_number.split(" ").join("")}`;
      action_phone = { type: "uri", label: "โทร", uri: url_phone };
    }

    if (detail.website) {
      website = detail.website;
      url_website = detail.website;
      action_website = {
        type: "uri",
        label: "เว็บไซต์",
        uri: url_website
      };
    }
    if (!detail && !url_photo) {
      ret.status = false;
      ret.message = "error";
      // eslint-disable-next-line prefer-promise-reject-errors
      rej(ret);
    } else {
      const temp = {
        type: "bubble",
        hero: {
          type: "image",
          url: `${url_photo}`,
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
              text: `${detail.name}`,
              size: "lg",
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
                  text: `${detail.formatted_address}`,
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
                  type: "text",
                  text: "เรตติ้ง",
                  flex: 3,
                  size: "xs",
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
                  text: `${detail.rating}`,
                  flex: 5,
                  margin: "sm",
                  size: "sm",
                  align: "start",
                  gravity: "center",
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
                  text: `${detail.user_ratings_total}`,
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
                  text: `${phone}`,
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
                  text: "เว็บไซต์:",
                  flex: 3,
                  size: "md",
                  gravity: "bottom",
                  weight: "bold"
                },
                {
                  type: "text",
                  text: `${website}`,
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
              action: action_phone,
              flex: 3,
              color: "#03B037",
              style: "primary"
            },
            {
              type: "button",
              action: action_website,
              flex: 3,
              color: "#028E7D",
              height: "md",
              style: "primary"
            }
          ]
        }
      };
      ret.status = true;
      ret.data = temp;
      res(ret);
    }
  });
};

module.exports.flextime = function(timedata) {
  return new Promise((res, rej) => {
    const ret = {};

    if (!timedata) {
      res(ret);
    } else {
      var weekday_array = timedata.weekday_text;
      var opening = timedata.open_now;
      var flextime = {
        type: "bubble",
        body: {
          type: "box",
          layout: "vertical",
          spacing: "sm",
          contents: [
            {
              type: "box",
              layout: "vertical",
              spacing: "xl",
              contents: [
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
              contents: [
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
      for (let i = 0, j = 2; i < weekday_array.length; i++, j = j + 2) {
        flextime.contents.body.contents[0].contents[j].text = weekday_array[i];
      }
      flextime.contents.body.contents[1].contents[1].text = opening;
      ret.status = true;
      ret.data = flextime;
      res(ret);
    }
  });
};
