module.exports.handleEvent = function (event) {
  var message = event;
  var replyToken = event;
  var result;

  switch (message.type) {
    case 'text': result = replyText(message);
      console.info('text message detected');
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