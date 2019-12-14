/* eslint-disable promise/always- */
/*********************************** import Database - Firestore ***********************************/
const db = require("../service/firestore");
/*********************************** import schema validator ***********************************/
const lov = require("../schema/lov.schema")["lovSchema"];
const rest = require("../service/restaurant");
/*********************************** import undercore js ***********************************/
const _ = require("underscore");
module.exports = (req, res) => {
  res.status(200).send("hello");
};
// Object_req_body = {
//   LovType: "LovType",
//   LovName: "",
//   Createby: "",
//   Updateby: "",
//   CreatedAt: new Date(),
//   UpdatedAt: new Date()a
// };
// req_query = {
//   LovName: "test02"
// };
//deleteprovicebydocId(res, "asdasdasqwe");
// getprovice(res, "LovName", "==", "test02");
// createprovice(res, Object_req_body);   test 03/12/2562 00:20
// getallprovice(res); //test 02/12/2562 22:40
// getproviceOptions(res, "LovName", "==", "test02"); //test 04/12/2562

/////////////////////////---getallprovice---/////////////////////////////
