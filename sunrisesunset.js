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
            var south_station = new google.maps.LatLng( 42.352271, -71.05524200000001);
              var andrew = new google.maps.LatLng( 42.330154, -71.057655);
              var porter_square = new google.maps.LatLng( 42.3884, -71.11914899999999);
              var harvard_square = new google.maps.LatLng( 42.373362, 
                 -71.118956);
              var jfk_umass = new google.maps.LatLng(42.320685, -71.052391);
              var savin_hill = new google.maps.LatLng( 42.31129, -71.053331);
              var park_street = new google.maps.LatLng( 42.35639457, -71.0624242);
              var broadway = new google.maps.LatLng( 42.342622, -71.056967);
              var north_quincy = new google.maps.LatLng( 42.275275, -71.029583);
              var shawmut = new google.maps.LatLng( 42.29312583, -71.06573796000001);
              var davis = new google.maps.LatLng( 42.39674 , -71.121815);
              var alewife = new google.maps.LatLng( 42.395428, -71.142483);
              var kendall_mit = new google.maps.LatLng( 42.36249079, -71.08617653);
              var charles_mgh = new google.maps.LatLng( 42.361166, -71.070628);
              var downtown_crossing = new google.maps.LatLng( 42.355518, -71.060225);
              var quincy_center = new google.maps.LatLng( 42.251809, 
                   -71.005409);
              var quincy_adams = new google.maps.LatLng( 42.233391, -71.007153);
              var ashmont = new google.maps.LatLng( 42.284652, -71.06448899999999);
              var wollaston = new google.maps.LatLng( 42.2665139, -71.0203369);
              var fields_corner = new google.maps.LatLng( 42.300093, 
                   -71.061667);
              var central_square = new google.maps.LatLng( 42.365486, -71.103802);
              var braintree = new google.maps.LatLng( 42.2078543, -71.0011385);

              // Variables for distance from stations!!!
              var meters_to_miles_converter = 0.000621371;
              var smallest_distance;
              var closest_station = " ";
              var closest_station_coords = new google.maps.LatLng();

              var south_station_distance;
              var andrew_distance;
              var porter_square_distance;
              var harvard_square_distance;
              var jfk_umass_distance;
              var savin_hill_distance;
              var park_street_distance;
              var broadway_distance;
              var north_quincy_distance;
              var shawmut_distance;
              var davis_distance;
              var alewife_distance;
              var kendall_mit_distance;
              var charles_mgh_distance;
              var downtown_crossing_distance;
              var quincy_center_distance;
              var quincy_adams_distance;
              var ashmont_distance;
              var wollaston_distance;
              var fields_corner_distance;
              var central_square_distance;
              var braintree_distance;



			function init()
			{
          

					


       	// The actual initialization of the map
        // May have to work around this to actually get it to center ony my location
        map = new google.maps.Map(document.getElementById('map_canvas'), myOptions);


              
 
      // Testing Get My Location Function
      getMyLocation();
              
      // Locating the trains?
      var request1 = new XMLHttpRequest();
      request1.open("GET","https://enigmatic-scrubland-94195.herokuapp.com/redline.json", true);

      request1.onreadystatechange = function() {
            if (request1.readyState == 4 && request1.status == 200) {

      var train_data = request1.responseText;
      train_locations = JSON.parse(train_data);
        
      for ( var count = 0; count < train_locations.TripList.Trips.length; count++)
      {
        // Not all trips have train... maybe I should use conditional first
        if ( train_locations.TripList.Trips[count].Position )
        {
            var train_lat = train_locations.TripList.Trips[count].Position.Lat;
            var train_lng = train_locations.TripList.Trips[count].Position.Long;
            var new_train = new google.maps.LatLng( train_lat, train_lng);

            var marker = new google.maps.Marker({
            position: new_train ,
            map: map,
            });
             
        }

        //for ( var trains = 0; trains < train_locations.TripList.Trips[count].Position.length; trains++)
        //{

        //}
      }

    }
  }

      request1.send();




        var marker = new google.maps.Marker({
          position: south_station,
          icon: iconBase + 'rail.png',
          map: map,
          });

        var infoWindow = new google.maps.InfoWindow();

        google.maps.event.addListener(marker, 'click', function () {
       
          var request = new XMLHttpRequest();
           var theActualMarker = this;
          request.open("GET", "https://enigmatic-scrubland-94195.herokuapp.com/redline.json", true);
          // MOAR CODE, Actual parsing 


          request.onreadystatechange = function() {
            if (request.readyState == 4 && request.status == 200) {
            var result = request.responseText;
            mbta_data = JSON.parse(result);
            var minutes_til_arrival_northbound = [ ];
            var minutes_til_arrival_southbound = [ ];
            

            for(var count = 0; count < mbta_data.TripList.Trips.length; count++)
            {
                for(var stops= 0; stops < mbta_data.TripList.Trips[count].Predictions.length; stops++)
                {
                  var info = mbta_data.TripList.Trips[count].Predictions[stops];
                //process here
                  if ( info.StopID == "70079")
                  {
                  minutes_til_arrival_southbound[minutes_til_arrival_southbound.length] = info.Seconds / 60; 
                  }
                  if (info.StopID == "70080")
                  {
                    minutes_til_arrival_northbound[minutes_til_arrival_northbound.length] = info.Seconds / 60;
                  }
            }

            }
              // Sort the arrays here (it works)
              
              minutes_til_arrival_southbound.sort(function(a, b){return a-b});
              minutes_til_arrival_northbound.sort(function(a, b){return a-b});
              
              this.title = "Trains to Ashmont/Braintree: </br>" + minutes_til_arrival_southbound[0]
               + " min </br>" + minutes_til_arrival_southbound[1] + " min </br>" + minutes_til_arrival_southbound[2] + " min </br>" +
               "Trains to Alewife: </br>" + minutes_til_arrival_northbound[0] + " min </br>" + minutes_til_arrival_northbound[1] + " min </br>"
               + minutes_til_arrival_northbound[2] + " min </br>";
              //for (var i = 0; i < minutes_til_arrival_southbound.length; i++)
              //{
              // return minutes_til_arrival_southbound + "</br>"
              //}
            }

            infoWindow.setContent(this.title);
            infoWindow.open(map, theActualMarker); 
            }
          
          request.send();

          }); // for add listener






        var marker = new google.maps.Marker({
          position: andrew,
          icon: iconBase + 'rail.png',
          map: map
        });

        var infoWindow = new google.maps.InfoWindow();

        google.maps.event.addListener(marker, 'click', function () {
       
          var request = new XMLHttpRequest();
           var theActualMarker = this;
          request.open("GET", "https://enigmatic-scrubland-94195.herokuapp.com/redline.json", true);
          // MOAR CODE, Actual parsing 


          request.onreadystatechange = function() {
            if (request.readyState == 4 && request.status == 200) {
            var result = request.responseText;
            mbta_data = JSON.parse(result);
            var minutes_til_arrival_northbound = [ ];
            var minutes_til_arrival_southbound = [ ];
            

            for(var count = 0; count < mbta_data.TripList.Trips.length; count++)
            {
                for(var stops= 0; stops < mbta_data.TripList.Trips[count].Predictions.length; stops++)
                {
                  var info = mbta_data.TripList.Trips[count].Predictions[stops];
                //process here
                  if ( info.StopID == "70083")
                  {
                  minutes_til_arrival_southbound[minutes_til_arrival_southbound.length] = info.Seconds / 60; 
                  }
                  if (info.StopID == "70084")
                  {
                    minutes_til_arrival_northbound[minutes_til_arrival_northbound.length] = info.Seconds / 60;
                  }
            }

            }
              // Sort the arrays here (it works)
              
              minutes_til_arrival_southbound.sort(function(a, b){return a-b});
              minutes_til_arrival_northbound.sort(function(a, b){return a-b});
              
              this.title = "Trains to Ashmont/Braintree: </br>" + minutes_til_arrival_southbound[0]
               + " min </br>" + minutes_til_arrival_southbound[1] + " min </br>" + minutes_til_arrival_southbound[2] + " min </br>" +
               "Trains to Alewife: </br>" + minutes_til_arrival_northbound[0] + " min </br>" + minutes_til_arrival_northbound[1] + " min </br>"
               + minutes_til_arrival_northbound[2] + " min </br>";
              //for (var i = 0; i < minutes_til_arrival_southbound.length; i++)
              //{
              // return minutes_til_arrival_southbound + "</br>"
              //}
            }

            infoWindow.setContent(this.title);
            infoWindow.open(map, theActualMarker); 
            }
          
          request.send();

          }); // for add listener










        var marker = new google.maps.Marker({
          position: porter_square,
          icon: iconBase + 'rail.png',
          map: map
        });


        var infoWindow = new google.maps.InfoWindow();

        google.maps.event.addListener(marker, 'click', function () {
       
          var request = new XMLHttpRequest();
           var theActualMarker = this;
          request.open("GET", "https://enigmatic-scrubland-94195.herokuapp.com/redline.json", true);
          // MOAR CODE, Actual parsing 


          request.onreadystatechange = function() {
            if (request.readyState == 4 && request.status == 200) {
            var result = request.responseText;
            mbta_data = JSON.parse(result);
            var minutes_til_arrival_northbound = [ ];
            var minutes_til_arrival_southbound = [ ];
            

            for(var count = 0; count < mbta_data.TripList.Trips.length; count++)
            {
                for(var stops= 0; stops < mbta_data.TripList.Trips[count].Predictions.length; stops++)
                {
                  var info = mbta_data.TripList.Trips[count].Predictions[stops];
                //process here
                  if ( info.StopID == "70065")
                  {
                  minutes_til_arrival_southbound[minutes_til_arrival_southbound.length] = info.Seconds / 60; 
                  }
                  if (info.StopID == "70066")
                  {
                    minutes_til_arrival_northbound[minutes_til_arrival_northbound.length] = info.Seconds / 60;
                  }
            }

            }
              // Sort the arrays here (it works)
              
              minutes_til_arrival_southbound.sort(function(a, b){return a-b});
              minutes_til_arrival_northbound.sort(function(a, b){return a-b});
              
              this.title = "Trains to Ashmont/Braintree: </br>" + minutes_til_arrival_southbound[0]
               + " min </br>" + minutes_til_arrival_southbound[1] + " min </br>" + minutes_til_arrival_southbound[2] + " min </br>" +
               "Trains to Alewife: </br>" + minutes_til_arrival_northbound[0] + " min </br>" + minutes_til_arrival_northbound[1] + " min </br>"
               + minutes_til_arrival_northbound[2] + " min </br>";
              //for (var i = 0; i < minutes_til_arrival_southbound.length; i++)
              //{
              // return minutes_til_arrival_southbound + "</br>"
              //}
            }

            infoWindow.setContent(this.title);
            infoWindow.open(map, theActualMarker); 
            }
          
          request.send();

          }); // for add listener









        var marker = new google.maps.Marker({
          position: harvard_square,
          icon: iconBase + 'rail.png',
          map: map
        });


        var infoWindow = new google.maps.InfoWindow();

        google.maps.event.addListener(marker, 'click', function () {
       
          var request = new XMLHttpRequest();
           var theActualMarker = this;
          request.open("GET", "https://enigmatic-scrubland-94195.herokuapp.com/redline.json", true);
          // MOAR CODE, Actual parsing 


          request.onreadystatechange = function() {
            if (request.readyState == 4 && request.status == 200) {
            var result = request.responseText;
            mbta_data = JSON.parse(result);
            var minutes_til_arrival_northbound = [ ];
            var minutes_til_arrival_southbound = [ ];
            

            for(var count = 0; count < mbta_data.TripList.Trips.length; count++)
            {
                for(var stops= 0; stops < mbta_data.TripList.Trips[count].Predictions.length; stops++)
                {
                  var info = mbta_data.TripList.Trips[count].Predictions[stops];
                //process here
                  if ( info.StopID == "70067")
                  {
                  minutes_til_arrival_southbound[minutes_til_arrival_southbound.length] = info.Seconds / 60; 
                  }
                  if (info.StopID == "70068")
                  {
                    minutes_til_arrival_northbound[minutes_til_arrival_northbound.length] = info.Seconds / 60;
                  }
            }

            }
              // Sort the arrays here (it works)
              
              minutes_til_arrival_southbound.sort(function(a, b){return a-b});
              minutes_til_arrival_northbound.sort(function(a, b){return a-b});
              
              this.title = "Trains to Ashmont/Braintree: </br>" + minutes_til_arrival_southbound[0]
               + " min </br>" + minutes_til_arrival_southbound[1] + " min </br>" + minutes_til_arrival_southbound[2] + " min </br>" +
               "Trains to Alewife: </br>" + minutes_til_arrival_northbound[0] + " min </br>" + minutes_til_arrival_northbound[1] + " min </br>"
               + minutes_til_arrival_northbound[2] + " min </br>";
              //for (var i = 0; i < minutes_til_arrival_southbound.length; i++)
              //{
              // return minutes_til_arrival_southbound + "</br>"
              //}
            }

            infoWindow.setContent(this.title);
            infoWindow.open(map, theActualMarker); 
            }
          
          request.send();

          }); // for add listener












        var marker = new google.maps.Marker({
          position: jfk_umass,
          icon: iconBase + 'rail.png',
          map: map
        });


        var infoWindow = new google.maps.InfoWindow();

        google.maps.event.addListener(marker, 'click', function () {
       
          var request = new XMLHttpRequest();
           var theActualMarker = this;
          request.open("GET", "https://enigmatic-scrubland-94195.herokuapp.com/redline.json", true);
          // MOAR CODE, Actual parsing 


          request.onreadystatechange = function() {
            if (request.readyState == 4 && request.status == 200) {
            var result = request.responseText;
            mbta_data = JSON.parse(result);
            var minutes_til_arrival_northbound = [ ];
            var minutes_til_arrival_southbound = [ ];
            

            for(var count = 0; count < mbta_data.TripList.Trips.length; count++)
            {
                for(var stops= 0; stops < mbta_data.TripList.Trips[count].Predictions.length; stops++)
                {
                  var info = mbta_data.TripList.Trips[count].Predictions[stops];
                //process here
                  if ( info.StopID == "70085")
                  {
                  minutes_til_arrival_southbound[minutes_til_arrival_southbound.length] = info.Seconds / 60; 
                  }
                  if (info.StopID == "70096")
                  {
                    minutes_til_arrival_northbound[minutes_til_arrival_northbound.length] = info.Seconds / 60;
                  }
            }

            }
              // Sort the arrays here (it works)
              
              minutes_til_arrival_southbound.sort(function(a, b){return a-b});
              minutes_til_arrival_northbound.sort(function(a, b){return a-b});
              
              this.title = "Trains to Ashmont/Braintree: </br>" + minutes_til_arrival_southbound[0]
               + " min </br>" + minutes_til_arrival_southbound[1] + " min </br>" + minutes_til_arrival_southbound[2] + " min </br>" +
               "Trains to Alewife: </br>" + minutes_til_arrival_northbound[0] + " min </br>" + minutes_til_arrival_northbound[1] + " min </br>"
               + minutes_til_arrival_northbound[2] + " min </br>";
              //for (var i = 0; i < minutes_til_arrival_southbound.length; i++)
              //{
              // return minutes_til_arrival_southbound + "</br>"
              //}
            }

            infoWindow.setContent(this.title);
            infoWindow.open(map, theActualMarker); 
            }
          
          request.send();

          }); // for add listener













        var marker = new google.maps.Marker({
          position: savin_hill,
          icon: iconBase + 'rail.png',
          map: map
        });



        var infoWindow = new google.maps.InfoWindow();

        google.maps.event.addListener(marker, 'click', function () {
       
          var request = new XMLHttpRequest();
           var theActualMarker = this;
          request.open("GET", "https://enigmatic-scrubland-94195.herokuapp.com/redline.json", true);
          // MOAR CODE, Actual parsing 


          request.onreadystatechange = function() {
            if (request.readyState == 4 && request.status == 200) {
            var result = request.responseText;
            mbta_data = JSON.parse(result);
            var minutes_til_arrival_northbound = [ ];
            var minutes_til_arrival_southbound = [ ];
            

            for(var count = 0; count < mbta_data.TripList.Trips.length; count++)
            {
                for(var stops= 0; stops < mbta_data.TripList.Trips[count].Predictions.length; stops++)
                {
                  var info = mbta_data.TripList.Trips[count].Predictions[stops];
                //process here
                  if ( info.StopID == "70087")
                  {
                  minutes_til_arrival_southbound[minutes_til_arrival_southbound.length] = info.Seconds / 60; 
                  }
                  if (info.StopID == "70088")
                  {
                    minutes_til_arrival_northbound[minutes_til_arrival_northbound.length] = info.Seconds / 60;
                  }
            }

            }
              // Sort the arrays here (it works)
              
              minutes_til_arrival_southbound.sort(function(a, b){return a-b});
              minutes_til_arrival_northbound.sort(function(a, b){return a-b});
              
              this.title = "Trains to Ashmont/Braintree: </br>" + minutes_til_arrival_southbound[0]
               + " min </br>" + minutes_til_arrival_southbound[1] + " min </br>" + minutes_til_arrival_southbound[2] + " min </br>" +
               "Trains to Alewife: </br>" + minutes_til_arrival_northbound[0] + " min </br>" + minutes_til_arrival_northbound[1] + " min </br>"
               + minutes_til_arrival_northbound[2] + " min </br>";
              //for (var i = 0; i < minutes_til_arrival_southbound.length; i++)
              //{
              // return minutes_til_arrival_southbound + "</br>"
              //}
            }

            infoWindow.setContent(this.title);
            infoWindow.open(map, theActualMarker); 
            }
          
          request.send();

          }); // for add listener












        var marker = new google.maps.Marker({
          position: park_street,
          icon: iconBase + 'rail.png',
          map: map
        });


        var infoWindow = new google.maps.InfoWindow();

        google.maps.event.addListener(marker, 'click', function () {
       
          var request = new XMLHttpRequest();
           var theActualMarker = this;
          request.open("GET", "https://enigmatic-scrubland-94195.herokuapp.com/redline.json", true);
          // MOAR CODE, Actual parsing 


          request.onreadystatechange = function() {
            if (request.readyState == 4 && request.status == 200) {
            var result = request.responseText;
            mbta_data = JSON.parse(result);
            var minutes_til_arrival_northbound = [ ];
            var minutes_til_arrival_southbound = [ ];
            

            for(var count = 0; count < mbta_data.TripList.Trips.length; count++)
            {
                for(var stops= 0; stops < mbta_data.TripList.Trips[count].Predictions.length; stops++)
                {
                  var info = mbta_data.TripList.Trips[count].Predictions[stops];
                //process here
                  if ( info.StopID == "70075")
                  {
                  minutes_til_arrival_southbound[minutes_til_arrival_southbound.length] = info.Seconds / 60; 
                  }
                  if (info.StopID == "70076")
                  {
                    minutes_til_arrival_northbound[minutes_til_arrival_northbound.length] = info.Seconds / 60;
                  }
            }

            }
              // Sort the arrays here (it works)
              
              minutes_til_arrival_southbound.sort(function(a, b){return a-b});
              minutes_til_arrival_northbound.sort(function(a, b){return a-b});
              
              this.title = "Trains to Ashmont/Braintree: </br>" + minutes_til_arrival_southbound[0]
               + " min </br>" + minutes_til_arrival_southbound[1] + " min </br>" + minutes_til_arrival_southbound[2] + " min </br>" +
               "Trains to Alewife: </br>" + minutes_til_arrival_northbound[0] + " min </br>" + minutes_til_arrival_northbound[1] + " min </br>"
               + minutes_til_arrival_northbound[2] + " min </br>";
              //for (var i = 0; i < minutes_til_arrival_southbound.length; i++)
              //{
              // return minutes_til_arrival_southbound + "</br>"
              //}
            }

            infoWindow.setContent(this.title);
            infoWindow.open(map, theActualMarker); 
            }
          
          request.send();

          }); // for add listener















        var marker = new google.maps.Marker({
          position: broadway,
          icon: iconBase + 'rail.png',
          map: map
        });


        var infoWindow = new google.maps.InfoWindow();

        google.maps.event.addListener(marker, 'click', function () {
       
          var request = new XMLHttpRequest();
           var theActualMarker = this;
          request.open("GET", "https://enigmatic-scrubland-94195.herokuapp.com/redline.json", true);
          // MOAR CODE, Actual parsing 


          request.onreadystatechange = function() {
            if (request.readyState == 4 && request.status == 200) {
            var result = request.responseText;
            mbta_data = JSON.parse(result);
            var minutes_til_arrival_northbound = [ ];
            var minutes_til_arrival_southbound = [ ];
            

            for(var count = 0; count < mbta_data.TripList.Trips.length; count++)
            {
                for(var stops= 0; stops < mbta_data.TripList.Trips[count].Predictions.length; stops++)
                {
                  var info = mbta_data.TripList.Trips[count].Predictions[stops];
                //process here
                  if ( info.StopID == "70081")
                  {
                  minutes_til_arrival_southbound[minutes_til_arrival_southbound.length] = info.Seconds / 60; 
                  }
                  if (info.StopID == "70082")
                  {
                    minutes_til_arrival_northbound[minutes_til_arrival_northbound.length] = info.Seconds / 60;
                  }
            }

            }
              // Sort the arrays here (it works)
              
              minutes_til_arrival_southbound.sort(function(a, b){return a-b});
              minutes_til_arrival_northbound.sort(function(a, b){return a-b});
              
              this.title = "Trains to Ashmont/Braintree: </br>" + minutes_til_arrival_southbound[0]
               + " min </br>" + minutes_til_arrival_southbound[1] + " min </br>" + minutes_til_arrival_southbound[2] + " min </br>" +
               "Trains to Alewife: </br>" + minutes_til_arrival_northbound[0] + " min </br>" + minutes_til_arrival_northbound[1] + " min </br>"
               + minutes_til_arrival_northbound[2] + " min </br>";
              //for (var i = 0; i < minutes_til_arrival_southbound.length; i++)
              //{
              // return minutes_til_arrival_southbound + "</br>"
              //}
            }

            infoWindow.setContent(this.title);
            infoWindow.open(map, theActualMarker); 
            }
          
          request.send();

          }); // for add listener












        var marker = new google.maps.Marker({
          position: north_quincy,
          icon: iconBase + 'rail.png',
          map: map
        });


        var infoWindow = new google.maps.InfoWindow();

        google.maps.event.addListener(marker, 'click', function () {
       
          var request = new XMLHttpRequest();
           var theActualMarker = this;
          request.open("GET", "https://enigmatic-scrubland-94195.herokuapp.com/redline.json", true);
          // MOAR CODE, Actual parsing 


          request.onreadystatechange = function() {
            if (request.readyState == 4 && request.status == 200) {
            var result = request.responseText;
            mbta_data = JSON.parse(result);
            var minutes_til_arrival_northbound = [ ];
            var minutes_til_arrival_southbound = [ ];
            

            for(var count = 0; count < mbta_data.TripList.Trips.length; count++)
            {
                for(var stops= 0; stops < mbta_data.TripList.Trips[count].Predictions.length; stops++)
                {
                  var info = mbta_data.TripList.Trips[count].Predictions[stops];
                //process here
                  if ( info.StopID == "70097")
                  {
                  minutes_til_arrival_southbound[minutes_til_arrival_southbound.length] = info.Seconds / 60; 
                  }
                  if (info.StopID == "70098")
                  {
                    minutes_til_arrival_northbound[minutes_til_arrival_northbound.length] = info.Seconds / 60;
                  }
            }

            }
              // Sort the arrays here (it works)
              
              minutes_til_arrival_southbound.sort(function(a, b){return a-b});
              minutes_til_arrival_northbound.sort(function(a, b){return a-b});
              
              this.title = "Trains to Ashmont/Braintree: </br>" + minutes_til_arrival_southbound[0]
               + " min </br>" + minutes_til_arrival_southbound[1] + " min </br>" + minutes_til_arrival_southbound[2] + " min </br>" +
               "Trains to Alewife: </br>" + minutes_til_arrival_northbound[0] + " min </br>" + minutes_til_arrival_northbound[1] + " min </br>"
               + minutes_til_arrival_northbound[2] + " min </br>";
              //for (var i = 0; i < minutes_til_arrival_southbound.length; i++)
              //{
              // return minutes_til_arrival_southbound + "</br>"
              //}
            }

            infoWindow.setContent(this.title);
            infoWindow.open(map, theActualMarker); 
            }
          
          request.send();

          }); // for add listener






        var marker = new google.maps.Marker({
          position: shawmut,
          icon: iconBase + 'rail.png',
          map: map
        });


        var infoWindow = new google.maps.InfoWindow();

        google.maps.event.addListener(marker, 'click', function () {
       
          var request = new XMLHttpRequest();
           var theActualMarker = this;
          request.open("GET", "https://enigmatic-scrubland-94195.herokuapp.com/redline.json", true);
          // MOAR CODE, Actual parsing 


          request.onreadystatechange = function() {
            if (request.readyState == 4 && request.status == 200) {
            var result = request.responseText;
            mbta_data = JSON.parse(result);
            var minutes_til_arrival_northbound = [ ];
            var minutes_til_arrival_southbound = [ ];
            

            for(var count = 0; count < mbta_data.TripList.Trips.length; count++)
            {
                for(var stops= 0; stops < mbta_data.TripList.Trips[count].Predictions.length; stops++)
                {
                  var info = mbta_data.TripList.Trips[count].Predictions[stops];
                //process here
                  if ( info.StopID == "70091")
                  {
                  minutes_til_arrival_southbound[minutes_til_arrival_southbound.length] = info.Seconds / 60; 
                  }
                  if (info.StopID == "70092")
                  {
                    minutes_til_arrival_northbound[minutes_til_arrival_northbound.length] = info.Seconds / 60;
                  }
            }

            }
              // Sort the arrays here (it works)
              
              minutes_til_arrival_southbound.sort(function(a, b){return a-b});
              minutes_til_arrival_northbound.sort(function(a, b){return a-b});
              
              this.title = "Trains to Ashmont/Braintree: </br>" + minutes_til_arrival_southbound[0]
               + " min </br>" + minutes_til_arrival_southbound[1] + " min </br>" + minutes_til_arrival_southbound[2] + " min </br>" +
               "Trains to Alewife: </br>" + minutes_til_arrival_northbound[0] + " min </br>" + minutes_til_arrival_northbound[1] + " min </br>"
               + minutes_til_arrival_northbound[2] + " min </br>";
              //for (var i = 0; i < minutes_til_arrival_southbound.length; i++)
              //{
              // return minutes_til_arrival_southbound + "</br>"
              //}
            }

            infoWindow.setContent(this.title);
            infoWindow.open(map, theActualMarker); 
            }
          
          request.send();

          }); // for add listener










        var marker = new google.maps.Marker({
          position: davis,
          icon: iconBase + 'rail.png',
          map: map
        });


        var infoWindow = new google.maps.InfoWindow();

        google.maps.event.addListener(marker, 'click', function () {
       
          var request = new XMLHttpRequest();
           var theActualMarker = this;
          request.open("GET", "https://enigmatic-scrubland-94195.herokuapp.com/redline.json", true);
          // MOAR CODE, Actual parsing 


          request.onreadystatechange = function() {
            if (request.readyState == 4 && request.status == 200) {
            var result = request.responseText;
            mbta_data = JSON.parse(result);
            var minutes_til_arrival_northbound = [ ];
            var minutes_til_arrival_southbound = [ ];
            

            for(var count = 0; count < mbta_data.TripList.Trips.length; count++)
            {
                for(var stops= 0; stops < mbta_data.TripList.Trips[count].Predictions.length; stops++)
                {
                  var info = mbta_data.TripList.Trips[count].Predictions[stops];
                //process here
                  if ( info.StopID == "70063")
                  {
                  minutes_til_arrival_southbound[minutes_til_arrival_southbound.length] = info.Seconds / 60; 
                  }
                  if (info.StopID == "70064")
                  {
                    minutes_til_arrival_northbound[minutes_til_arrival_northbound.length] = info.Seconds / 60;
                  }
            }

            }
              // Sort the arrays here (it works)
              
              minutes_til_arrival_southbound.sort(function(a, b){return a-b});
              minutes_til_arrival_northbound.sort(function(a, b){return a-b});
              
              this.title = "Trains to Ashmont/Braintree: </br>" + minutes_til_arrival_southbound[0]
               + " min </br>" + minutes_til_arrival_southbound[1] + " min </br>" + minutes_til_arrival_southbound[2] + " min </br>" +
               "Trains to Alewife: </br>" + minutes_til_arrival_northbound[0] + " min </br>" + minutes_til_arrival_northbound[1] + " min </br>"
               + minutes_til_arrival_northbound[2] + " min </br>";
              //for (var i = 0; i < minutes_til_arrival_southbound.length; i++)
              //{
              // return minutes_til_arrival_southbound + "</br>"
              //}
            }

            infoWindow.setContent(this.title);
            infoWindow.open(map, theActualMarker); 
            }
          
          request.send();

          }); // for add listener










        var marker = new google.maps.Marker({
          position: alewife,
          icon: iconBase + 'rail.png',
          map: map
        });


        var infoWindow = new google.maps.InfoWindow();

        google.maps.event.addListener(marker, 'click', function () {
       
          var request = new XMLHttpRequest();
           var theActualMarker = this;
          request.open("GET", "https://enigmatic-scrubland-94195.herokuapp.com/redline.json", true);
          // MOAR CODE, Actual parsing 


          request.onreadystatechange = function() {
            if (request.readyState == 4 && request.status == 200) {
            var result = request.responseText;
            mbta_data = JSON.parse(result);
            var minutes_til_arrival_northbound = [ ];
            var minutes_til_arrival_southbound = [ ];
            

            for(var count = 0; count < mbta_data.TripList.Trips.length; count++)
            {
                for(var stops= 0; stops < mbta_data.TripList.Trips[count].Predictions.length; stops++)
                {
                  var info = mbta_data.TripList.Trips[count].Predictions[stops];
                //process here
                  if ( info.StopID == "70061")
                  {
                  minutes_til_arrival_southbound[minutes_til_arrival_southbound.length] = info.Seconds / 60; 
                  }
                  if (info.StopID == "70068")
                  {
                    minutes_til_arrival_northbound[minutes_til_arrival_northbound.length] = info.Seconds / 60;
                  }
            }

            }
              // Sort the arrays here (it works)
              
              minutes_til_arrival_southbound.sort(function(a, b){return a-b});
              minutes_til_arrival_northbound.sort(function(a, b){return a-b});
              
              this.title = "Trains to Ashmont/Braintree: </br>" + minutes_til_arrival_southbound[0]
               + " min </br>" + minutes_til_arrival_southbound[1] + " min </br>" + minutes_til_arrival_southbound[2] + " min </br>";
              //for (var i = 0; i < minutes_til_arrival_southbound.length; i++)
              //{
              // return minutes_til_arrival_southbound + "</br>"
              //}
            }

            infoWindow.setContent(this.title);
            infoWindow.open(map, theActualMarker); 
            }
          
          request.send();

          }); // for add listener







        var marker = new google.maps.Marker({
          position: kendall_mit,
          icon: iconBase + 'rail.png',
          map: map
        });


        var infoWindow = new google.maps.InfoWindow();

        google.maps.event.addListener(marker, 'click', function () {
       
          var request = new XMLHttpRequest();
           var theActualMarker = this;
          request.open("GET", "https://enigmatic-scrubland-94195.herokuapp.com/redline.json", true);
          // MOAR CODE, Actual parsing 


          request.onreadystatechange = function() {
            if (request.readyState == 4 && request.status == 200) {
            var result = request.responseText;
            mbta_data = JSON.parse(result);
            var minutes_til_arrival_northbound = [ ];
            var minutes_til_arrival_southbound = [ ];
            

            for(var count = 0; count < mbta_data.TripList.Trips.length; count++)
            {
                for(var stops= 0; stops < mbta_data.TripList.Trips[count].Predictions.length; stops++)
                {
                  var info = mbta_data.TripList.Trips[count].Predictions[stops];
                //process here
                  if ( info.StopID == "70071")
                  {
                  minutes_til_arrival_southbound[minutes_til_arrival_southbound.length] = info.Seconds / 60; 
                  }
                  if (info.StopID == "70072")
                  {
                    minutes_til_arrival_northbound[minutes_til_arrival_northbound.length] = info.Seconds / 60;
                  }
            }

            }
              // Sort the arrays here (it works)
              
              minutes_til_arrival_southbound.sort(function(a, b){return a-b});
              minutes_til_arrival_northbound.sort(function(a, b){return a-b});
              
              this.title = "Trains to Ashmont/Braintree: </br>" + minutes_til_arrival_southbound[0]
               + " min </br>" + minutes_til_arrival_southbound[1] + " min </br>" + minutes_til_arrival_southbound[2] + " min </br>" +
               "Trains to Alewife: </br>" + minutes_til_arrival_northbound[0] + " min </br>" + minutes_til_arrival_northbound[1] + " min </br>"
               + minutes_til_arrival_northbound[2] + " min </br>";
              //for (var i = 0; i < minutes_til_arrival_southbound.length; i++)
              //{
              // return minutes_til_arrival_southbound + "</br>"
              //}
            }

            infoWindow.setContent(this.title);
            infoWindow.open(map, theActualMarker); 
            }
          
          request.send();

          }); // for add listener





        var marker = new google.maps.Marker({
          position: charles_mgh,
          icon: iconBase + 'rail.png',
          map: map
        });


        var infoWindow = new google.maps.InfoWindow();

        google.maps.event.addListener(marker, 'click', function () {
       
          var request = new XMLHttpRequest();
           var theActualMarker = this;
          request.open("GET", "https://enigmatic-scrubland-94195.herokuapp.com/redline.json", true);
          // MOAR CODE, Actual parsing 


          request.onreadystatechange = function() {
            if (request.readyState == 4 && request.status == 200) {
            var result = request.responseText;
            mbta_data = JSON.parse(result);
            var minutes_til_arrival_northbound = [ ];
            var minutes_til_arrival_southbound = [ ];
            

            for(var count = 0; count < mbta_data.TripList.Trips.length; count++)
            {
                for(var stops= 0; stops < mbta_data.TripList.Trips[count].Predictions.length; stops++)
                {
                  var info = mbta_data.TripList.Trips[count].Predictions[stops];
                //process here
                  if ( info.StopID == "70073")
                  {
                  minutes_til_arrival_southbound[minutes_til_arrival_southbound.length] = info.Seconds / 60; 
                  }
                  if (info.StopID == "70074")
                  {
                    minutes_til_arrival_northbound[minutes_til_arrival_northbound.length] = info.Seconds / 60;
                  }
            }

            }
              // Sort the arrays here (it works)
              
              minutes_til_arrival_southbound.sort(function(a, b){return a-b});
              minutes_til_arrival_northbound.sort(function(a, b){return a-b});
              
              this.title = "Trains to Ashmont/Braintree: </br>" + minutes_til_arrival_southbound[0]
               + " min </br>" + minutes_til_arrival_southbound[1] + " min </br>" + minutes_til_arrival_southbound[2] + " min </br>" +
               "Trains to Alewife: </br>" + minutes_til_arrival_northbound[0] + " min </br>" + minutes_til_arrival_northbound[1] + " min </br>"
               + minutes_til_arrival_northbound[2] + " min </br>";
              //for (var i = 0; i < minutes_til_arrival_southbound.length; i++)
              //{
              // return minutes_til_arrival_southbound + "</br>"
              //}
            }

            infoWindow.setContent(this.title);
            infoWindow.open(map, theActualMarker); 
            }
          
          request.send();

          }); // for add listener








        var marker = new google.maps.Marker({
          position: downtown_crossing,
          icon: iconBase + 'rail.png',
          map: map
        });


        var infoWindow = new google.maps.InfoWindow();

        google.maps.event.addListener(marker, 'click', function () {
       
          var request = new XMLHttpRequest();
           var theActualMarker = this;
          request.open("GET", "https://enigmatic-scrubland-94195.herokuapp.com/redline.json", true);
          // MOAR CODE, Actual parsing 


          request.onreadystatechange = function() {
            if (request.readyState == 4 && request.status == 200) {
            var result = request.responseText;
            mbta_data = JSON.parse(result);
            var minutes_til_arrival_northbound = [ ];
            var minutes_til_arrival_southbound = [ ];
            

            for(var count = 0; count < mbta_data.TripList.Trips.length; count++)
            {
                for(var stops= 0; stops < mbta_data.TripList.Trips[count].Predictions.length; stops++)
                {
                  var info = mbta_data.TripList.Trips[count].Predictions[stops];
                //process here
                  if ( info.StopID == "70077")
                  {
                  minutes_til_arrival_southbound[minutes_til_arrival_southbound.length] = info.Seconds / 60; 
                  }
                  if (info.StopID == "70078")
                  {
                    minutes_til_arrival_northbound[minutes_til_arrival_northbound.length] = info.Seconds / 60;
                  }
            }

            }
              // Sort the arrays here (it works)
              
              minutes_til_arrival_southbound.sort(function(a, b){return a-b});
              minutes_til_arrival_northbound.sort(function(a, b){return a-b});
              
              this.title = "Trains to Ashmont/Braintree: </br>" + minutes_til_arrival_southbound[0]
               + " min </br>" + minutes_til_arrival_southbound[1] + " min </br>" + minutes_til_arrival_southbound[2] + " min </br>" +
               "Trains to Alewife: </br>" + minutes_til_arrival_northbound[0] + " min </br>" + minutes_til_arrival_northbound[1] + " min </br>"
               + minutes_til_arrival_northbound[2] + " min </br>";
              //for (var i = 0; i < minutes_til_arrival_southbound.length; i++)
              //{
              // return minutes_til_arrival_southbound + "</br>"
              //}
            }

            infoWindow.setContent(this.title);
            infoWindow.open(map, theActualMarker); 
            }
          
          request.send();

          }); // for add listener










        var marker = new google.maps.Marker({
          position: quincy_center,
          icon: iconBase + 'rail.png',
          map: map
        });



        var infoWindow = new google.maps.InfoWindow();

        google.maps.event.addListener(marker, 'click', function () {
       
          var request = new XMLHttpRequest();
           var theActualMarker = this;
          request.open("GET", "https://enigmatic-scrubland-94195.herokuapp.com/redline.json", true);
          // MOAR CODE, Actual parsing 


          request.onreadystatechange = function() {
            if (request.readyState == 4 && request.status == 200) {
            var result = request.responseText;
            mbta_data = JSON.parse(result);
            var minutes_til_arrival_northbound = [ ];
            var minutes_til_arrival_southbound = [ ];
            

            for(var count = 0; count < mbta_data.TripList.Trips.length; count++)
            {
                for(var stops= 0; stops < mbta_data.TripList.Trips[count].Predictions.length; stops++)
                {
                  var info = mbta_data.TripList.Trips[count].Predictions[stops];
                //process here
                  if ( info.StopID == "70101")
                  {
                  minutes_til_arrival_southbound[minutes_til_arrival_southbound.length] = info.Seconds / 60; 
                  }
                  if (info.StopID == "70102")
                  {
                    minutes_til_arrival_northbound[minutes_til_arrival_northbound.length] = info.Seconds / 60;
                  }
            }

            }
              // Sort the arrays here (it works)
              
              minutes_til_arrival_southbound.sort(function(a, b){return a-b});
              minutes_til_arrival_northbound.sort(function(a, b){return a-b});
              
              this.title = "Trains to Ashmont/Braintree: </br>" + minutes_til_arrival_southbound[0]
               + " min </br>" + minutes_til_arrival_southbound[1] + " min </br>" + minutes_til_arrival_southbound[2] + " min </br>" +
               "Trains to Alewife: </br>" + minutes_til_arrival_northbound[0] + " min </br>" + minutes_til_arrival_northbound[1] + " min </br>"
               + minutes_til_arrival_northbound[2] + " min </br>";
              //for (var i = 0; i < minutes_til_arrival_southbound.length; i++)
              //{
              // return minutes_til_arrival_southbound + "</br>"
              //}
            }

            infoWindow.setContent(this.title);
            infoWindow.open(map, theActualMarker); 
            }
          
          request.send();

          }); // for add listener












        var marker = new google.maps.Marker({
          position: quincy_adams,
          icon: iconBase + 'rail.png',
          map: map
        });


        var infoWindow = new google.maps.InfoWindow();

        google.maps.event.addListener(marker, 'click', function () {
       
          var request = new XMLHttpRequest();
           var theActualMarker = this;
          request.open("GET", "https://enigmatic-scrubland-94195.herokuapp.com/redline.json", true);
          // MOAR CODE, Actual parsing 


          request.onreadystatechange = function() {
            if (request.readyState == 4 && request.status == 200) {
            var result = request.responseText;
            mbta_data = JSON.parse(result);
            var minutes_til_arrival_northbound = [ ];
            var minutes_til_arrival_southbound = [ ];
            

            for(var count = 0; count < mbta_data.TripList.Trips.length; count++)
            {
                for(var stops= 0; stops < mbta_data.TripList.Trips[count].Predictions.length; stops++)
                {
                  var info = mbta_data.TripList.Trips[count].Predictions[stops];
                //process here
                  if ( info.StopID == "70103")
                  {
                  minutes_til_arrival_southbound[minutes_til_arrival_southbound.length] = info.Seconds / 60; 
                  }
                  if (info.StopID == "70104")
                  {
                    minutes_til_arrival_northbound[minutes_til_arrival_northbound.length] = info.Seconds / 60;
                  }
            }

            }
              // Sort the arrays here (it works)
              
              minutes_til_arrival_southbound.sort(function(a, b){return a-b});
              minutes_til_arrival_northbound.sort(function(a, b){return a-b});
              
              this.title = "Trains to Ashmont/Braintree: </br>" + minutes_til_arrival_southbound[0]
               + " min </br>" + minutes_til_arrival_southbound[1] + " min </br>" + minutes_til_arrival_southbound[2] + " min </br>" +
               "Trains to Alewife: </br>" + minutes_til_arrival_northbound[0] + " min </br>" + minutes_til_arrival_northbound[1] + " min </br>"
               + minutes_til_arrival_northbound[2] + " min </br>";
              //for (var i = 0; i < minutes_til_arrival_southbound.length; i++)
              //{
              // return minutes_til_arrival_southbound + "</br>"
              //}
            }

            infoWindow.setContent(this.title);
            infoWindow.open(map, theActualMarker); 
            }
          
          request.send();

          }); // for add listener










        var marker = new google.maps.Marker({
          position: ashmont,
          icon: iconBase + 'rail.png',
          map: map
        });


        var infoWindow = new google.maps.InfoWindow();

        google.maps.event.addListener(marker, 'click', function () {
       
          var request = new XMLHttpRequest();
           var theActualMarker = this;
          request.open("GET", "https://enigmatic-scrubland-94195.herokuapp.com/redline.json", true);
          // MOAR CODE, Actual parsing 


          request.onreadystatechange = function() {
            if (request.readyState == 4 && request.status == 200) {
            var result = request.responseText;
            mbta_data = JSON.parse(result);
            var minutes_til_arrival_northbound = [ ];
            var minutes_til_arrival_southbound = [ ];
            

            for(var count = 0; count < mbta_data.TripList.Trips.length; count++)
            {
                for(var stops= 0; stops < mbta_data.TripList.Trips[count].Predictions.length; stops++)
                {
                  var info = mbta_data.TripList.Trips[count].Predictions[stops];
                //process here
                  
                  if (info.StopID == "70094")
                  {
                    minutes_til_arrival_northbound[minutes_til_arrival_northbound.length] = info.Seconds / 60;
                  }
            }

            }
              // Sort the arrays here (it works)
              
              minutes_til_arrival_southbound.sort(function(a, b){return a-b});
              minutes_til_arrival_northbound.sort(function(a, b){return a-b});
              
              this.title = "Trains to Alewife: </br>" + minutes_til_arrival_northbound[0] + " min </br>" + minutes_til_arrival_northbound[1] + " min </br>"
               + minutes_til_arrival_northbound[2] + " min </br>";
              //for (var i = 0; i < minutes_til_arrival_southbound.length; i++)
              //{
              // return minutes_til_arrival_southbound + "</br>"
              //}
            }

            infoWindow.setContent(this.title);
            infoWindow.open(map, theActualMarker); 
            }
          
          request.send();

          }); // for add listener







        var marker = new google.maps.Marker({
          position: wollaston,
          icon: iconBase + 'rail.png',
          map: map
        });


        var infoWindow = new google.maps.InfoWindow();

        google.maps.event.addListener(marker, 'click', function () {
       
          var request = new XMLHttpRequest();
           var theActualMarker = this;
          request.open("GET", "https://enigmatic-scrubland-94195.herokuapp.com/redline.json", true);
          // MOAR CODE, Actual parsing 


          request.onreadystatechange = function() {
            if (request.readyState == 4 && request.status == 200) {
            var result = request.responseText;
            mbta_data = JSON.parse(result);
            var minutes_til_arrival_northbound = [ ];
            var minutes_til_arrival_southbound = [ ];
            

            for(var count = 0; count < mbta_data.TripList.Trips.length; count++)
            {
                for(var stops= 0; stops < mbta_data.TripList.Trips[count].Predictions.length; stops++)
                {
                  var info = mbta_data.TripList.Trips[count].Predictions[stops];
                //process here
                  if ( info.StopID == "70099")
                  {
                  minutes_til_arrival_southbound[minutes_til_arrival_southbound.length] = info.Seconds / 60; 
                  }
                  if (info.StopID == "70100")
                  {
                    minutes_til_arrival_northbound[minutes_til_arrival_northbound.length] = info.Seconds / 60;
                  }
            }

            }
              // Sort the arrays here (it works)
              
              minutes_til_arrival_southbound.sort(function(a, b){return a-b});
              minutes_til_arrival_northbound.sort(function(a, b){return a-b});
              
              this.title = "Trains to Ashmont/Braintree: </br>" + minutes_til_arrival_southbound[0]
               + " min </br>" + minutes_til_arrival_southbound[1] + " min </br>" + minutes_til_arrival_southbound[2] + " min </br>" +
               "Trains to Alewife: </br>" + minutes_til_arrival_northbound[0] + " min </br>" + minutes_til_arrival_northbound[1] + " min </br>"
               + minutes_til_arrival_northbound[2] + " min </br>";
              //for (var i = 0; i < minutes_til_arrival_southbound.length; i++)
              //{
              // return minutes_til_arrival_southbound + "</br>"
              //}
            }

            infoWindow.setContent(this.title);
            infoWindow.open(map, theActualMarker); 
            }
          
          request.send();

          }); // for add listener









        var marker = new google.maps.Marker({
          position: fields_corner,
          icon: iconBase + 'rail.png',
          map: map

        });


        var infoWindow = new google.maps.InfoWindow();

        google.maps.event.addListener(marker, 'click', function () {
       
          var request = new XMLHttpRequest();
           var theActualMarker = this;
          request.open("GET", "https://enigmatic-scrubland-94195.herokuapp.com/redline.json", true);
          // MOAR CODE, Actual parsing 


          request.onreadystatechange = function() {
            if (request.readyState == 4 && request.status == 200) {
            var result = request.responseText;
            mbta_data = JSON.parse(result);
            var minutes_til_arrival_northbound = [ ];
            var minutes_til_arrival_southbound = [ ];
            

            for(var count = 0; count < mbta_data.TripList.Trips.length; count++)
            {
                for(var stops= 0; stops < mbta_data.TripList.Trips[count].Predictions.length; stops++)
                {
                  var info = mbta_data.TripList.Trips[count].Predictions[stops];
                //process here
                  if ( info.StopID == "70089")
                  {
                  minutes_til_arrival_southbound[minutes_til_arrival_southbound.length] = info.Seconds / 60; 
                  }
                  if (info.StopID == "70090")
                  {
                    minutes_til_arrival_northbound[minutes_til_arrival_northbound.length] = info.Seconds / 60;
                  }
            }

            }
              // Sort the arrays here (it works)
              
              minutes_til_arrival_southbound.sort(function(a, b){return a-b});
              minutes_til_arrival_northbound.sort(function(a, b){return a-b});
              
              this.title = "Trains to Ashmont/Braintree: </br>" + minutes_til_arrival_southbound[0]
               + " min </br>" + minutes_til_arrival_southbound[1] + " min </br>" + minutes_til_arrival_southbound[2] + " min </br>" +
               "Trains to Alewife: </br>" + minutes_til_arrival_northbound[0] + " min </br>" + minutes_til_arrival_northbound[1] + " min </br>"
               + minutes_til_arrival_northbound[2] + " min </br>";
              //for (var i = 0; i < minutes_til_arrival_southbound.length; i++)
              //{
              // return minutes_til_arrival_southbound + "</br>"
              //}
            }

            infoWindow.setContent(this.title);
            infoWindow.open(map, theActualMarker); 
            }
          
          request.send();

          }); // for add listener






        var marker = new google.maps.Marker({
          position: central_square,
          icon: iconBase + 'rail.png',
          map: map

        });


        var infoWindow = new google.maps.InfoWindow();

        google.maps.event.addListener(marker, 'click', function () {
       
          var request = new XMLHttpRequest();
           var theActualMarker = this;
          request.open("GET", "https://enigmatic-scrubland-94195.herokuapp.com/redline.json", true);
          // MOAR CODE, Actual parsing 


          request.onreadystatechange = function() {
            if (request.readyState == 4 && request.status == 200) {
            var result = request.responseText;
            mbta_data = JSON.parse(result);
            var minutes_til_arrival_northbound = [ ];
            var minutes_til_arrival_southbound = [ ];
            

            for(var count = 0; count < mbta_data.TripList.Trips.length; count++)
            {
                for(var stops= 0; stops < mbta_data.TripList.Trips[count].Predictions.length; stops++)
                {
                  var info = mbta_data.TripList.Trips[count].Predictions[stops];
                //process here
                  if ( info.StopID == "70069")
                  {
                  minutes_til_arrival_southbound[minutes_til_arrival_southbound.length] = info.Seconds / 60; 
                  }
                  if (info.StopID == "70070")
                  {
                    minutes_til_arrival_northbound[minutes_til_arrival_northbound.length] = info.Seconds / 60;
                  }
            }

            }
              // Sort the arrays here (it works)
              
              minutes_til_arrival_southbound.sort(function(a, b){return a-b});
              minutes_til_arrival_northbound.sort(function(a, b){return a-b});
              
              this.title = "Trains to Ashmont/Braintree: </br>" + minutes_til_arrival_southbound[0]
               + " min </br>" + minutes_til_arrival_southbound[1] + " min </br>" + minutes_til_arrival_southbound[2] + " min </br>" +
               "Trains to Alewife: </br>" + minutes_til_arrival_northbound[0] + " min </br>" + minutes_til_arrival_northbound[1] + " min </br>"
               + minutes_til_arrival_northbound[2] + " min </br>";
              //for (var i = 0; i < minutes_til_arrival_southbound.length; i++)
              //{
              // return minutes_til_arrival_southbound + "</br>"
              //}
            }

            infoWindow.setContent(this.title);
            infoWindow.open(map, theActualMarker); 
            }
          
          request.send();

          }); // for add listener








        var marker = new google.maps.Marker({
          position: braintree,
          icon: iconBase + 'rail.png',
          map: map,
          title: "Trains towards Ashmont: "
        });


        var infoWindow = new google.maps.InfoWindow();

        google.maps.event.addListener(marker, 'click', function () {
       
          var request = new XMLHttpRequest();
           var theActualMarker = this;
          request.open("GET", "https://enigmatic-scrubland-94195.herokuapp.com/redline.json", true);
          // MOAR CODE, Actual parsing 


          request.onreadystatechange = function() {
            if (request.readyState == 4 && request.status == 200) {
            var result = request.responseText;
            mbta_data = JSON.parse(result);
            var minutes_til_arrival_northbound = [ ];
            var minutes_til_arrival_southbound = [ ];
            

            for(var count = 0; count < mbta_data.TripList.Trips.length; count++)
            {
                for(var stops= 0; stops < mbta_data.TripList.Trips[count].Predictions.length; stops++)
                {
                  var info = mbta_data.TripList.Trips[count].Predictions[stops];
                //process here
                  
                  if (info.StopID == "70105")
                  {
                    minutes_til_arrival_northbound[minutes_til_arrival_northbound.length] = info.Seconds / 60;
                  }
            }

            }
              // Sort the arrays here (it works)
              
              minutes_til_arrival_southbound.sort(function(a, b){return a-b});
              minutes_til_arrival_northbound.sort(function(a, b){return a-b});
              
              this.title = "Trains to Alewife: </br>" + minutes_til_arrival_northbound[0] + " min </br>" + minutes_til_arrival_northbound[1] + " min </br>"
               + minutes_til_arrival_northbound[2] + " min </br>";
              //for (var i = 0; i < minutes_til_arrival_southbound.length; i++)
              //{
              // return minutes_til_arrival_southbound + "</br>"
              //}
            }

            infoWindow.setContent(this.title);
            infoWindow.open(map, theActualMarker); 
            }
          
          request.send();

          }); // for add listener










        // First Line Segment: Alewife -> Davis -> Porter ->
        // harvard -> central -> kendall -> Charles/mgh ->
        // park street -> dt crossing -> south -> broadway ->
        // andrew -> jfk/umass

         var first_segment = [
          {lat: 42.395428, lng: -71.142483},
          {lat: 42.39674, lng: -71.121815},
          {lat: 42.3884, lng: -71.11914899999999},
          {lat: 42.373362, lng: -71.118956},
          {lat: 42.365486, lng: -71.103802},
          {lat: 42.36249079, lng: -71.08617653},
          {lat: 42.361166, lng: -71.070628},
          {lat: 42.35639457, lng: -71.0624242},
          {lat: 42.355518, lng: -71.060225},
          {lat: 42.352271, lng: -71.05524200000001},
          {lat: 42.342622, lng: -71.056967},
          {lat: 42.330154, lng: -71.057655},
          {lat: 42.320685, lng: -71.052391}

        ];
        var alewife_to_jfk = new google.maps.Polyline({
          path: first_segment,
          geodesic: true,
          strokeColor: '#FF0000',
          strokeOpacity: 1.0,
          strokeWeight: 2
        });

        alewife_to_jfk.setMap(map);

        // Second segment
        // Second Line Segment: jfk/umass -> north quincy ->
        // Wollaston -> Quincy Center -> Quincy Adams -> 
        // Braintree
         var second_segment = [
          {lat: 42.320685, lng: -71.052391},
          {lat: 42.275275, lng: -71.029583},
          {lat: 42.2665139, lng: -71.0203369},
          {lat: 42.251809, lng: -71.005409},
          {lat: 42.233391, lng: -71.007153},
          {lat: 42.2078543, lng: -71.0011385}

        ];

        var jfk_to_braintree = new google.maps.Polyline({
          path: second_segment,
          geodesic: true,
          strokeColor: '#FF0000',
          strokeOpacity: 1.0,
          strokeWeight: 2
        });

        jfk_to_braintree.setMap(map);


        // Third Line Segment: jfk/umass -> Savin Hill -> 
        // Fields corner -> Shawmut -> Ashmont

           var third_segment = [
          {lat: 42.320685, lng: -71.052391},
          {lat: 42.31129, lng: -71.053331},
          {lat: 42.300093, lng: -71.061667},
          {lat: 42.29312583, lng: -71.06573796000001},
          {lat: 42.284652, lng: -71.06448899999999}

        ];

        var jfk_to_ashmont = new google.maps.Polyline({
          path: third_segment,
          geodesic: true,
          strokeColor: '#FF0000',
          strokeOpacity: 1.0,
          strokeWeight: 2
        });

        jfk_to_ashmont.setMap(map);



/* Commenting out Orange Line section

        // MBTA Orange Line Map

        // Orange Line Stations and coordinates
        var oak_grove = { lat: 42.4353430165, lng: -71.071189642 };
        var malden_center = { lat: 42.4273133438, lng: -71.073871851 };
        var wellington = { lat: 42.4042955853, lng: -71.0770046711};
        var sullivan_square = { lat: 42.3857548427, lng: -71.0770797729};
        var community_college = { lat: 42.3726383181, lng: -71.0702776909};
        var north = { lat: 42.365512, lng: -71.061423};
        var haymarket = { lat: 42.362498, lng: -71.058996};
        var state = { lat: 42.358897, lng: -71.057795};
        var chinatown = { lat: 42.352228, lng: -71.062892};
        var tufts_medical_center = { lat: 42.349873, lng: -71.063795};
        var back_bay = { lat: 42.3472772215, lng: -71.0760390759};
        var mass_ave_orange = { lat: 42.3415519196, lng: -71.0832166672};
        var ruggles = { lat: 42.3356674788, lng: -71.0905230045};
        var roxbury_crossing = { lat: 42.3315274209, lng: -71.0954046249};
        var jackson_square = { lat: 42.3227388088, lng: -71.1000823975};
        var stony_brook = { lat: 42.3192008078, lng: -71.1028289795};
        var green_street = { lat: 42.3105691548, lng: -71.107313633};
        var forest_hills = { lat: 42.300362, lng: -71.113411};





        // Orange Line Station markers
          var marker = new google.maps.Marker({
          position: oak_grove,
          icon: iconBase + 'rail.png',
          map: map
        });

  		  var marker = new google.maps.Marker({
          position: malden_center,
          icon: iconBase + 'rail.png',
          map: map
        });

  		  var marker = new google.maps.Marker({
          position: wellington,
          icon: iconBase + 'rail.png',
          map: map
        });	


  		  var marker = new google.maps.Marker({
          position: sullivan_square,
          icon: iconBase + 'rail.png',
          map: map
        });  

  		  var marker = new google.maps.Marker({
          position: community_college,
          icon: iconBase + 'rail.png',
          map: map
        }); 

  		  var marker = new google.maps.Marker({
          position: north,
          icon: iconBase + 'rail.png',
          map: map
        }); 

  		  var marker = new google.maps.Marker({
          position: haymarket,
          icon: iconBase + 'rail.png',
          map: map
        });                   		  

  		  var marker = new google.maps.Marker({
          position: state,
          icon: iconBase + 'rail.png',
          map: map
        });                   		  
  		  
  		  var marker = new google.maps.Marker({
          position: downtown_crossing,
          icon: iconBase + 'rail.png',
          map: map
        });                   		  
  		  
  		  var marker = new google.maps.Marker({
          position: chinatown,
          icon: iconBase + 'rail.png',
          map: map
        });                   		  

  		  var marker = new google.maps.Marker({
          position: tufts_medical_center,
          icon: iconBase + 'rail.png',
          map: map
        });                   		  

  		  var marker = new google.maps.Marker({
          position: back_bay,
          icon: iconBase + 'rail.png',
          map: map
        });                   		  

  		  var marker = new google.maps.Marker({
          position: mass_ave_orange,
          icon: iconBase + 'rail.png',
          map: map
        });                   		  

  		  var marker = new google.maps.Marker({
          position: ruggles,
          icon: iconBase + 'rail.png',
          map: map
        });                   		  

  		  var marker = new google.maps.Marker({
          position: roxbury_crossing,
          icon: iconBase + 'rail.png',
          map: map
        });                   		  

  		  var marker = new google.maps.Marker({
          position: jackson_square,
          icon: iconBase + 'rail.png',
          map: map
        });                   		  

  		  var marker = new google.maps.Marker({
          position: stony_brook,
          icon: iconBase + 'rail.png',
          map: map
        });                   		  

  		  var marker = new google.maps.Marker({
          position: green_street,
          icon: iconBase + 'rail.png',
          map: map
        });                   		  

  		  var marker = new google.maps.Marker({
          position: forest_hills,
          icon: iconBase + 'rail.png',
          map: map
        });                   		  

  		// Orange Line Polyline (don't forget dtcrossing)

  		   var orange_line_path = [
           { lat: 42.4353430165, lng: -71.071189642 },
         { lat: 42.4273133438, lng: -71.073871851 },
         { lat: 42.4042955853, lng: -71.0770046711},
         { lat: 42.3857548427, lng: -71.0770797729},
         { lat: 42.3726383181, lng: -71.0702776909},
         { lat: 42.365512, lng: -71.061423},
         { lat: 42.362498, lng: -71.058996},
         { lat: 42.358897, lng: -71.057795},
         { lat: 42.355518, lng: -71.060225},
         { lat: 42.352228, lng: -71.062892},
         { lat: 42.349873, lng: -71.063795},
         { lat: 42.3472772215, lng: -71.0760390759},
         { lat: 42.3415519196, lng: -71.0832166672},
         { lat: 42.3356674788, lng: -71.0905230045},
         { lat: 42.3315274209, lng: -71.0954046249},
         { lat: 42.3227388088, lng: -71.1000823975},
         { lat: 42.3192008078, lng: -71.1028289795},
         { lat: 42.3105691548, lng: -71.107313633},
         { lat: 42.300362, lng: -71.113411}

        ];
        var orange_line = new google.maps.Polyline({
          path: orange_line_path,
          geodesic: true,
          strokeColor: '#FFA500',
          strokeOpacity: 1.0,
          strokeWeight: 2
        });

        orange_line.setMap(map);

*/
// Just commented out Orange Line section

/*
        // MBTA Blue Line
        var wonderland = { lat: 42.414246, lng: -70.992144};
        var revere_beach = { lat: 42.4071633648, lng: -70.992193222};
        var beachmont = { lat: 42.3974187182, lng: -70.992193222};
        var suffolk_downs = { lat: 42.3884015915, lng: -71.0003578663};
        var orient_heights = { lat: 42.386676, lng: -71.006628};
        var wood_island = { lat: 42.380797, lng: -71.023394};
        var airport = { lat: 42.3727334327, lng: -71.035194397};
        var maverick = { lat: 42.36886, lng: -71.039926};
        var aquarium = { lat: 42.359456, lng: -71.05357};
        var government_center = { lat: 42.359297, lng: -71.059895};
        var bowdoin = { lat: 42.361457, lng: -71.062129};


        // MBTA Blue Line markers
  		  var marker = new google.maps.Marker({
          position: wonderland,
          icon: iconBase + 'rail.png',
          map: map
        });

  		  var marker = new google.maps.Marker({
          position: revere_beach,
          icon: iconBase + 'rail.png',
          map: map
        });


  		  var marker = new google.maps.Marker({
          position: beachmont,
          icon: iconBase + 'rail.png',
          map: map
        });


  		  var marker = new google.maps.Marker({
          position: suffolk_downs,
          icon: iconBase + 'rail.png',
          map: map
        });

  		  var marker = new google.maps.Marker({
          position: orient_heights,
          icon: iconBase + 'rail.png',
          map: map
        });

  		  var marker = new google.maps.Marker({
          position: wood_island,
          icon: iconBase + 'rail.png',
          map: map
        });

  		  var marker = new google.maps.Marker({
          position: airport,
          icon: iconBase + 'rail.png',
          map: map
        });

  		  var marker = new google.maps.Marker({
          position: maverick,
          icon: iconBase + 'rail.png',
          map: map
        });

  		  var marker = new google.maps.Marker({
          position: aquarium,
          icon: iconBase + 'rail.png',
          map: map
        });

  		  var marker = new google.maps.Marker({
          position: government_center,
          icon: iconBase + 'rail.png',
          map: map
        });

  		  var marker = new google.maps.Marker({
          position: bowdoin,
          icon: iconBase + 'rail.png',
          map: map,
          title: "BOWDOIN STATION"
        });

        // This is a global info window...
        var infowindow = new google.maps.InfoWindow();
        
        // Open info window on click of marker
        google.maps.event.addListener(marker, 'click', function() {
          infowindow.setContent(marker.title);
          infowindow.open(map, marker);
        });




  		   var blue_line_path = [
         { lat: 42.414246, lng: -70.992144},
         { lat: 42.4071633648, lng: -70.992193222},
         { lat: 42.3974187182, lng: -70.992193222},
         { lat: 42.3884015915, lng: -71.0003578663},
         { lat: 42.386676, lng: -71.006628},
         { lat: 42.380797, lng: -71.023394},
         { lat: 42.3727334327, lng: -71.035194397},
         { lat: 42.36886, lng: -71.039926},
         { lat: 42.359456, lng: -71.05357},
         { lat: 42.358897, lng: -71.057795},
         { lat: 42.359297, lng: -71.059895},
         { lat: 42.361457, lng: -71.062129}



        ];
        var blue_line = new google.maps.Polyline({
          path: blue_line_path,
          geodesic: true,
          strokeColor: '#0000FF',
          strokeOpacity: 1.0,
          strokeWeight: 2
        });

        blue_line.setMap(map);




*/
// Just commented out Blue Line section
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
              

            south_station_distance = google.maps.geometry.spherical.computeDistanceBetween(south_station, my_location) * meters_to_miles_converter;
            andrew_distance = google.maps.geometry.spherical.computeDistanceBetween(andrew, my_location) * meters_to_miles_converter;
            porter_square_distance = google.maps.geometry.spherical.computeDistanceBetween(porter_square, my_location) * meters_to_miles_converter;
            harvard_square_distance = google.maps.geometry.spherical.computeDistanceBetween(harvard_square, my_location) * meters_to_miles_converter;
            jfk_umass_distance = google.maps.geometry.spherical.computeDistanceBetween(jfk_umass, my_location) * meters_to_miles_converter;
            savin_hill_distance = google.maps.geometry.spherical.computeDistanceBetween(savin_hill, my_location) * meters_to_miles_converter;
            park_street_distance = google.maps.geometry.spherical.computeDistanceBetween(park_street, my_location) * meters_to_miles_converter;
            broadway_distance = google.maps.geometry.spherical.computeDistanceBetween(broadway, my_location) * meters_to_miles_converter;
            north_quincy_distance = google.maps.geometry.spherical.computeDistanceBetween(north_quincy, my_location) * meters_to_miles_converter;
            shawmut_distance = google.maps.geometry.spherical.computeDistanceBetween(shawmut, my_location) * meters_to_miles_converter;
            davis_distance = google.maps.geometry.spherical.computeDistanceBetween(davis, my_location) * meters_to_miles_converter;
            alewife_distance = google.maps.geometry.spherical.computeDistanceBetween(alewife, my_location) * meters_to_miles_converter;
            kendall_mit_distance = google.maps.geometry.spherical.computeDistanceBetween(kendall_mit, my_location) * meters_to_miles_converter;
            charles_mgh_distance = google.maps.geometry.spherical.computeDistanceBetween(charles_mgh, my_location) * meters_to_miles_converter;
            downtown_crossing_distance = google.maps.geometry.spherical.computeDistanceBetween(downtown_crossing, my_location) * meters_to_miles_converter;
            quincy_center_distance = google.maps.geometry.spherical.computeDistanceBetween(quincy_center, my_location) * meters_to_miles_converter;
            quincy_adams_distance = google.maps.geometry.spherical.computeDistanceBetween(quincy_adams, my_location) * meters_to_miles_converter;
            ashmont_distance = google.maps.geometry.spherical.computeDistanceBetween(ashmont, my_location) * meters_to_miles_converter;
            wollaston_distance = google.maps.geometry.spherical.computeDistanceBetween(wollaston, my_location) * meters_to_miles_converter;
            fields_corner_distance = google.maps.geometry.spherical.computeDistanceBetween(fields_corner, my_location) * meters_to_miles_converter;
            central_square_distance = google.maps.geometry.spherical.computeDistanceBetween(central_square, my_location) * meters_to_miles_converter;
            braintree_distance = google.maps.geometry.spherical.computeDistanceBetween(braintree, my_location) * meters_to_miles_converter;

            smallest_distance = Math.min(south_station_distance, andrew_distance, porter_square_distance, harvard_square_distance, jfk_umass_distance,
            savin_hill_distance, park_street_distance, broadway_distance, north_quincy_distance, shawmut_distance, davis_distance, alewife_distance, 
            kendall_mit_distance, charles_mgh_distance, downtown_crossing_distance, quincy_center_distance, quincy_adams_distance, ashmont_distance, 
            wollaston_distance, fields_corner_distance, central_square_distance, braintree_distance);
            
            if ( Math.min(south_station_distance, andrew_distance, porter_square_distance, harvard_square_distance, jfk_umass_distance,
            savin_hill_distance, park_street_distance, broadway_distance, north_quincy_distance, shawmut_distance, davis_distance, alewife_distance, 
            kendall_mit_distance, charles_mgh_distance, downtown_crossing_distance, quincy_center_distance, quincy_adams_distance, ashmont_distance, 
            wollaston_distance, fields_corner_distance, central_square_distance, braintree_distance) == south_station_distance )
            {
              closest_station = "South Station";
              closest_station_coords = south_station;
            }
            if ( Math.min(south_station_distance, andrew_distance, porter_square_distance, harvard_square_distance, jfk_umass_distance,
            savin_hill_distance, park_street_distance, broadway_distance, north_quincy_distance, shawmut_distance, davis_distance, alewife_distance, 
            kendall_mit_distance, charles_mgh_distance, downtown_crossing_distance, quincy_center_distance, quincy_adams_distance, ashmont_distance, 
            wollaston_distance, fields_corner_distance, central_square_distance, braintree_distance) == andrew_distance )
            {
              closest_station = "Andrew Station";
              closest_station_coords = andrew;
            }
            if ( Math.min(south_station_distance, andrew_distance, porter_square_distance, harvard_square_distance, jfk_umass_distance,
            savin_hill_distance, park_street_distance, broadway_distance, north_quincy_distance, shawmut_distance, davis_distance, alewife_distance, 
            kendall_mit_distance, charles_mgh_distance, downtown_crossing_distance, quincy_center_distance, quincy_adams_distance, ashmont_distance, 
            wollaston_distance, fields_corner_distance, central_square_distance, braintree_distance) == porter_square_distance )
            {
              closest_station = "Porter Square Station";
              closest_station_coords = porter_square;
            }            

            if ( Math.min(south_station_distance, andrew_distance, porter_square_distance, harvard_square_distance, jfk_umass_distance,
            savin_hill_distance, park_street_distance, broadway_distance, north_quincy_distance, shawmut_distance, davis_distance, alewife_distance, 
            kendall_mit_distance, charles_mgh_distance, downtown_crossing_distance, quincy_center_distance, quincy_adams_distance, ashmont_distance, 
            wollaston_distance, fields_corner_distance, central_square_distance, braintree_distance) == harvard_square_distance )
            {
              closest_station = "Harvard Square Station";
              closest_station_coords = harvard_square;
            }     

            if ( Math.min(south_station_distance, andrew_distance, porter_square_distance, harvard_square_distance, jfk_umass_distance,
            savin_hill_distance, park_street_distance, broadway_distance, north_quincy_distance, shawmut_distance, davis_distance, alewife_distance, 
            kendall_mit_distance, charles_mgh_distance, downtown_crossing_distance, quincy_center_distance, quincy_adams_distance, ashmont_distance, 
            wollaston_distance, fields_corner_distance, central_square_distance, braintree_distance) == jfk_umass_distance )
            {
              closest_station = "JFK / UMass Station";
              closest_station_coords = harvard_square;
            }     

            if ( Math.min(south_station_distance, andrew_distance, porter_square_distance, harvard_square_distance, jfk_umass_distance,
            savin_hill_distance, park_street_distance, broadway_distance, north_quincy_distance, shawmut_distance, davis_distance, alewife_distance, 
            kendall_mit_distance, charles_mgh_distance, downtown_crossing_distance, quincy_center_distance, quincy_adams_distance, ashmont_distance, 
            wollaston_distance, fields_corner_distance, central_square_distance, braintree_distance) == savin_hill_distance )
            {
              closest_station = "Savin Hill Station";
              closest_station_coords = savin_hill;
            }     

            if ( Math.min(south_station_distance, andrew_distance, porter_square_distance, harvard_square_distance, jfk_umass_distance,
            savin_hill_distance, park_street_distance, broadway_distance, north_quincy_distance, shawmut_distance, davis_distance, alewife_distance, 
            kendall_mit_distance, charles_mgh_distance, downtown_crossing_distance, quincy_center_distance, quincy_adams_distance, ashmont_distance, 
            wollaston_distance, fields_corner_distance, central_square_distance, braintree_distance) == park_street_distance )
            {
              closest_station = "Park Street Station";
              closest_station_coords = park_street;
            }     

            if ( Math.min(south_station_distance, andrew_distance, porter_square_distance, harvard_square_distance, jfk_umass_distance,
            savin_hill_distance, park_street_distance, broadway_distance, north_quincy_distance, shawmut_distance, davis_distance, alewife_distance, 
            kendall_mit_distance, charles_mgh_distance, downtown_crossing_distance, quincy_center_distance, quincy_adams_distance, ashmont_distance, 
            wollaston_distance, fields_corner_distance, central_square_distance, braintree_distance) == broadway_distance )
            {
              closest_station = "Broadway Station";
              closest_station_coords = broadway;
            }     


            if ( Math.min(south_station_distance, andrew_distance, porter_square_distance, harvard_square_distance, jfk_umass_distance,
            savin_hill_distance, park_street_distance, broadway_distance, north_quincy_distance, shawmut_distance, davis_distance, alewife_distance, 
            kendall_mit_distance, charles_mgh_distance, downtown_crossing_distance, quincy_center_distance, quincy_adams_distance, ashmont_distance, 
            wollaston_distance, fields_corner_distance, central_square_distance, braintree_distance) == north_quincy_distance )
            {
              closest_station = "North Quincy Station";
              closest_station_coords = north_quincy;
            }     

            if ( Math.min(south_station_distance, andrew_distance, porter_square_distance, harvard_square_distance, jfk_umass_distance,
            savin_hill_distance, park_street_distance, broadway_distance, north_quincy_distance, shawmut_distance, davis_distance, alewife_distance, 
            kendall_mit_distance, charles_mgh_distance, downtown_crossing_distance, quincy_center_distance, quincy_adams_distance, ashmont_distance, 
            wollaston_distance, fields_corner_distance, central_square_distance, braintree_distance) == shawmut_distance )
            {
              closest_station = "Shawmut Station";
              closest_station_coords = shawmut;
            }     

            if ( Math.min(south_station_distance, andrew_distance, porter_square_distance, harvard_square_distance, jfk_umass_distance,
            savin_hill_distance, park_street_distance, broadway_distance, north_quincy_distance, shawmut_distance, davis_distance, alewife_distance, 
            kendall_mit_distance, charles_mgh_distance, downtown_crossing_distance, quincy_center_distance, quincy_adams_distance, ashmont_distance, 
            wollaston_distance, fields_corner_distance, central_square_distance, braintree_distance) == alewife_distance )
            {
              closest_station = "Alewife Station";
              closest_station_coords = alewife;
            }
            
            if ( Math.min(south_station_distance, andrew_distance, porter_square_distance, harvard_square_distance, jfk_umass_distance,
            savin_hill_distance, park_street_distance, broadway_distance, north_quincy_distance, shawmut_distance, davis_distance, alewife_distance, 
            kendall_mit_distance, charles_mgh_distance, downtown_crossing_distance, quincy_center_distance, quincy_adams_distance, ashmont_distance, 
            wollaston_distance, fields_corner_distance, central_square_distance, braintree_distance) == kendall_mit_distance )
            {
              closest_station = "kendall / MIT Station";
              closest_station_coords = kendall_mit;
            }   

            if ( Math.min(south_station_distance, andrew_distance, porter_square_distance, harvard_square_distance, jfk_umass_distance,
            savin_hill_distance, park_street_distance, broadway_distance, north_quincy_distance, shawmut_distance, davis_distance, alewife_distance, 
            kendall_mit_distance, charles_mgh_distance, downtown_crossing_distance, quincy_center_distance, quincy_adams_distance, ashmont_distance, 
            wollaston_distance, fields_corner_distance, central_square_distance, braintree_distance) == charles_mgh_distance )
            {
              closest_station = "Charles/MGH Station";
              closest_station_coords = charles_mgh;
            }       

            if ( Math.min(south_station_distance, andrew_distance, porter_square_distance, harvard_square_distance, jfk_umass_distance,
            savin_hill_distance, park_street_distance, broadway_distance, north_quincy_distance, shawmut_distance, davis_distance, alewife_distance, 
            kendall_mit_distance, charles_mgh_distance, downtown_crossing_distance, quincy_center_distance, quincy_adams_distance, ashmont_distance, 
            wollaston_distance, fields_corner_distance, central_square_distance, braintree_distance) == downtown_crossing_distance )
            {
              closest_station = "Downtown Crossing Station";
              closest_station_coords = downtown_crossing;
            }     

            if ( Math.min(south_station_distance, andrew_distance, porter_square_distance, harvard_square_distance, jfk_umass_distance,
            savin_hill_distance, park_street_distance, broadway_distance, north_quincy_distance, shawmut_distance, davis_distance, alewife_distance, 
            kendall_mit_distance, charles_mgh_distance, downtown_crossing_distance, quincy_center_distance, quincy_adams_distance, ashmont_distance, 
            wollaston_distance, fields_corner_distance, central_square_distance, braintree_distance) == quincy_center_distance )
            {
              closest_station = "Quincy Center Station";
              closest_station_coords = quincy_center;
            }     

            if ( Math.min(south_station_distance, andrew_distance, porter_square_distance, harvard_square_distance, jfk_umass_distance,
            savin_hill_distance, park_street_distance, broadway_distance, north_quincy_distance, shawmut_distance, davis_distance, alewife_distance, 
            kendall_mit_distance, charles_mgh_distance, downtown_crossing_distance, quincy_center_distance, quincy_adams_distance, ashmont_distance, 
            wollaston_distance, fields_corner_distance, central_square_distance, braintree_distance) == quincy_adams_distance )
            {
              closest_station = "Quincy Adams Station";
              closest_station_coords = quincy_adams;
            }     


            if ( Math.min(south_station_distance, andrew_distance, porter_square_distance, harvard_square_distance, jfk_umass_distance,
            savin_hill_distance, park_street_distance, broadway_distance, north_quincy_distance, shawmut_distance, davis_distance, alewife_distance, 
            kendall_mit_distance, charles_mgh_distance, downtown_crossing_distance, quincy_center_distance, quincy_adams_distance, ashmont_distance, 
            wollaston_distance, fields_corner_distance, central_square_distance, braintree_distance) == wollaston_distance )
            {
              closest_station = "Wollaston Station";
              closest_station_coords = wollaston;
            }  

            if ( Math.min(south_station_distance, andrew_distance, porter_square_distance, harvard_square_distance, jfk_umass_distance,
            savin_hill_distance, park_street_distance, broadway_distance, north_quincy_distance, shawmut_distance, davis_distance, alewife_distance, 
            kendall_mit_distance, charles_mgh_distance, downtown_crossing_distance, quincy_center_distance, quincy_adams_distance, ashmont_distance, 
            wollaston_distance, fields_corner_distance, central_square_distance, braintree_distance) == fields_corner_distance )
            {
              closest_station = "Fields Corner Station";
              closest_station_coords = fields_corner;
            }     

            if ( Math.min(south_station_distance, andrew_distance, porter_square_distance, harvard_square_distance, jfk_umass_distance,
            savin_hill_distance, park_street_distance, broadway_distance, north_quincy_distance, shawmut_distance, davis_distance, alewife_distance, 
            kendall_mit_distance, charles_mgh_distance, downtown_crossing_distance, quincy_center_distance, quincy_adams_distance, ashmont_distance, 
            wollaston_distance, fields_corner_distance, central_square_distance, braintree_distance) == central_square_distance )
            {
              closest_station = "Central Square Station";
              closest_station_coords = central_square;
            }     

            if ( Math.min(south_station_distance, andrew_distance, porter_square_distance, harvard_square_distance, jfk_umass_distance,
            savin_hill_distance, park_street_distance, broadway_distance, north_quincy_distance, shawmut_distance, davis_distance, alewife_distance, 
            kendall_mit_distance, charles_mgh_distance, downtown_crossing_distance, quincy_center_distance, quincy_adams_distance, ashmont_distance, 
            wollaston_distance, fields_corner_distance, central_square_distance, braintree_distance) == braintree_distance )
            {
              closest_station = "Braintree Station";
              closest_station_coords = braintree;
            }     







              marker_for_me = new google.maps.Marker({
              position: me,
              map: map,
              title: "Closest MBTA Station: " + closest_station + "</br>" + "Miles to nearest MBTA station " + smallest_distance + " miles."
              });

              marker_for_me.setMap(map);

              google.maps.event.addListener(marker_for_me, 'click', function() {
              infowindow_for_me.setContent(marker_for_me.title);
              infowindow_for_me.open(map, marker_for_me);
              });

              // Should do distance code here!!!


              // Changing closest station coordinates to numbers
              var closest_lat = closest_station_coords.lat();
              var closest_lng = closest_station_coords.lng();
              
            // Test polyline to me marker
            var me_to_closest_mbta = [
              { lat: myLat, lng: myLng},
              // myLat and myLng still seem to point to 0 now
              // Seems to be a matter of scope
              // Random one at first
              { lat: closest_lat, lng: closest_lng}
        ];

             var me_to_mbta = new google.maps.Polyline({
                path: me_to_closest_mbta,
                geodesic: true,
                strokeColor: '#0000FF',
                strokeOpacity: 1.0,
                strokeWeight: 3
              });

        me_to_mbta.setMap(map);

            
            
            
            
            
            














              // For navigator function
           });

        }
        
      }





