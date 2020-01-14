module.exports.addTransaction = function(Action){
  let transaction;
  if(Action === "richmenu_hotel"){
    let transaction = nearBySeach
    transaction.action = Action;
  }
  return transaction;
}

let nearBySeach = {
  "location":"",
  "action":"",

}