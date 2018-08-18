var socket = io();

var sayMessage = function (message) {

	if ('speechSynthesis' in window) {
		var msg = new SpeechSynthesisUtterance(message);
		var voices = window.speechSynthesis.getVoices();
		msg.voice = voices[9];
		msg.rate = 7;
		window.speechSynthesis.speak(msg);
	}

}

socket.on('connect', function () {
	console.log('Connected to server');

	if (!navigator.geolocation) {
		return;
	}

	navigator.geolocation.getCurrentPosition(function (position) {
		console.log('Thank you for location permission.');
	});

});

socket.on('disconnect', function () {
	console.log('Disconnected from server');
});

socket.on('accident', (data) => {
	var accidentLocation = data.location;

	navigator.geolocation.getCurrentPosition(function (position) {
		var currentLocation = {
			longitude: position.coords.longitude,
			latitude: position.coords.latitude
		};

		const API_KEY = 'AIzaSyDkA09cfePUtb2975Dd90OKGaidfewrHoE';
		const URL = 'https://maps.googleapis.com/maps/api/distancematrix/json?&origins=' + currentLocation.latitude +  ',' + currentLocation.longitude + '&destinations=' + accidentLocation.latitude + ',' + accidentLocation.longitude + '&key=' + API_KEY;
		
		$.ajax({
			type: 'GET',
			url: URL,
			crossDomain: true,
			success: function (data) {
				sayMessage('There has been an accident 10 minutes away from you. Please slow down and drive carefully.');
				console.log(data);
			},
			dataType: 'json'
		});
	});
});
