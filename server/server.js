const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const bodyParser = require('body-parser');
const moment = require('moment');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

var {getLocationFromCameraId} = require('./utils/utils');
var {sendSMS, sendWhatsappMessage} = require('./send_messages/send_messages');

app.use(express.static(publicPath));
app.use(bodyParser.json());

app.io = io;

io.on('connection', (socket) => {
	console.log('New user detected');

	socket.on('disconnect', () => {
		console.log('User left');
	});
});

app.post('/accident', (req, res) => {
	let {cameraId} = req.body;

	let location = getLocationFromCameraId(cameraId);

	let time = moment().valueOf()

	var message = `An accident has occurred at https://www.google.com/maps?q=${location.latitude},${location.longitude}. Please make the necessary assistance accommodations.`;

	// // not sending messages for now
	// sendSMS(message);
	// sendWhatsappMessage(message);

	
	// emit accident to all online users
	req.app.io.emit('accident', {
		location
	});

	res.status(200).send();
});

server.listen(port, () => {
	console.log(`Server is up on port ${port}`);
});