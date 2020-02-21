/* eslint-disable promise/always-return */
const express = require("express");
const app = express();
const db = require("../config/firestore");
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
      console.log(JSON.stringify(req.body));
      // eslint-disable-next-line promise/catch-or-return
      let namedb = db.collection("user_web");
      let userwhere = namedb
        .where("username", "==", uname)
        .where("password", "==", encodepwd)
        .get()
        .then(snapshot => {
          if (snapshot.size === 0) {
            ret.status = false;
            ret.message = "ไม่มีผู้ใช้งานในระบบ";
            console.log(ret);
            res.json(ret);
          }

          snapshot.forEach(doc => {
            console.log(doc.id, "=>", doc.data());

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
app.get("/getsession", adminmiddleware, (req, res) => {
  var ret = {};
  let id = req.user;
  console.log(req.session);
  try {
    var mydb = db
      .collection("user_web")
      .doc(id)
      .get()
      .then(doc => {
        if (!doc.exists) {
          ret.status = false;
          ret.message = "data not found";
          res.status(404).json(ret);
        } else {
          ret.status = true;
          ret.data = {
            fname: doc.data().fName,
            lname: doc.data().lName,
            priority: doc.data().priority
          };
          console.log("Session_data", JSON.stringify(ret.data));
          res.send(ret);
        }
      })
      .catch(err => {
        ret.status = false;
        ret.message = err;
        res.status(500).json(ret);
      });
  } catch (err) {
    ret.status = false;
    ret.message = err;
    res.status(500).json(ret);
  }
});
app.get("/logout", (req, res) => {
  req.logout();
  res.json({
    status: true
  });
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
    var database = db
      .collection("user_web")
      .where("priority", "==", "assistant")
      .get()
      .then(result => {
        var arr = [];
        result.forEach(doc => {
          arr.push({
            id: doc.id,
            createAt: doc.data().createAt,
            createBy: doc.data().createBy,
            email: doc.data().email,
            priority: doc.data().priority,
            updateAt: doc.data().updateAt,
            updateBy: doc.data().updateBy,
            fName: doc.data().fName,
            lName: doc.data().lName
          });
        });
        arr.sort((a, b) => {
          return new Date(b.createAt) - new Date(a.createAt);
        });

        ret.status = true;
        ret.data = arr;
        res.send(ret);
      });
  } catch (err) {
    ret.status = false;
    ret.message = err;
    res.send(ret);
  }
});
app.post("/delete", adminmiddleware, async (req, res) => {
  var ret = {};
  var _id = _.clone(req.body.id);
  if (!req.body.id) {
    ret.status = false;
    ret.message = "Error not understands the content type";
    res.status(422).json(ret);
  } else {
    try {
      var mydb = await db
        .collection("user_web")
        .doc(_id)
        .delete();

      ret.status = true;
      ret.data = "OK";
      res.send(ret);
    } catch (err) {
      ret.status = false;
      ret.message = err;
      res.send(ret);
    }
  }
});
app.post("/addassist", adminmiddleware, async (req, res) => {
  var ret = {};
  if (
    !req.body.createAt &&
    !req.body.createBy &&
    !req.body.email &&
    !req.body.password &&
    !req.body.updateAt &&
    !req.body.updateBy &&
    !req.body.username &&
    !req.body.priority &&
    !req.body.fName &&
    !req.body.lName
  ) {
    ret.status = false;
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
        username: body.username,
        lName: body.lName,
        fName: body.fName
      };
      var database = await db
        .collection("user_web")
        .doc()
        .set(schemas);
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
});
app.get("/report", adminmiddleware, async (req, res) => {
  let ret = {};
    db.collection("issue").get().then((snapshot) => {
      let arr=[];
      snapshot.forEach(async(doc) => {
        console.log(doc.id, '=>', doc.data());
        arr.push(doc.data());
      });
      res.status(200).json(arr);
    })
    .catch((err) => {
      console.log('Error getting documents', err);
      ret.message = err.message;
      ret.status = false;
      res.status(500).json(ret);
    });
});
app.post("/report", /**adminmiddleware,*/ async (req, res) => {
  let newIssue = req.body;
  let ret = {};
  let docRef = db.collection('issue').doc();
  let setIssue = docRef.set(newIssue);
  console.log(JSON.stringify(setIssue));
  res.send(setIssue);
});
module.exports = app;
