const line = require('@line/bot-sdk');
const configLine = require('../config/config.json')['line'];

const client = line.Client(configLine);
module.exports = (req,res) =>{

}