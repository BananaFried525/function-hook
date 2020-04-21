const userService = require("../services/user");
const transactionService = require("../services/transaction");
const busdirection = require("./busdirection");
const configRichmenu = require("./../config/config-lineservice.json");
const googleApi = require("./google-api");
const flexService = require("./service-flex");
const lovService = require("./lov");
const reportIssueService = require("./report-issue");
const tempDirectionBus = require("../template/busdirection.json");
const _ = require("underscore");

module.exports = (user, event) => {
  return new Promise(async (res, rej) => {
    var reply = {};
    try {
      if (isNoAction(user.action)) { // Focus**************************************
        var action = getAction(event);
        //create transaction for use next step
        user.transaction = transactionService.addTransaction(action);
        //use global function handle for find type of action
        user.action = action;
        // *************************************************************************
        userService.updateUser(user);
        res();
      } else { // Focus***********************************************************
        if (checkCurrentAction(user)) {
          return null;
        } else {
          //need to create global function for handle action when user leave the action more 6o+ min
          user.transaction = null;
          user.action = "non";
          actionComplate(user);
          res(".....กรุณาเลือกลงทะเบียน.....");
        }
      }
      res();
    } catch (error) {
      rej(error);
    }
  });
};

//for check current action when user already have transaction and leave that 60+ min
checkCurrentAction = (timeStamp) => {
  var currentTime = new Date();
  var userLastAction = new Date(timeStamp);
  var diffTime = (currentTime - userLastAction) / 6000;

  if (diffTime >= 60) {
    return false;
  } else {
    return true;
  }
};

isNoAction = (action) => {
  if (action !== "non") {
    return true;
  } else {
    return false;
  }
};

getAction = (event) => {
  return new Promise((res, rej) => {
    var type = event.type;
    var action = "";
    switch (type) {
      case "message":
        break;
      case postback:
        if (event.postback.data === configRichmenu.service1.name) {
          console.log("call service: " + configRichmenu.service1.name);
          action = configRichmenu.service1.name;
        }
        break;

      default:
        break;
    }
    res(action);
  });
};

actionComplate = async (user) => {
  let actionChange = {
    userId: user.userId,
    lastedUse: new Date(),
    action: user.action
  };
  await userService.updateUser(actionChange);
}

userGetDetail = async (element) => {
  return new Promise(async (resolve, reject) => {
    /**
     * !จับ error case
     * *เว็บและเบอร์โทรไม่มีข้อมูล
     */
    switch (element.postback.data) {
      case "error_web":
        resolve({
          type: "text",
          text: "ขออภัยด้วยครับเราไม่ข้อมูลเว็บดังกล่าว :("
        });
        break;
      case "error_tel":
        resolve({
          type: "text",
          text: "ขออภัยด้วยครับเราไม่ข้อมูลเบอร์โทรดังกล่าว :("
        });
        break;
      // eslint-disable-next-line no-fallthrough
      default:
        break;
    }

    var details = element.postback.data.split("^")[0];
    var place_id = element.postback.data.split("^")[1];
    var photo_ref = element.postback.data.split("^")[2];

    var flexTime_result;
    var flexReivew_result;

    /**
     * !จับ เคส detail
     */
    var url_photo;
    var review;
    var time_open;
    var flexDetail_result;
    var getdetail;
    var detail;
    console.log(photo_ref, "=>");
    if (photo_ref === "") {
      url_photo = "https://i.ibb.co/t4BKmmv/no-image.png";
      getdetail = await googleApi.PlaceDetail(place_id);
      detail = getdetail.data.result;
      console.log(url_photo);
      review = detail.reviews;
      time_open = detail.opening_hours;
      flexDetail_result = await flexService.flexdetail(detail, url_photo);
    } else {
      url_photo = await googleApi.placePhotoreFerence(photo_ref);
      getdetail = await googleApi.PlaceDetail(place_id);
      detail = getdetail.data.result;
      console.log(url_photo);
      review = detail.reviews;
      time_open = detail.opening_hours;
      flexDetail_result = await flexService.flexdetail(detail, url_photo.data);
    }
    let prototype = {
      type: "flex",
      altText: "Flex Message",
      contents: {
        type: "carousel",
        contents: []
      }
    };

    time_open ? (flexTime_result = await flexService.flextime(time_open)) : "";
    review ? (flexReivew_result = await flexService.flexreview(review)) : "";

    prototype.contents.contents.push(flexDetail_result.data);
    flexTime_result
      ? prototype.contents.contents.push(flexTime_result.data)
      : "";
    review
      ? flexReivew_result.data.forEach(e => {
        prototype.contents.contents.push(e);
      })
      : "";
    console.log(JSON.stringify(flexReivew_result));

    resolve(prototype, {
      type: "text",
      text: "คุณต้องการจะสอบถามเรื่องอื่นอีกหรือไม่"
    });
  });
};