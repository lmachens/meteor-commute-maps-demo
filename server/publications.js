Meteor.publish("markers", function (geospatialQuery) {
  if (geospatialQuery !== null) {
    return Markers.find({
      position: geospatialQuery
    });
  }
  return Markers.find();
});

Meteor.publish("neighbourhoods", function () {
  return Neighbourhoods.find();
});
