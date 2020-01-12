const restPromise = require("request-promise");
const key_place = require("../config/config.json")["google"]["key_place"];
const _ = require("underscore");
// location { lat , long }
module.exports.findhotelAround = location => {
  var option = {};
  restPromise(option)
    .then(res => {
      return;
    })
    .catch(err => {
      console.error(err);
      return;
    });
};
// namprovice = 'เชียงใหม่';
module.exports.findhotelbyProvice = nameprovice => {
  var option = {};
  restPromise(option)
    .then(res => {
      return;
    })
    .catch(err => {
      console.error(err);
      return;
    });
};
//  place id = ChIJN1t_tDeuEmsRUsoyG83frY4
//  website , opening_hours  , international_phone_number
module.exports.getDetailHotel = place_id => {
  var option = {};
  restPromise(option)
    .then(res => {
      return;
    })
    .catch(err => {
      console.error(err);
      return;
    });
};
