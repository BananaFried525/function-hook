/* eslint-disable promise/always-return */
/* eslint-disable promise/always- */
/*********************************** import Database - Firestore ***********************************/
const db = require("../services/firestore");

const googleapi = require("../services/google-api");
/*********************************** import undercore js ***********************************/
const _ = require("underscore");

module.exports = (req, res) => {
  // eslint-disable-next-line promise/catch-or-return
  res.send("hello");
};
