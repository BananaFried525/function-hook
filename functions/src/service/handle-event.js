module.exports = function (event) {
  var message = event;
  var replyToken = event;
  var result;

  switch (message.type) {
    case 'text': result = replyText(message);
      break;
    case 'location':
      break;
    default:
      break;
  }

  return [replyToken, result];
}

function replyText(message) {
  var reply = "";
  reply = message.text;
  return reply;
}