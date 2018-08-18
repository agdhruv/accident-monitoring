var socket = io();

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
		const URL = 'https://maps.googleapis.com/maps/api/distancematrix/json?&origins=' + currentLocation.longitude +  ',' +currentLocation.latitude + '&destinations=' accidentLocation.longitude + ',' + accidentLocation.latitude + '&key=' + API_KEY;
		
	};

});
