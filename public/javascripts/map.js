function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 48.85, lng: 2.35},
    zoom: 6
  });
  
  var styles = [{"featureType":"landscape","stylers":[{"hue":"#FFBB00"},{"saturation":43.400000000000006},{"lightness":37.599999999999994},{"gamma":1}]},{"featureType":"road.highway","stylers":[{"hue":"#FFC200"},{"saturation":-61.8},{"lightness":45.599999999999994},{"gamma":1}]},{"featureType":"road.arterial","stylers":[{"hue":"#FF0300"},{"saturation":-100},{"lightness":51.19999999999999},{"gamma":1}]},{"featureType":"road.local","stylers":[{"hue":"#FF0300"},{"saturation":-100},{"lightness":52},{"gamma":1}]},{"featureType":"water","stylers":[{"hue":"#0078FF"},{"saturation":-13.200000000000003},{"lightness":2.4000000000000057},{"gamma":1}]},{"featureType":"poi","stylers":[{"hue":"#00FF6A"},{"saturation":-1.0989010989011234},{"lightness":11.200000000000017},{"gamma":1}]}];
  map.setOptions({styles: styles});
  var infoWindow = new google.maps.InfoWindow({map: map});

  // Try HTML5 geolocation.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      
	  var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
      };
	  // Test data
	  /*
	  var pos = { // Paris
          lat: 48.860896,
          lng: 2.318229
	  }
	  var pos = { // Brest
          lat: 48.386503,
          lng: -4.527755
	  }
	  var pos = { // Mountain View
          lat: 37.402863,
          lng: -122.087074
	  }
	  var pos = { // Beijing
          lat: 39.902737,
          lng: 116.323264
	  }
	  var pos = { // Xinjiang
	      lat: 38.316650,
	      lng: 86.260770
	  }
	  */
      $.ajax({ url: "https://maps.googleapis.com/maps/api/geocode/json",
			   data: { latlng : pos.lat + "," + pos.lng, key : "AIzaSyDpf02DeUFnntIXhEw5yv5jKHKVKkPArpQ", format : "json" },                
               success: getCityInfo,
               error: handleGeocodingError 
            });
			   
      infoWindow.setPosition(pos);
      infoWindow.setContent('Location found.');
      map.setCenter(pos);
    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }
}

function getCityInfo(data) {
	var country = '';
	var cityname = '';
	var lat = 0.0;
	var lng = 0.0;
	for (var i = 0; i < data.results.length; i ++) {
		var address = data.results[i];
	    if (address.types[0] == "country"){
	        country = address.address_components[0].long_name; // country name
	    }
	    if (address.types[0] == "locality"){
	        cityname = address.address_components[0].long_name; // city name
			lat = address.geometry.location.lat;
			lng = address.geometry.location.lng;
	    }
	}
    $.ajax({ url: "/visit",
		     data: { cityname : cityname, country : country, lat : lat, lng : lng },
	         dataType: "json",
	         type: "GET",
	         success: function(data) {
				 console.log(data.extract);
				 console.log(data.img);
				 for (var i = 0; i < data.pathway.length; i ++) {
					 var marker = new google.maps.Marker({
					     position: { lat: data.pathway[i].latitude, lng: data.pathway[i].longitude },
					     map: map
					  });
				 }
	         },
             error: function(jqXHR, textStatus, errorThrown) {
                console.log(errorThrown + " : " + textStatus);
             }
    });
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
                        'Error: The Geolocation service failed.' :
                        'Error: Your browser doesn\'t support geolocation.');
}

function handleGeocodingError() {
	console.log("Geocoding ajax failed");
}