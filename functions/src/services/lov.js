/* eslint-disable promise/always-return */
/* eslint-disable prefer-promise-reject-errors */
const db = require("./firestore");

/**
 * @Param element ProviceName
 */
module.exports.getLov = function(element) {
  return new Promise((resolve, reject) => {
    db.collection("lov")
      .where("lovName", "==", element)
      .then(docs => {
        if (!docs.exists) {
          console.log("No such document!");
          resolve(false);
        } else {
          console.log("Document data:", docs.data());
          resolve(docs.data());
        }
      })
      .catch(err => {
        console.log("Error getting document", err);
        reject(err);
      });
  });
};
