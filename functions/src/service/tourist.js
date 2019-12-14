const restPromise = require("request-promise");
const key_place = require("../config/config.json")["google"]["key_place"];

module.exports.findtouristAround = (Latitude, Longitude) => {
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
module.exports.findtouristbyProvice = nameProvice => {
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
module.exports.getDetailTourist = place_id => {
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
