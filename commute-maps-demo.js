Neighbourhoods = new Mongo.Collection("neighbourhoods");
Markers = new Mongo.Collection("markers");

// unique representation of lat and lng (converted to int first)
function pairCoordinates(lat, lng) {
  return lat * 1e7 << 16 & 0xffff0000 | lng * 1e7 & 0x0000ffff;
}

function coordinatesHelper(lat, lng) {
  return {
    position: {
      type: 'Point',
      coordinates: [
        lng,
        lat
      ],
      pairedCoordinates: pairCoordinates(lat, lng)
    }
  }
}

if (Meteor.isClient) {
  Meteor.startup(function () {
    CommuteMaps.load({
      key: 'AIzaSyAJblaTQdHe-nUEJ0fef0MuM9Erm85XNH8'
    });


  });

  Template.mainTemplate.onCreated(function() {
    // subscribe markers and wait for subscription ready in template
    this.subscribe('markers');
    this.subscribe('neighbourhoods');
  });

  Template.mainTemplate.helpers({
    labels: function() {
      return {
        byDistanceLabel: 'Distanz',
        byTravelTimeLabel: 'Zeit',
        showAllMarkersLabel: 'Alle anzeigen'
      }
    },
    sampleMarkers1: function() {
      return Markers.find();
    },
    sampleMarkers2: function() {
      return Markers.find();
    },
    callbacks: function() {
      return {
        markerSelected: function(marker) {console.log(marker);},
        markerDeselected: function(marker) {console.log(marker);},
        boundsChanged: function(bounds) {console.log(bounds);}
      }
    },
    options: function() {
      return {
        center: {
          lat: '52.514465',
          lng: '13.349547'
        }
      };
    },
    features: function() {
      return Neighbourhoods.find().fetch();
    }
  });

  Template.mainTemplate.events({
    'submit .newMarker': function(event) {
      event.preventDefault();

      // Get value from form element
      var lat = event.target.lat.value;
      var lng = event.target.lng.value;

      // Insert a marker into the collection
      Markers.insert(coordinatesHelper(lat, lng));

      // Clear form
      event.target.lat.value = "";
      event.target.lng.value = "";
    }
  });
}

if (Meteor.isServer) {
  Meteor.publish("markers", function () {
    return Markers.find();
  });

  Meteor.publish("neighbourhoods", function () {
    return Neighbourhoods.find();
  });

  Meteor.startup(function() {
    // insert sample data
    Markers.remove({});
    Markers.insert(coordinatesHelper(52.522114, 13.410197));
    Markers.insert(coordinatesHelper(52.522937, 13.403460));
    Markers.insert(coordinatesHelper(52.522937, 13.403460));
    Markers.insert(coordinatesHelper(52.519934, 13.398739));

    Neighbourhoods.remove({});
    Neighbourhoods.insert({
      name: 'Berlin',
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {
            name: 'Mitte'
          },
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [13.3793305, 52.5401361],[13.374524, 52.5372649],[13.3731079, 52.5383873],[13.3686018, 52.5360641],[13.3676147, 52.5367689],[13.3673786, 52.5367005],[13.3668691, 52.5365667],[13.3658552, 52.53641],[13.3660107, 52.5362044],[13.3663165, 52.5359108],[13.3673251, 52.5350395],[13.3689128, 52.5335125],[13.3688538, 52.5333786],[13.3691758, 52.5330719],[13.3702486, 52.5319004],[13.3715682, 52.530197],[13.3721422, 52.5295606],[13.3728665, 52.5289144],[13.3733064, 52.5285979],[13.3738214, 52.528229],[13.3740681, 52.5278504],[13.3742719, 52.5275012],[13.3742987, 52.5270183],[13.3742397, 52.5268159],[13.3740842, 52.5265222],[13.3737891, 52.5262546],[13.3735531, 52.526124],[13.3733599, 52.5260261],[13.3733438, 52.5252527],[13.3726304, 52.5248413],[13.3725982, 52.5237089],[13.3728181, 52.5234086],[13.3730381, 52.5233009],[13.3734082, 52.5232291],[13.3749532, 52.5224619],[13.3760691, 52.5218354],[13.3764981, 52.5203991],[13.3769595, 52.5195618],[13.3768898, 52.517982],[13.3773618, 52.5167872],[13.3769715, 52.516637],[13.3768428, 52.5165611],[13.376753, 52.5164649],[13.3767422, 52.5163261],[13.3768214, 52.5160608],[13.3768495, 52.5159907],[13.3769528, 52.5159221],[13.3775644, 52.515714],[13.3769595, 52.512287],[13.3765518, 52.5101583],[13.3766591, 52.5092768],[13.3766698, 52.508885],[13.3768093, 52.5087152],[13.3773672, 52.5083038],[13.3778339, 52.5079806],[13.3789966, 52.5069839],[13.3854245, 52.5074451],[13.3943939, 52.5079153],[13.3988571, 52.5080981],[13.3999728, 52.5094302],[13.4042644, 52.5079676],[13.4052514, 52.5083332],[13.4079551, 52.5061912],[13.4098863, 52.5070272],[13.4117317, 52.5048851],[13.4136628, 52.504206],[13.414049, 52.5038926],[13.4147358, 52.5048329],[13.4172249, 52.5041276],[13.4179974, 52.5052248],[13.4187268, 52.5053031],[13.4194136, 52.5060084],[13.4210442, 52.5055382],[13.4227179, 52.5053031],[13.4245204, 52.505486],[13.4261084, 52.505904],[13.427267, 52.5065309],[13.4291982, 52.5091691],[13.4232758, 52.51246],[13.4273099, 52.5167432],[13.4294986, 52.5207647],[13.429327, 52.5223054],[13.4265374, 52.5230887],[13.419714, 52.525308],[13.4152508, 52.5272664],[13.4099292, 52.5287544],[13.4055519, 52.5295377],[13.406453, 52.5323834],[13.4081267, 52.5343674],[13.4073113, 52.534759],[13.404436, 52.5406059],[13.3933639, 52.5373955],[13.3903169, 52.5356464],[13.3875274, 52.5334537],[13.3793305, 52.5401361]
              ]
            ]
          }
        }
      ]

    });

  });

}