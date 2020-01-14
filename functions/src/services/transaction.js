module.exports.addTransaction = function(Action){
  let transaction;
  if(Action === "richmenu_hotel"){
    let transaction = nearBySeach
    transaction.action = Action;
  }else if(Action === "rishmenu_bus"){
    let transaction = sortBus;
    transaction.action = Action;
  }
  return transaction;
}

let nearBySeach = {
  "location":"",
  "action":"",

}

let sortBus = {
  "location":"",
  "action":""
}