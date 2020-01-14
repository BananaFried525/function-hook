module.exports.addTransaction = function(action) {
  return new Promise((resolve, reject) => {
    let transaction;
    if (action === "richmenu_hotel") {
      let transaction = nearBySeach;
      transaction.action = action;
      resolve(transaction);
    } else if (action === "richmenu_bus") {
      let transaction = sortBus;
      transaction.action = action;
      resolve(transaction);
    }
    
  });
};

let nearBySeach = {
  location: "",
  action: ""
};

let sortBus = {
  action: "",
  origin:null,
  destination:null,
  isComplete:false,
  timeStamp:new Date()
};
