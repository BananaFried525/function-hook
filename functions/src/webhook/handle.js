const userService = require("../services/user");
const transactionService = require("../services/transaction");
const busdirection = require("./busdirection");
const configRichmenu = require("./../config/config-lineservice.json");

module.exports = (user, event) => {
  return new Promise(async (res, rej) => {
    try {
      if (isNoAction(user.action)) {
        //create transaction for use next step
        //use global function handle for find type of action
      } else {
        if (checkCurrentAction(user)) {
          return null;
        } else {
          user.transaction = null;
          //need to create global function for handle action when user leave the action more 6o+ min
          return null;
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

handleAction = (event) => {
  var type = event.type;
  var action = "";
  switch (type) {
    case "message":
      break;
    case postback:
      if (event.postback.data === configRichmenu.service1.name) {
        console.log();
      }
      break;

    default:
      break;
  }
  return action;
};
