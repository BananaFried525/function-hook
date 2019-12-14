const restPromise = require('request-promise');
const configGoogle = require('../config/config.json')['google'];

module.exports.findLocation = function () {
  // https://maps.googleapis.com/maps/api/directions/json?departure_time=now&mode=transit&origin=มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าพระนครเหนือ แขวง วงศ์สว่าง เขตบางซื่อ กรุงเทพมหานคร 10800&destination=อนุสาวรีย์ชัยสมรภูมิ ถนน พหลโยธิน แขวง ถนนพญาไท เขตราชเทวี กรุงเทพมหานคร 10400&key=AIzaSyAAm6Jci_ckEgvGkb98Q15R1h8RtIsjt_8
}

module.exports.nearBySearch = function (user_locate) {

  return new Promise((resolve,reject)=>{
    var rt = {};
    var option = {
      uri: "https://maps.googleapis.com/maps/api/place/nearbysearch/json",
      qs: {
        key: configGoogle.key_place,
        radius: 50,
        location: user_locate,
        language: "th",
        opennow: true,
        keyword: "ตู้กดน้ำ",
      }
    };
  
    restPromise(option)
      .then((res) => {
        console.info(res);
        rt.status = true;
        rt.data = res;
        resolve(rt);
      })
      .catch(err => {
        console.error(err);
        rt.status = false;
        rt.massage = err;
        reject(rt);
      });
  
  })
  
}
