if (Meteor.isClient) {
  Meteor.startup(function () {
    CommuteMaps.load({
      key: 'AIzaSyAJblaTQdHe-nUEJ0fef0MuM9Erm85XNH8',
      libraries: 'places'
    });
  });

  Template.mainTemplate.helpers({
    labels: function() {
      return {
        byDistanceLabel: 'Distanz',
        byTravelTimeLabel: 'Zeit',
        showAllMarkersLabel: 'Alle anzeigen'
      }
    }
  });
}
