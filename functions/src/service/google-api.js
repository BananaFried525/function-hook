const restPromise = require("request-promise");
const configGoogle = require("../config/config.json")["google"];
const _ = require("underscore");
module.exports.findLocation = function() {
  // https://maps.googleapis.com/maps/api/directions/json?departure_time=now&mode=transit&origin=มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าพระนครเหนือ แขวง วงศ์สว่าง เขตบางซื่อ กรุงเทพมหานคร 10800&destination=อนุสาวรีย์ชัยสมรภูมิ ถนน พหลโยธิน แขวง ถนนพญาไท เขตราชเทวี กรุงเทพมหานคร 10400&key=AIzaSyAAm6Jci_ckEgvGkb98Q15R1h8RtIsjt_8
};
/* eslint-disable promise/always-return */
module.exports.nearBySearch = function(user_locate, type) {
  return new Promise((resolve, reject) => {
    var rt = {};
    var option = {
      uri: "https://maps.googleapis.com/maps/api/place/nearbysearch/json",
      qs: {
        key: configGoogle.key_place,
        radius: 50,
        location: user_locate,
        language: "th",
        opennow: true,
        type: type
      }
    };
    restPromise(option)
      .then(res => {
        // console.info(res);
        rt.status = true;
        rt.data = res;
        resolve(rt);
      })
      .catch(err => {
        // console.error(err);
        rt.status = false;
        rt.massage = err;
        reject(rt);
      });
  });
};
module.exports.textSearch = keyword => {
  /* eslint-disable promise/always-return */
  return new Promise((res, rej) => {
    var ret = {};
    var option = {
      uri: "https://maps.googleapis.com/maps/api/place/textsearch/json",
      qs: {
        key: configGoogle.key_place,
        query: keyword,
        language: "th",
        rankby: "prominence"
      }
    };
    restPromise(option)
      .then(result => {
        console.info(result);
        ret.status = true;
        ret.data = JSON.parse(result);
        res(ret);
      })
      .catch(error => {
        console.log(error);
        ret.status = false;
        ret.massage = error.massage;
        rej(ret);
      });
  });
};
module.exports.PlaceDetail = place_id => {
  return new Promise((req, res) => {
    var ret = {};
    const option = {
      uri: "https://maps.googleapis.com/maps/api/place/details/json",
      qs: {
        place_id: place_id,
        fields:
          "formatted_phone_number,international_phone_number,opening_hours,website",
        language: "th",
        key: configGoogle.key_place
      }
    };
    restPromise(option)
      .then(result => {
        console.info(result);
        ret.status = true;
        ret.data = JSON.parse(result);
        res(ret);
      })
      .catch(error => {
        console.log(error);
        ret.status = false;
        ret.massage = error.massage;
        rej(ret);
      });
  });
};
module.exports.placePhotoreFerence = photo_code => {
  return new Promise((res, rej) => {
    var ret = {};
    // eslint-disable-next-line promise/catch-or-return
    fetch(
      `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo_code}
      &key=${configGoogle.key_place}`
    )
      .then(result => {
        const data = _.clone(result);
        ret.status = true;
        ret.data = data.url;
        res(ret);
      })
      .catch(error => {
        console.log(error);
        ret.status = false;
        ret.massage = error.massage;
        rej(ret);
      });
  });
};
