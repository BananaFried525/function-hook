/* eslint-disable promise/always-return */
/* eslint-disable promise/always- */
/*********************************** import Database - Firestore ***********************************/
const db = require("../services/firestore");
var templace = require("../config/config-flexbox")["flexbox_prototypePlace"];
const googleapi = require("../services/google-api");
/*********************************** import undercore js ***********************************/
const _ = require("underscore");

// module.exports = (req, res) => {

//   // eslint-disable-next-line promise/catch-or-return
//   res.send("abcd");
// };

/**
 * ! เอาไว้ทดสอบ Android 
 */
let express = require('express');
let router = express.Router();

router.get('/v1',(req,res)=>{
  res.send('v1');
});

/**
 * @package Other path
 */
router.get('**',(req,res)=>{
  res.send('Not found');
});

module.exports = router;
