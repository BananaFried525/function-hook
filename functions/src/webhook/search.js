const transactionService = require("./../services/transaction");
const userService = require("../services/user");
const configRichmenu = require("./../config/config-lineservice.json");

module.exports.createTransaction = async(action) =>{
  let transaction = transactionService(action);
  user.transaction = transaction;
  await userService.updateUser(user);
};