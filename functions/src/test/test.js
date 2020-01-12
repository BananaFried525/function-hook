/* eslint-disable promise/always- */
/*********************************** import Database - Firestore ***********************************/
const db = require("../services/firestore");

const googleapi = require("../services/google-api");
/*********************************** import undercore js ***********************************/
const _ = require("underscore");

module.exports = (req, res) => {
  res.status(200).send("?");
};
