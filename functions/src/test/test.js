/* eslint-disable promise/always-return */
const db = require('../service/firestore');

module.exports = (req, res) => {
  db.collection("Lov")
    .get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        console.log(doc.id, "=>", doc.data());
      });
    })
    .catch(err => {
      console.log("Error getting documents", err);
    });

  res.send("pass");
};
