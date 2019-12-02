/* eslint-disable promise/always- */

const db = require("../service/firestore");
const lov = require("../schema/lov.schema")["lovSchema"];
module.exports = (req, res) => {
  Object_req_body = {
    LovType: "LovType",
    LovName: "",
    Createby: "",
    Updateby: "",
    CreatedAt: new Date(),
    UpdatedAt: new Date()
  };

  // createprovice(res, Object_req_body);   test 03/12/2562 00:20
  // getallprovice(res);                    test 02/12/2562 22:40
};
/////////////////////////---getallprovice---/////////////////////////////
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
        if (arraytemp.length > 1) {
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
