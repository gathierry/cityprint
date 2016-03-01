function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 48.85, lng: 2.35},
    zoom: 6
  });
  
  var styles = [{"featureType":"landscape","stylers":[{"hue":"#FFBB00"},{"saturation":43.400000000000006},{"lightness":37.599999999999994},{"gamma":1}]},{"featureType":"road.highway","stylers":[{"hue":"#FFC200"},{"saturation":-61.8},{"lightness":45.599999999999994},{"gamma":1}]},{"featureType":"road.arterial","stylers":[{"hue":"#FF0300"},{"saturation":-100},{"lightness":51.19999999999999},{"gamma":1}]},{"featureType":"road.local","stylers":[{"hue":"#FF0300"},{"saturation":-100},{"lightness":52},{"gamma":1}]},{"featureType":"water","stylers":[{"hue":"#0078FF"},{"saturation":-13.200000000000003},{"lightness":2.4000000000000057},{"gamma":1}]},{"featureType":"poi","stylers":[{"hue":"#00FF6A"},{"saturation":-1.0989010989011234},{"lightness":11.200000000000017},{"gamma":1}]}];
  map.setOptions({styles: styles});
  //var infoWindow = new google.maps.InfoWindow({map: map});

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
			   
      //infoWindow.setPosition(pos);
      //infoWindow.setContent('Location found.');
	 var marker = new google.maps.Marker({
	     position: pos,
	     map: map
	  });
      map.setCenter(pos);
    }, function() {
      handleLocationError(true, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, map.getCenter());
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
            
            showMeteo(cityname);
	    }
	}
    $.ajax({ url: "/visit",
		     data: { cityname : cityname, country : country, lat : lat, lng : lng },
	         dataType: "json",
	         type: "GET",
	         success: function(data) {
				 console.log(data);
				 var markImg = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';
				 for (var i = 0; i < data.pathway.cities.length; i ++) {
					 var marker = new google.maps.Marker({
					     position: { lat: data.pathway.cities[i].latitude, lng: data.pathway.cities[i].longitude },
					     map: map,
						 icon:  markImg
					  });
				 }
                 
                 if(data.img.length == 0) $("#city-image").attr("src", "file:///D|/Mineure6/cityprint/public/images/city.jpg");
                 else $("#city-image").attr("src", data.img);
                 
                 if(data.extract.length == 0) {
                     var info = "No available information for this city.";
                     info += '<a href=https://en.wikipedia.org/wiki/'+cityname+'> Search more...</a>';
                 }
                 else {
                     var info = data.extract.substring(0, 550);
                     info = info.substring(0, info.lastIndexOf(".")+1);
                     info += '<a href=https://en.wikipedia.org/wiki/'+cityname+'> Read more...</a>'; 
                 }
                 
                 $("#city-information-content").html(info);
                 $("#city-information-title").html(cityname);
                 
                 var citypercent = data.pathway.nbCity*100/400;
                 $("#city-percent").attr("aria-valuenow", citypercent);
                 $("#city-percent").attr("style", "min-width: 2em; width: "+citypercent+"%;");
                 $("#city-percent").html(citypercent+"%");
                 $("#city-percent-info").html("You have travelled in "+data.pathway.nbCity+" different cities.");
                 
                 var countrypercent = data.pathway.nbCountry*100/200;
                 $("#country-percent").attr("aria-valuenow", countrypercent);
                 $("#country-percent").attr("style", "min-width: 2em; width: "+countrypercent+"%;");
                 $("#country-percent").html(countrypercent+"%");
                 $("#country-percent-info").html("You have travelled in "+data.pathway.nbCountry+" different countries.");
                 
                 if(data.impression[0].length==0) {
                     $("#personalcomment").html('<div class="alert alert-info" role="alert">Leave your footprint here!</div>');
                 }
                 else {
                     $("#personalcomment").html("<dl class='dl-horizontal'><dt>" + data.impression[0].username + "</dt><dd>" + data.impression[0].impression + "</dd></dl>");  
                 }
                 $("#comments").html("");
                 for(var i=data.impression.length-1; i>data.impression.length-4; i--){
                    var commentbefore = $("#comments").html();
                    $("#comments").html(commentbefore + "<blockquote><p>" + data.impression[i].impression + "</p><footer>" + data.impression[i].username + "</footer></blockquote>"); 
                 }
	         },
             error: function(jqXHR, textStatus, errorThrown) {
                console.log(errorThrown + " : " + textStatus);
             }
    });
}

function showMeteo(cityname) {
    $.ajax({ url: "http://api.openweathermap.org/data/2.5/weather",
             data: { q: cityname, appid: "f71402678b528d66222aabe9e51cb1c5", lang: "en", mode: "jsonp" },
             dataType: "jsonp",
             success: function(city){
                $("#meteo-image").attr("src", "http://openweathermap.org/img/w/" + city.weather[0].icon + ".png");
                $("#temperature").html((city.main.temp-273.15).toFixed(2)+"°C");
	            $("#meteo-information p").html(city.weather[0].description);
                $("#meteo-information table").attr("border", "1");
                var tablecontent = '<tr><th rowspan="2">Wind</th><th>speed</th><td>' + city.wind.speed + ' m/s </td></tr>';
                tablecontent += '<tr><th>degree</th><td>' + city.wind.deg + '</td></tr>';
                tablecontent += '<tr><th colspan="2">Pressure</th><td>' + city.main.pressure + ' hpa </td></tr>';
                tablecontent += '<tr><th colspan="2">Humidity</th><td>' + city.main.humidity + ' %</td></tr>';
                $("#meteo-information table").html(tablecontent);
             },
             error: function(jqXHR, textStatus, errorThrown) {
                 console.log(errorThrown + " : " + textStatus);
             }
    });
}

function handleLocationError(browserHasGeolocation, pos) {
	alert('Error: The Geolocation service failed, please check if your browser support geolocation');
  //infoWindow.setPosition(pos);
  //infoWindow.setContent(browserHasGeolocation ?
                        //'Error: The Geolocation service failed.' :
                        //'Error: Your browser doesn\'t support geolocation.');
}

function handleGeocodingError() {
	console.log("Geocoding ajax failed");
}