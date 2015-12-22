Markers = new Mongo.Collection("markers");

if (Meteor.isClient) {
  Meteor.startup(function () {
    CommuteMaps.load({
      key: 'AIzaSyAJblaTQdHe-nUEJ0fef0MuM9Erm85XNH8'
    });


  });

  Template.mainTemplate.onCreated(function() {
    // subscribe markers and wait for subscription ready in template
    this.subscribe('markers');
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
    }
  });
}

if (Meteor.isServer) {
  Meteor.publish("markers", function () {
    return Markers.find();
  });

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

  Meteor.startup(function() {
    // insert sample data
    Markers.remove({});
    Markers.insert(coordinatesHelper(52.522114, 13.410197));
    Markers.insert(coordinatesHelper(52.522937, 13.403460));
    Markers.insert(coordinatesHelper(52.522937, 13.403460));
    Markers.insert(coordinatesHelper(52.519934, 13.398739));
  });

}