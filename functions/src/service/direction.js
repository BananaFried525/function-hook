const http = require('http');
const configGoogle = require('../config/config.json')['google'];


const api = {
  direction: "https://google.com/",

}

exports.findDirection = function () {
  var data ="";
  const option = {
    hostname: "",
    port: "",
    method: ""
  }

  const req = http.request(option, res => {
    res.setEncoding('utf8');
    res.on('data', chunck => {

    })
    res.on('end', () => {

    })
  });
  req.on('error', e => {
    console.error(e);
    return
  })
  return data
}