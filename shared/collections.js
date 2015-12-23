Neighbourhoods = new Mongo.Collection("neighbourhoods");
Markers = new Mongo.Collection("markers");

// unique representation of lat and lng (converted to int first)
pairCoordinates = function(lat, lng) {
  return lat * 1e7 << 16 & 0xffff0000 | lng * 1e7 & 0x0000ffff;
}

coordinatesHelper = function(lat, lng) {
  return {
    position: {
      type: 'Point',
      coordinates: [
        lng,
        lat
      ]
    },
    pairedCoordinates: pairCoordinates(lat, lng)
  }
}
