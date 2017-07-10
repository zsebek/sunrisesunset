// Javascript for MBTA lab
// These are now global variables
            var myLat = 0;
            var myLng = 0;
            var map;
            var me = new google.maps.LatLng(myLat,myLng);
            var marker_for_me;
            var infowindow_for_me = new google.maps.InfoWindow();
            var myOptions = {
                                zoom: 8,
                                center: me
            };


            // creates the link since it can't easily be typed
            // in Javascript without the double slash creating 
            // a comment. 
            var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';

            // array for minutes (after dividing the seconds) till arrival for the trains. 
            var times;
            var minutes_til_arrival ;


            

            // MBTA Red Line Stations
           
              var boston = new google.maps.LatLng(42.358050, -71.086173);
              var groton = new google.maps.LatLng(42.609593, -71.574206);
              var millbrae = new google.maps.LatLng(37.599978, -122.400253);
              var bangkok = new google.maps.LatLng(13.736646, 100.512461);
              var singapore = new google.maps.LatLng(1.328741, 103.840007);
              var mumbai = new google.maps.LatLng(19.075371, 72.856707);
              var san_diego = new google.maps.LatLng(32.834339, -117.272091);

			function init()
			{
          

					


       	// The actual initialization of the map
        // May have to work around this to actually get it to center ony my location
        map = new google.maps.Map(document.getElementById('map_canvas'), myOptions);


              
 
      // Testing Get My Location Function
      getMyLocation();
              

      // San Diego
        var marker = new google.maps.Marker({
          position: san_diego,
          map: map
          });

        var infoWindow = new google.maps.InfoWindow();

        google.maps.event.addListener(marker, 'click', function () {
       
          var request = new XMLHttpRequest();
           var theActualMarker = this;
          request.open("GET", "https://api.sunrise-sunset.org/json?lat=32.834339&lng=-117.272091", true);
          // MOAR CODE, Actual parsing 


          request.onreadystatechange = function() {
            if (request.readyState == 4 && request.status == 200) {
            var result = request.responseText;
            sunrisesunset_data = JSON.parse(result);
    
            sunrise = sunrisesunset_data.results.sunrise;
            sunset = sunrisesunset_data.results.sunset;
            console.log(sunrise);
            console.log(sunset);
              this.title = "Sunrise time: " + sunrise + ".\n" + "Sunset time: " + sunset + ".\n";
               

            }

            infoWindow.setContent(this.title);
            infoWindow.open(map, theActualMarker); 
            }
          
          request.send();

          }); // for add listener


      // boston
        var marker = new google.maps.Marker({
          position: boston,
          map: map
          });

        var infoWindow = new google.maps.InfoWindow();

        google.maps.event.addListener(marker, 'click', function () {
       
          var request = new XMLHttpRequest();
           var theActualMarker = this;
          request.open("GET", "https://api.sunrise-sunset.org/json?lat=42.358050&lng=-71.086173", true);
         

          request.onreadystatechange = function() {
            if (request.readyState == 4 && request.status == 200) {
            var result = request.responseText;
            sunrisesunset_data = JSON.parse(result);
    
            sunrise = sunrisesunset_data.results.sunrise;
            sunset = sunrisesunset_data.results.sunset;
            console.log(sunrise);
            console.log(sunset);
              this.title = "Sunrise time: " + sunrise + ".\n" + "Sunset time: " + sunset + ".\n";
               

            }

            infoWindow.setContent(this.title);
            infoWindow.open(map, theActualMarker); 
            }
          
          request.send();

          }); // for add listener



        // Groton 
        var marker = new google.maps.Marker({
          position: groton,
          map: map
          });

        var infoWindow = new google.maps.InfoWindow();

        google.maps.event.addListener(marker, 'click', function () {
       
          var request = new XMLHttpRequest();
           var theActualMarker = this;
          request.open("GET", "https://api.sunrise-sunset.org/json?lat=42.609593&lng=-71.574206", true);
         

          request.onreadystatechange = function() {
            if (request.readyState == 4 && request.status == 200) {
            var result = request.responseText;
            sunrisesunset_data = JSON.parse(result);
    
            sunrise = sunrisesunset_data.results.sunrise;
            sunset = sunrisesunset_data.results.sunset;
            console.log(sunrise);
            console.log(sunset);
              this.title = "Sunrise time: " + sunrise + ".\n" + "Sunset time: " + sunset + ".\n";
               

            }

            infoWindow.setContent(this.title);
            infoWindow.open(map, theActualMarker); 
            }
          
          request.send();

          }); // for add listener















        // Millbrae 
        var marker = new google.maps.Marker({
          position: millbrae,
          map: map
          });

        var infoWindow = new google.maps.InfoWindow();

        google.maps.event.addListener(marker, 'click', function () {
       
          var request = new XMLHttpRequest();
           var theActualMarker = this;
          request.open("GET", "https://api.sunrise-sunset.org/json?lat=37.599978&lng=-122.400253", true);
         

          request.onreadystatechange = function() {
            if (request.readyState == 4 && request.status == 200) {
            var result = request.responseText;
            sunrisesunset_data = JSON.parse(result);
    
            sunrise = sunrisesunset_data.results.sunrise;
            sunset = sunrisesunset_data.results.sunset;
            console.log(sunrise);
            console.log(sunset);
              this.title = "Sunrise time: " + sunrise + ".\n" + "Sunset time: " + sunset + ".\n";
               

            }

            infoWindow.setContent(this.title);
            infoWindow.open(map, theActualMarker); 
            }
          
          request.send();

          }); // for add listener












        // Bangkok 
        var marker = new google.maps.Marker({
          position: bangkok,
          map: map
          });

        var infoWindow = new google.maps.InfoWindow();

        google.maps.event.addListener(marker, 'click', function () {
       
          var request = new XMLHttpRequest();
           var theActualMarker = this;
          request.open("GET", "https://api.sunrise-sunset.org/json?lat=13.736646&lng=100.512461", true);
         

          request.onreadystatechange = function() {
            if (request.readyState == 4 && request.status == 200) {
            var result = request.responseText;
            sunrisesunset_data = JSON.parse(result);
    
            sunrise = sunrisesunset_data.results.sunrise;
            sunset = sunrisesunset_data.results.sunset;
            console.log(sunrise);
            console.log(sunset);
              this.title = "Sunrise time: " + sunrise + ".\n" + "Sunset time: " + sunset + ".\n";
               

            }

            infoWindow.setContent(this.title);
            infoWindow.open(map, theActualMarker); 
            }
          
          request.send();

          }); // for add listener








        // Singapore 
        var marker = new google.maps.Marker({
          position: singapore,
          map: map
          });

        var infoWindow = new google.maps.InfoWindow();

        google.maps.event.addListener(marker, 'click', function () {
       
          var request = new XMLHttpRequest();
           var theActualMarker = this;
          request.open("GET", "https://api.sunrise-sunset.org/json?lat=1.328741&lng=103.840007", true);
         

          request.onreadystatechange = function() {
            if (request.readyState == 4 && request.status == 200) {
            var result = request.responseText;
            sunrisesunset_data = JSON.parse(result);
    
            sunrise = sunrisesunset_data.results.sunrise;
            sunset = sunrisesunset_data.results.sunset;
            console.log(sunrise);
            console.log(sunset);
              this.title = "Sunrise time: " + sunrise + ".\n" + "Sunset time: " + sunset + ".\n";
               

            }

            infoWindow.setContent(this.title);
            infoWindow.open(map, theActualMarker); 
            }
          
          request.send();

          }); // for add listener










        // Mumbai
        var marker = new google.maps.Marker({
          position: mumbai,
          map: map
          });

        var infoWindow = new google.maps.InfoWindow();

        google.maps.event.addListener(marker, 'click', function () {
       
          var request = new XMLHttpRequest();
           var theActualMarker = this;
          request.open("GET", "https://api.sunrise-sunset.org/json?lat=19.075371&lng=72.856707", true);
         

          request.onreadystatechange = function() {
            if (request.readyState == 4 && request.status == 200) {
            var result = request.responseText;
            sunrisesunset_data = JSON.parse(result);
    
            sunrise = sunrisesunset_data.results.sunrise;
            sunset = sunrisesunset_data.results.sunset;
            console.log(sunrise);
            console.log(sunset);
              this.title = "Sunrise time: " + sunrise + ".\n" + "Sunset time: " + sunset + ".\n";
               

            }

            infoWindow.setContent(this.title);
            infoWindow.open(map, theActualMarker); 
            }
          
          request.send();

          }); // for add listener



        	// Ending brace below
			}






      function getMyLocation() {
        if (navigator.geolocation) { // the navigator.geolocation object is supported on your browser
          navigator.geolocation.getCurrentPosition(function(position) {

               myLat = position.coords.latitude;
               myLng = position.coords.longitude;
              
              me = { lat: myLat, lng: myLng};
              map.panTo(me);


            // Distance code here so you can put it in the content. 
            var my_location = new google.maps.LatLng(myLat ,myLng );
              

              marker_for_me = new google.maps.Marker({
              position: me,
              map: map,
              });

              marker_for_me.setMap(map);



              var infoWindow = new google.maps.InfoWindow();

              google.maps.event.addListener(marker_for_me, 'click', function() {

              var request = new XMLHttpRequest();
              var theActualMarker = this;
              request.open("GET", "https://api.sunrise-sunset.org/json?lat=19.075371&lng=72.856707", true);  


                        request.onreadystatechange = function() {
            if (request.readyState == 4 && request.status == 200) {
            var result = request.responseText;
            sunrisesunset_data = JSON.parse(result);
    
            sunrise = sunrisesunset_data.results.sunrise;
            sunset = sunrisesunset_data.results.sunset;
            console.log(sunrise);
            console.log(sunset);
              this.title = "Sunrise time: " + sunrise + ".\n" + "Sunset time: " + sunset + ".\n";
               

            }

            infoWindow.setContent(this.title);
            infoWindow.open(map, theActualMarker); 
            }
          
          request.send();

              });

              
                
                
                

              // For navigator function
           });

        }
        
      }





