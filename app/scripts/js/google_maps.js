    var map;
    function initMap() {
        var mapOptions = {
            center: {lat: 51.048017, lng: 3.727666},
            zoom: 7
        } 
        map = new google.maps.Map(document.getElementById('map'),mapOptions);
    }