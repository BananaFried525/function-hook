const express = require("express");
const app = express();
const db = require("../services/firestore");
var jwt = require("jwt-simple");
const crypto = require("crypto");
const SECRET = require("../config/config.json")["SECRET"];
var adminmiddleware = require("../webserver/midleware/authen_admin");
var _ = require("underscore");
app.post("/login", (req, res) => {
  var ret = {};
  if (!req.body.username && !req.body.password) {
    ret.status = "true";
    ret.message = "understands the content type";
    res.status(422).json(ret);
  } else {
    try {
      const body = _.clone(req.body);
      var uname = body.username;
      var pwd = body.password.toString();
      var encodepwd = crypto
        .createHash("sha256")
        .update(pwd)
        .digest("hex");
      var payload = {
        username: body.username
      };
      var query = db
        .collection("user_web")
        .where("username", "==", uname)
        .where("password", "==", encodepwd)
        .get()
        // eslint-disable-next-line promise/always-return
        .then(snapshot => {
          snapshot.forEach(ele => {
            if (ele.data()) {
              ret.status = true;
              ret.data = {
                token: jwt.encode(payload, SECRET),
                priority: ele.data().priority
              };
              console.log(payload, "this is payload");
              res.send(ret);
            } else {
              ret.status = false;
              ret.message = "ไม่มีผู้ใช้งานในระบบ";
              return res.status(401).json(ret);
            }
          });
        });
    } catch (error) {
      console.log(error);
      ret.status = false;
      ret.message = error;
      res.status(500).json(ret);
    }
  }
});
app.get("/alluserline", adminmiddleware, (req, res) => {
  var ret = {};
  // eslint-disable-next-line promise/catch-or-return
  db.collection("user")
    .get()
    // eslint-disable-next-line promise/always-return
    .then(snap => {
      var arr = [];
      snap.forEach(e => {
        arr.push(e.data());
      });
      ret.status = true;
      ret.data = arr.map(e => {
        return e.userId;
      });
      return res.send(ret);
    });
});

// app.get('/createadmin', (req, res) => {
//     var uname = 'jojo1234'
//     var password = '1212312121'
//     db.collection('user_web').doc().set({
//         username: uname,
//         password: crypto.createHash("sha256")
//             .update(password)
//             .digest("hex"),
//         priority: 'assistant',
//         createBy: 'admin',
//         updateBy: 'admin',
//         createAt: new Date(),
//         updateAt: new Date()
//     })
//     res.send("ok");
// })

module.exports = app;
