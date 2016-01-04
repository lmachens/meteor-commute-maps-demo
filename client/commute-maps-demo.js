Meteor.startup(function () {
  CommuteMaps.load({
    key: 'AIzaSyAJblaTQdHe-nUEJ0fef0MuM9Erm85XNH8'
  });


});

Template.mainTemplate.onCreated(function() {
  Session.set('logs', 'Inititalized<br>');
  var self = this;
  self.neighbourhoodsSubscription = this.subscribe('neighbourhoods');

  this.autorun(function(runFunc) {
    var newMarkersSubscription;

    var showHiddenMarkers = Session.get('showHiddenMarkers');
    var primaryBounds = Session.get('primaryBounds');
    if (primaryBounds === 'map' || showHiddenMarkers) {
      newMarkersSubscription = self.subscribe('markers', Session.get('mapBounds'));
    } else {
      newMarkersSubscription = self.subscribe('markers', Session.get('distanceBounds'));
    }

    if (self.markersSubscription && self.markersSubscription.subscriptionId != newMarkersSubscription.subscriptionId) {
      self.markersSubscription.stop();
    }
    self.markersSubscription = newMarkersSubscription;
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
        Session.set('logs', 'markerSelected<br>' + Session.get('logs'));
      },
      markerDeselected: function(marker) {
        Session.set('logs', 'markerDeselected<br>' + Session.get('logs'));
      },
      mapBoundsChanged: function(geospatialQuery, primaryBounds) {
        if (primaryBounds) {
          Session.set('primaryBounds', 'map');
        }
        Session.set('mapBounds', geospatialQuery);
      },
      distanceBoundsChanged: function(geospatialQuery, primaryBounds) {
        Session.set('distanceBounds', geospatialQuery)
        Session.set('primaryBounds', 'distance');
      },
      showHiddenMarkersChanged: function(showHiddenMarkers) {
        Session.set('showHiddenMarkers', showHiddenMarkers);
        Session.set('logs', 'showHiddenMarkers<br>' + Session.get('logs'));
      },
      travelModeChanged: function(travelMode) {
        Session.set('logs', 'travelMode: ' + travelMode + '<br>' + Session.get('logs'));
      }
    }
  },
  options: function() {
    return {
      center: {
        lat: '52.514465',
        lng: '13.349547'
      },
      hideCommuteBox: false
    };
  },
  features: function() {
    return Neighbourhoods.find().fetch();
  },
  mapBounds: function() {
    return JSON.stringify(Session.get('mapBounds'));
  },
  distanceBounds: function() {
    return JSON.stringify(Session.get('distanceBounds'));
  },
  primaryBounds: function(type) {
    return Session.get('primaryBounds') === type;
  },
  logs: function() {
    return Session.get('logs');
  }
});

Template.mainTemplate.events({
  'click .newMarker': function(event) {
    var r = 3000/111300 // = 3000 meters
      , y0 = 52.522114
      , x0 = 13.410197
      , u = Math.random()
      , v = Math.random()
      , w = r * Math.sqrt(u)
      , t = 2 * Math.PI * v
      , x = w * Math.cos(t)
      , y1 = w * Math.sin(t)
      , x1 = x / Math.cos(y0)


    // Insert a marker into the collection
    Markers.insert(coordinatesHelper(y0 + y1, x0 + x1));
  },

  'click .removeMarker': function(event) {
    // Remove random marker
    var skip = Math.floor(Math.random() * Markers.find().count());
    var random = Markers.findOne({}, { skip: skip });
    Markers.remove(random._id);
  }
});