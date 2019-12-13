const restPromise = require('request-promise');
const configGoogle = require('../config/config.json')['google'];


exports.findDirection = function () {
  // https://maps.googleapis.com/maps/api/directions/json?departure_time=now&mode=transit&origin=มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าพระนครเหนือ แขวง วงศ์สว่าง เขตบางซื่อ กรุงเทพมหานคร 10800&destination=อนุสาวรีย์ชัยสมรภูมิ ถนน พหลโยธิน แขวง ถนนพญาไท เขตราชเทวี กรุงเทพมหานคร 10400&key=AIzaSyAAm6Jci_ckEgvGkb98Q15R1h8RtIsjt_8
  var option ={

  }
  restPromise(option)
    .then((res)=>{
      return 
    })
    .catch(err=>{
      console.error(err);
      return
    })
}