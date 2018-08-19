var socket = io();

var sayMessage = function (message) {
	if ('speechSynthesis' in window) {
		var msg = new SpeechSynthesisUtterance(message);
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
				const userAccidentRelationship = {
					accidentAddress: response.destinationAddresses[0],
					accidentDistance: response.rows[0].elements[0].distance.value, // in metres
					accidentDuration: response.rows[0].elements[0].duration.text
				};

				var template = $('#alert-template').html();
				var html = Mustache.render(template, {
					time: moment(data.time).format('h:mm a'),
					distance: userAccidentRelationship.accidentDistance / 1000,
					duration: userAccidentRelationship.accidentDuration,
					address: userAccidentRelationship.accidentAddress
				});

				$('#alert-container').prepend(html);

				sayMessage('There has been an accident ' + Math.round(userAccidentRelationship.accidentDistance/1000) + ' kilometres away from you. You are expected to reach there in ' + userAccidentRelationship.accidentDuration + '. Please be careful and drive slowly. We have alerted the local police and hospital for accident assistance.');
			}
		});

		// if (userAccidentRelationship.accidentDistance <= 5000) {
		// 	// tell user location of accident, distance, and expected time.
		// }

	});
});
