const restPromise = require('request-promise');
const configGoogle = require('../config/config.json')['google'];


exports.findDirection = function () {
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