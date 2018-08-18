var accountSid = 'AC55b59832f708eca4d6f4491d2bfc00f3';
var authToken = 'ebc640d42c03d12b483ec5363ebb16f0';

var twilio = require('twilio');
var client = new twilio(accountSid, authToken);

// send whatsapp message
client.messages
      .create({
        body: 'Hello there!',
        from: 'whatsapp:+14155238886',
        to: 'whatsapp:+919013699205'
      })
      .then(message => console.log(message.sid))
      .done();

// send sms
client.messages
  .create({
     body: 'This is the ship that made the Kessel Run in fourteen parsecs?',
     from: '+18325511392',
     to: '+919013699205'
   })
  .then(message => console.log(message.sid))
  .done();