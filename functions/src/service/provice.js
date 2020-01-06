/*********************************** import Database - Firestore ***********************************/
const db = require("../service/firestore");
/*********************************** import schema validator ***********************************/
const lov = require("../schema/lov.schema")["lovSchema"];
/*********************************** API getproviceOptions  ***********************************/
module.exports.getproviceOptions = (req, res) => {
  const fieldid = "lov";
  const operator = req.body.operator;
  const value = req.body.value;

  try {
    // eslint-disable-next-line promise/catch-or-return
    db.collection("lov")
      .get(fieldid, operator, value)
      .then(snapshot => {
        const arr = [];
        snapshot.forEach(element => {
          arr.push(element);
        });
        console.log(arr);
        /* eslint-disable promise/always-return */
        if (_.isArray(arr) && arr.length > 0) {
          res.status(200).json({
            status: true,
            result: arr
          });
        } else {
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
/*********************************** API Deleteprovice  ***********************************/
module.exports.deleteprovice = (req, res) => {
  /* eslint-disable promise/always-return */
  const docId = req.body.docId;
  try {
    db.collection("lov")
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
/*********************************** API get  ***********************************/
module.exports.getallprovice = (req, res) => {
  /* eslint-disable promise/always-return */
  try {
    db.collection("lov")
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
/*********************************** API createProvice  ***********************************/
module.exports.createprovice = (req, res) => {
  /* eslint-disable promise/always-return */
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
