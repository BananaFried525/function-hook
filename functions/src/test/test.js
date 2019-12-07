/* eslint-disable promise/always- */
/*********************************** import Database - Firestore ***********************************/
const db = require("../service/firestore");
/*********************************** import schema validator ***********************************/
const lov = require("../schema/lov.schema")["lovSchema"];
/*********************************** import undercore js ***********************************/
const _ = require("underscore");
module.exports = (req, res) => {
  res.send("hello");
  // Object_req_body = {
  //   LovType: "LovType",
  //   LovName: "",
  //   Createby: "",
  //   Updateby: "",
  //   CreatedAt: new Date(),
  //   UpdatedAt: new Date()
  // };
  // req_query = {
  //   LovName: "test02"
  // };
  //deleteprovicebydocId(res, "asdasdasqwe");
  // getprovice(res, "LovName", "==", "test02");
  // createprovice(res, Object_req_body);   test 03/12/2562 00:20
  // getallprovice(res); //test 02/12/2562 22:40
  // getproviceOptions(res, "LovName", "==", "test02"); //test 04/12/2562
};
/////////////////////////---getallprovice---/////////////////////////////

const getproviceOptions = (res, fleid, operator, value) => {
  try {
    db.collection("Test01")
      .get(fleid, operator, value)
      .then(snapshot => {
        const arr = [];
        snapshot.forEach(element => {
          arr.push(element);
        });
        console.log(arr);
        if (_.isArray(arr) && arr.length > 0) {
          res.status(200).json({
            status: true,
            result: arr
          });
        } else {
          //not data in collection  =>
          res.status(401).json({
            status: false,
            message: "data not found"
          });
        }
      });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message
    });
  }
};
const deleteprovicebydocId = (res, docId) => {
  try {
    db.collection("Test01")
      .doc(docId)
      .delete()
      .then(result => {
        console.log(result);
        res.status(200).json({
          status: true,
          message: "Delete sucessful"
        });
      })
      .catch(error => {
        res.status(400).json({
          status: false,
          message: error.message
        });
      });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message
    });
  }
};

const getallprovice = res => {
  try {
    db.collection("Lov")
      .get()
      .then(snapshot => {
        const arraytemp = [];
        snapshot.forEach(listprovice => {
          arraytemp.push({ data: listprovice.data(), id: listprovice.id });
        });
        console.log(arraytemp);
        if (arraytemp.length > 0) {
          res.status(200).send(arraytemp);
        } else {
          res.status(401).json({ status: 401, message: "data not found" });
        }
      })
      .catch(error => {
        res.status(400).json({ status: 200, message: error.message });
      });
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
};
///////////////////////---createprovice---///////////////////////
const createprovice = (res, dataObject) => {
  reflovSchema = new lov(dataObject);
  if (!reflovSchema.isErrors()) {
    try {
      db.collection("Test01")
        .doc()
        .set(dataObject)
        .then(() => {
          res.status(200).json({
            status: 200,
            message: "create success"
          });
        })
        .catch(error => {
          res.status(400).json({ status: false, message: error.message });
        });
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
    // if not required fleid;
  } else {
    // if required fleid;

    res.status(400).json({
      status: false,
      message: Object.assign(
        {},
        reflovSchema.getErrors().map(element => {
          return element.errorMessage;
        })
      )
    });
  }
};
