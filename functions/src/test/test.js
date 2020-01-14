/* eslint-disable promise/always-return */
/* eslint-disable promise/always- */
/*********************************** import Database - Firestore ***********************************/
const db = require("../services/firestore");
var templace = require("../config/config-flexbox")["flexbox_prototypePlace"];
const googleapi = require("../services/google-api");
/*********************************** import undercore js ***********************************/
const _ = require("underscore");

module.exports = (req, res) => {
  // eslint-disable-next-line promise/catch-or-return
  res.send("abcd");
};
