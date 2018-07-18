const beaconIcon = L.icon({
    iconUrl: 'marker/car-top_heading.png',
    iconSize:     [48, 24], // size of the icon
    iconAnchor:   [24/2, 24/2], // point of the icon which will correspond to marker's location
});


// beacon status colors when timediff threshold is crossed in millis
const status_red = 10000;
const status_yellow = 5000;
// anything below: green