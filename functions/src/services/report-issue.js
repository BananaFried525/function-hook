/* eslint-disable promise/always-return */
const db = require("../config/firestore");
/**
 * @param issue_message: String
 */
module.exports.sendIssue = (issue_message) => {
  return new Promise((resolve, reject) => {
    let newIssue = {
      issue_message: issue_message,
      issue_status: "incomplete",
      createBy: "line_user",
      createAt: new Date()
    };

    let User = db.collection("issue").doc();
    User.set(newUser)
      .then(res => {
        resolve("Report bug complete");
      })
      .catch(err => {
        reject(err);
      });
  });
};
