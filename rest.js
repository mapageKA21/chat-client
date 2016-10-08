'use strict';

var lastMsgTime;

function addRandMsgs (data) {
  $.post('/messages', {contingut: data.quoteText});
}

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

function pollServer () {
  $.get(`/messages?{"timestamp":{"$gt":${lastMsgTime}}}`, appendMsgsToHtml);
}

$(function () {
  
  // Initially fill UI.
  $.get('/messages?{"$limit":7,"$sort":{"timestamp":-1}}', appendMsgsToHtml);
    
  // // Poll server every 10 secs to get new msgs
  setInterval(pollServer, 2000);

  // When user clicks on "send" post msg to server
  // and append to UI.
  $('button').click(function () {
    let nouMissatge = $('input').val();
    $('input').val('');
    $.ajax({
      method: 'POST',
      url: 'http://localhost:2403/messages/',
      data: {
        contingut: nouMissatge
      },
      success: function (data) {
        appendMsgsToHtml([data]);
      }
    });
  });

  // // Every "x" seconds get a new random quote,
  // // and post it to server.
  // (function getRandomMsg () {
  //     $.ajax({
  //       url: "http://api.forismatic.com/api/1.0/",
  //       jsonp: "jsonp",
  //       dataType: "jsonp",
  //       data: {
  //         method: "getQuote",
  //         lang: "en",
  //         format: "jsonp"
  //       }
  //     })
  //     .done(addRandMsgs);
  //     setTimeout(getRandomMsg, Math.random()*240000);
  // })();

});

// fer que només carregui els 6 primers missatges OK
// scroll up i que carregui antics missatges
// random time OK
// pulling server every 5-10 sec OK
// websockets
// fer que et return funcioni -botó-
// fer que un cop enviat el input quedi buit OK
