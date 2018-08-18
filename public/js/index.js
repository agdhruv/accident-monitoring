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

		const userAccidentRelationship = getDistanceFromUser(currentLocation, accidentLocation);

		// if (userAccidentRelationship.accidentDistance <= 5000) {
		// 	// tell user location of accident, distance, and expected time.
		// }

		var template = $('#alert-template').html();
		var html = Mustache.render(template, {
			text: 
		});

	});
});

function getDistanceFromUser (currentLocation, accidentLocation) {
	var origin = {
		lat: currentLocation.latitude,
		lng: currentLocation.longitude
	}

	var destination = {
		lat: accidentLocation.latitude,
		lng: accidentLocation.longitude
	}

	var service = new google.maps.DistanceMatrixService;

	service.getDistanceMatrix({
		origins: [origin],
		destinations: [destination],
		travelMode: 'DRIVING',
		unitSystem: google.maps.UnitSystem.METRIC,
		avoidHighways: false,
		avoidTolls: false
	}, function (response, status) {
		if (status === 'OK') {
			return {
				accidentAddress: response.destinationAddress,
				accidentDistance: response.rows[0].elements.distance.value, // in metres
				accidentDuration: response.rows[0].elements.duration.text
			}
		}
	});
}

