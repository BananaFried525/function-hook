/* eslint-disable promise/always- */
/*********************************** import Database - Firestore ***********************************/
const db = require("../services/firestore");
/*********************************** import schema validator ***********************************/
const lov = require("../schema/lov.schema")["lovSchema"];

const googleapi = require("../service/google-api");
/*********************************** import undercore js ***********************************/
const _ = require("underscore");

module.exports = (req, res) => {
  res.status(200).send("?");
};
