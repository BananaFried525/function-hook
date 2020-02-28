/* eslint-disable promise/always-return */
const db = require("../config/firestore");
/**
 * @param issue_message: String
 */
module.exports.sendIssue = (issue_message) => {
  return new Promise((resolve, reject) => {
    let newIssue = {
      issue_message: issue_message,
      issue_status: "incoming",
      createBy: "line_user",
      createAt: new Date()
    };
    console.log(JSON.stringify(newIssue))
    let Issue = db.collection("issue").doc();
    Issue.set(newIssue)
      .then(res => {
        console.log(res);
        resolve("Report bug complete");
      })
      .catch(err => {
        reject(err);
      });
  });
};
