Meteor.startup(function () {
  CommuteMaps.load({
    key: 'AIzaSyAJblaTQdHe-nUEJ0fef0MuM9Erm85XNH8'
  });


});

Template.mainTemplate.onCreated(function() {
  Session.set('showcaseIDs', null);
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

  this.highlightedMarkers = new Meteor.Collection(null);
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
        Session.set('showcaseIDs', marker.markerIDs);
      },
      markerDeselected: function(marker) {
        Session.set('logs', 'markerDeselected<br>' + Session.get('logs'));
        Session.set('showcaseIDs', null);
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
      },
      showcaseMarkersInfos: function(pairedCoordinates, infos) {
        var html;
        if (!infos) {
          html = '';
        } else {
          var icon = '';
          switch (infos.travelMode) {
            case 'DRIVING': icon = 'fa fa-car fa-lg'; break;
            case 'TRANSIT': icon = 'fa fa-train fa-lg'; break;
            case 'WALKING': icon = 'fa fa-male fa-lg'; break;
            case 'BICYCLING': icon = 'fa fa-bicycle fa-lg'; break;
          }
          html = '<i class="' + icon + '"></i> ' + infos.distance.text + ': ' + infos.duration.text;
        }
        $('.' + pairedCoordinates).html(html);
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
    //return Neighbourhoods.find().fetch();
    return null;
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
  },
  showcaseMarkers: function() {
    var markerIDs = Session.get('showcaseIDs');
    if (markerIDs) {
      return Markers.find({_id: {$in: markerIDs}}, {limit: 5});
    }
    return Markers.find({}, {
      limit: 5
    });
  },
  highlightedMarkers: function() {
    return Template.instance().highlightedMarkers.find();
  }
});

Template.mainTemplate.events({
  'click .newMarker': function(event) {
    var distanceBounds = Session.get('distanceBounds');
    var position = distanceBounds.$geoWithin.$centerSphere[0];
    var r = 5000/111300, // = 5000 meters
      y0 = position[1],
      x0 = position[0],
      u = Math.random(),
      v = Math.random(),
      w = r * Math.sqrt(u),
      t = 2 * Math.PI * v,
      x = w * Math.cos(t),
      y1 = w * Math.sin(t),
      x1 = x / Math.cos(y0)


    // Insert a marker into the collection
    var coordinates = coordinatesHelper(y0 + y1, x0 + x1);
    var max = Math.floor(Math.random() * 99 + 1);
    for (var i=0; i<max; i++) {
      Markers.insert(coordinates);
    }
    Session.set('logs', 'added ' + max + ' markers<br>' + Session.get('logs'));
  },
  'click .removeMarker': function(event) {
    // Remove random marker
    var skip = Math.floor(Math.random() * Markers.find().count());
    var random = Markers.findOne({}, { skip: skip });
    Markers.remove(random._id);
    Session.set('logs', 'removed random marker<br>' + Session.get('logs'));
  },
  'mouseenter .markerItem': function(e, t) {
    t.highlightedMarkers.insert({pairedCoordinates: this.pairedCoordinates});
  },
  'mouseleave .markerItem': function(e, t) {
    t.highlightedMarkers.remove({pairedCoordinates: this.pairedCoordinates});
  }
});