'use strict';

var lastMsgTime;

function appendMsgsToHtml (msgsArr) {
  if (msgsArr.length) {
    lastMsgTime = msgsArr[0].timestamp;
    msgsArr.forEach(function (msg) {
      let newParagraph = $('<p>');
      newParagraph.addClass('message');
      let date = new Date(msg.timestamp).toLocaleTimeString();
      newParagraph.text(msg.contingut + ' Sent at ' + date);
      $('#main').append(newParagraph);
      $('#main').animate({scrollTop: $('#main').prop("scrollHeight")}, 500);
    });
  }
}

$(function() {
  
  // Signal websockets connection
  dpd.socketReady(function () {
    console.log('the websockets connection is ready');
  });

  // Initially fill UI.
  $.get('/messages?{"$limit":7,"$sort":{"timestamp":-1}}', appendMsgsToHtml);

  // Get new msgs from server through websockets
  dpd.messages.on('new', function(message) {
    appendMsgsToHtml([message]);
  });

  // When user clicks on "send" post msg to server
  // and append to UI.
  $('button').click(function() {
    let nouMissatge = $('input').val();
    $('input').val('');
    $.ajax({
      method: 'POST',
      url: 'http://localhost:2403/messages/',
      data: {
        contingut: nouMissatge
      }
    });
  });

});
