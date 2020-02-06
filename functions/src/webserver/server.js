/* eslint-disable promise/always-return */
const express = require("express");
const app = express();
const db = require("../services/firestore");
var jwt = require("jwt-simple");
const crypto = require("crypto");
const SECRET = require("../config/config.json")["SECRET"];
var adminmiddleware = require("../webserver/midleware/authen_admin");
var _ = require("underscore");
app.post("/login", (req, res) => {
  const ret = {};
  if (!req.body.username && !req.body.password) {
    ret.status = "true";
    ret.message = "Error not understands the content type";
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
      console.log(JSON.stringify(req.body))
      // eslint-disable-next-line promise/catch-or-return
      let namedb = db.collection('user_web');
      let userwhere = namedb.where("username", "==", uname).where("password", "==", encodepwd).get()
        .then(snapshot => {
          if (snapshot.size === 0) {
            ret.status = false;
            ret.message = "ไม่มีผู้ใช้งานในระบบ";
            console.log(ret);
            res.json(ret);
          }
          snapshot.forEach(doc => {
            console.log(doc.id, '=>', doc.data());
            if (doc.data()) {
              ret.status = true;
              ret.data = {
                token: jwt.encode(payload, SECRET),
                priority: doc.data().priority
              };
              res.status(200).json(ret);
            }
          });
        })
        .catch(err => {
          ret.status = false;
          ret.message = err;
          res.status(500).json(ret);
        });
    } catch (error) {
      console.log(error);
      ret.status = false;
      ret.message = error.code;
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
app.get("/getListassist", adminmiddleware, (req, res) => {

  try {
    var ret = {};
    var database = db.collection('user_web').get().then(result => {

      var arr = [];
      result.forEach(doc => {
        arr.push({
          id: doc.id,
          detail: doc.data()
        });

      })
      console.log(arr);
      res.send(arr);
      ret.status = true;
      ret.data = arr;

    })
  } catch (err) {
    ret.status = false;
    ret.message = err;
    res.send(ret);
  }



})
app.post('/Addassist', adminmiddleware, async (req, res) => {
  var ret = {}
  if (!req.body.createAt && !req.body.createBy && !req.body.email && !req.body.password &&
    !req.body.updateAt && !req.body.updateBy && !req.body.username &&
    !req.body.priority) {
    ret.status = "true";
    ret.message = "Error not understands the content type";
    res.status(422).json(ret);
  } else {
    try {
      var body = _.clone(req.body);

      var pwd = body.password.toString();
      var encodepwd = crypto
        .createHash("sha256")
        .update(pwd)
        .digest("hex");
      var schemas = {
        createAt: body.createAt,
        createBy: body.createBy,
        email: body.email,
        password: encodepwd,
        priority: body.priority,
        updateAt: body.updateAt,
        updateBy: body.updateBy,
        username: body.username
      }
      var database = await db.collection('user_web').doc().set(schemas);
      ret.status = true;
      ret.data = "OK";
      res.send(ret);
    } catch (err) {
      ret.message = err;
      ret.status = false;
      res.send(ret);
    }
  }
  // try{
  //   db.collection('user_web').doc().set({

  //   })
  // }catch(error){

  // }
})

module.exports = app;