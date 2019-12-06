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
    case 'postback': result = postbackHandle(message);
      console.info('');
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

function postbackHandle(message){

  reply = {
    type:'text',
    text:message.text
  };

  return reply;
}