Meteor.startup(function () {
  CommuteMaps.load({
    key: 'AIzaSyAJblaTQdHe-nUEJ0fef0MuM9Erm85XNH8'
  });


});

Template.mainTemplate.onCreated(function() {
  var self = this;
  self.neighbourhoodsSubscription = this.subscribe('neighbourhoods');

  this.autorun(function(runFunc) {
    var newMarkerSubscription;
    var geospatialQuery = Session.get('geospatialQuery');
    if (geospatialQuery) {
      newMarkerSubscription = self.subscribe('markers', geospatialQuery);
    } else {
      newMarkerSubscription = self.subscribe('markers');
    }
    if (self.markerSubscription) {
      self.markerSubscription.stop();
    }
    self.markerSubscription = newMarkerSubscription;
  });
});

Template.mainTemplate.helpers({
  labels: function() {
    return {
      byDistanceLabel: 'Distanz',
      byTravelTimeLabel: 'Zeit',
      showAllMarkersLabel: 'Alle anzeigen'
    }
  },
  markers: function() {
    return Markers.find();
  },
  callbacks: function() {
    return {
      markerSelected: function(marker) {
        console.log(marker);
      },
      markerDeselected: function(marker) {
        console.log(marker);
      },
      geospatialQueryChanged: function(geospatialQuery) {
        Session.set('geospatialQuery', geospatialQuery);
      }
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