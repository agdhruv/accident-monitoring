var accountSid = 'AC55b59832f708eca4d6f4491d2bfc00f3';
var authToken = 'ebc640d42c03d12b483ec5363ebb16f0';

var twilio = require('twilio');
var client = new twilio(accountSid, authToken);

var sendWhatsappMessage = (message) => {
	client.messages
		.create({
			body: message,
			from: 'whatsapp:+14155238886',
			to: 'whatsapp:+919013699205'
		})
		.then(message => console.log(message.sid))
		.done();
};

var sendSMS = (message) => {
	client.messages
	.create({
		body: message,
		from: '+18325511392',
		to: '+919013699205'
	})
	.then(message => console.log(message.sid))
	.done();
};

module.exports = {
	sendWhatsappMessage,
	sendSMS
}