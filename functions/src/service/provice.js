/*********************************** import Database - Firestore ***********************************/
const db = require("../service/firestore");
/*********************************** import schema validator ***********************************/
const lov = require("../schema/lov.schema")["lovSchema"];

module.exports.getproviceOptions = (req, res) => {
  const fledid = req.body.fledId;
  const operator = req.body.operator;
  const value = req.body.value;
  try {
    db.collection("Test01")
      .get(fledid, operator, value)
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

module.exports.deleteprovice = (req, res) => {
  const docId = req.body.docId;
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

module.exports.getallprovice = (req, res) => {
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
module.exports.createprovice = (req, res) => {
  dataObject = req.body;
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
