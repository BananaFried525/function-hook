/* eslint-disable promise/always-return */

const db = require('../service/firestore');

module.exports = (req, res) => {
  db.collection("Lov")
    .get()
    .then((snapshot) => {
      res.send("ddd");
    })
    .catch(err => {
      console.log("test");
      res.send(err);
    });

};
