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
            
            showMeteo(cityname);
            var info = "Paris (UK: /\u02c8p\u00e6r\u026as/ PARR-iss; US: /\u02c8p\u025b\u0259r\u026as/ PAIR-iss; French: [pa\u0281i]) is the capital and most populous city of France. Situated on the Seine River, in the north of the country, it is in the centre of the \u00cele-de-France region, also known as the r\u00e9gion parisienne, \"Paris Region\". The City of Paris has an area of 105 km\u00b2 (41 mi\u00b2) and a population of 2,241,346 (2014 estimate) within its administrative borders essentially unchanged since 1860.\nSince the 19th century, the built-up area of Paris has grown far beyond its administrative borders; together with its suburbs, the whole agglomeration has a population of 10,550,350 (Jan. 2012 census). Paris' metropolitan area spans most of the Paris region and has a population of 12,341,418 (Jan. 2012 census), or one-fifth of the population of France. The administrative region covers 12,012 km\u00b2 (4,638 mi\u00b2), with approximately 12 million inhabitants as of 2014, and has its own regional council and president.\nParis was founded in the 3rd century BC by a Celtic people called the Parisii, who gave the city its name. By the 12th century, Paris was the largest city in the western world, a prosperous trading centre, and the home of the University of Paris, one of the first in Europe. In the 18th century, it was the centre stage for the French Revolution, and became an important centre of finance, commerce, fashion, science, and the arts, a position it still retains today.\nThe Paris Region had a GDP of \u20ac624 billion (US $687 billion) in 2012, accounting for 30.0 percent of the GDP of France, and ranking it as one of the five wealthiest regions in Europe; it is the banking and financial centre of France, and contains the headquarters of 29 of the 31 French companies ranked in the 2015 Fortune Global 500.\nParis is the home of the most visited art museum in the world, the Louvre, as well as the Mus\u00e9e d'Orsay, noted for its collection of French Impressionist art, and the Mus\u00e9e National d'Art Moderne, a museum of modern and contemporary art. The notable architectural landmarks of Paris include Notre Dame Cathedral (12th century); the Sainte-Chapelle (13th century); the Eiffel Tower (1889); and the Basilica of Sacr\u00e9-C\u0153ur on Montmartre (1914). In 2014 Paris received 22.4 million visitors, making it one of the world's top tourist destinations. Paris is also known for its fashion, particularly the twice-yearly Paris Fashion Week, and for its haute cuisine, and three-star restaurants. Most of France's major universities and grandes \u00e9coles are located in Paris, as are France's major newspapers, including Le Monde, Le Figaro, and Lib\u00e9ration.\nParis is home to the association football club Paris Saint-Germain and the rugby union club Stade Fran\u00e7ais. The 80,000-seat Stade de France, built for the 1998 FIFA World Cup, is located just north of Paris in the commune of Saint-Denis. Paris hosts the annual French Open Grand Slam tennis tournament on the red clay of Roland Garros. Paris played host to the 1900 and 1924 Summer Olympics, the 1938 and 1998 FIFA World Cups, and the 2007 Rugby World Cup.\nThe city is a major rail, highway, and air-transport hub, served by the two international airports Paris-Charles de Gaulle and Paris-Orly. Opened in 1900, the city's subway system, the Paris M\u00e9tro, serves 4.5 million passengers daily. Paris is the hub of the national road network, and is surrounded by three orbital roads: the P\u00e9riph\u00e9rique, the A86 motorway, and the Francilienne motorway in the outer suburbs.";
            info = info.substring(0, 600);
            var infoshow = info.substring(0, info.lastIndexOf(".")+1);
            infoshow += '<a href="https://en.wikipedia.org/wiki/"+cityname> Read more...</a>';
            $("#city-information-content").html(infoshow);
            $("#city-information-title").html(cityname);
	    }
	}
/*    $.ajax({ url: "/visit",
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
                 
                 if(data.img.length == 0) $("#city-image").attr("src", "file:///D|/Mineure6/cityprint/public/images/city.jpg");
                 else $("#city-image").attr("src", data.img);
                 
                 if(data.extract.length == 0) {
                     var info = "No available information for this city.";
                     info += '<a href="https://en.wikipedia.org/wiki/"+cityname> Search more...</a>';
                 }
                 else {
                     var info = data.extract.substring(0, 550);
                     info = info.substring(0, info.lastIndexOf(".")+1);
                     info += '<a href="https://en.wikipedia.org/wiki/"+cityname> Read more...</a>'; 
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
                 for(int i=data.impression.length-1; i>data.impression.length-4; i--){
                    var commentbefore = $("#comments").html();
                    $("#comments").html(commentbefore + "<blockquote><p>" + data.impression[i].impression + "</p><footer>" + data.impression[i].username + " in <cite title='Cityprint'>Cityprint</cite></footer></blockquote>"); 
                 }
	         },
             error: function(jqXHR, textStatus, errorThrown) {
                console.log(errorThrown + " : " + textStatus);
             }
    }); */
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

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
                        'Error: The Geolocation service failed.' :
                        'Error: Your browser doesn\'t support geolocation.');
}

function handleGeocodingError() {
	console.log("Geocoding ajax failed");
}