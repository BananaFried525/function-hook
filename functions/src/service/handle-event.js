module.exports.handleEvent = function (event) {
  var message = event.message;
  var replyToken = event.replyToken;
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
  reply = {
    type:'text',
    text:message.text
  };

  return reply;
}