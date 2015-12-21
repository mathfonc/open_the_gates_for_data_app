var map;
var geocoder;
    function initMap() {
    	var mapOptions = {
        	center: {lat: 51.048017, lng: 3.727666},
        	zoom: 7
    } 
    map = new google.maps.Map(document.getElementById('map'), mapOptions);
}
	//sets google maps center to user input
	$('.countries-list').change(function() {
		var selectedCountry = $('#country-list').val();
		geocoder = new google.maps.Geocoder();
		geocoder.geocode({
			"address": selectedCountry
		}, function(results, status) {
			if(status == google.maps.GeocoderStatus.OK) {
				map.setCenter(results[0].geometry.location);
			} else {
				console.log("Geocode was not succesful: " + status);
			}
		});
	});