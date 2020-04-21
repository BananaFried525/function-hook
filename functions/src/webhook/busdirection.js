const transactionService = require("./../services/transaction");
const userService = require("../services/user");
const configRichmenu = require("./../config/config-lineservice.json");

module.exports.createTransaction = async (user) => {
  let transaction = transactionService(configRichmenu.service1.name);
  user.transaction = transaction;
  await userService.updateUser(user);
};

module.exports.getOrigin = () => {};
module.exports.getDestination = () => {};
module.exports.requestDirectionApi = () => {};
