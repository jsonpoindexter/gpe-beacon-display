var map = L.map('map', {
    zoomControl: false
}).setView([40.7864, -119.2065], 14);

// L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
//     maxZoom: 18,
//     id: 'mapbox.satellite'
// }).addTo(map)

L.tileLayer(
    './assets/tiles/sat_tiles/{z0}/{x0}/{x1}/{y0}/{y1}.png', {
    maxZoom: 18
}).addTo(map);;

L.control.zoom({position: 'bottomright'}).addTo(map)


// CoordiFnates from iBurn Maps 2017: https://github.com/iBurnApp/iBurn-Data/tree/master/data/2017/geo
L.polygon([
    [40.7645145852504, -119.21121839614607],
    [40.78309835641549, -119.23576756423887],
    [40.80652268117702, -119.22001158844188],
    [40.802409462414424, -119.18571225558496],
    [40.77644550344593, -119.18029019558828],
    [40.7645145852504, -119.21121839614607]
]).addTo(map);

class Beacon {
    constructor(
        id,
        lat,
        lon,
        heading,
        headingLine,
        // vehiclePower,
        // configVersion,
        // temp,
        markerSize,
    ){
        this.id = id;
        this.lat = lat;
        this.lon = lon;
        this.heading = Math.floor(Math.random() * 360);  ;
        // this.vehiclePower = vehiclePower;
        // this.configVersion = configVersion;
        // this.temp = temp;
        this.icon = L.icon({
            iconUrl: './assets/markers/car.png',
            iconSize:     [48/2, 48/2], // size of the icon
            iconAnchor:   [24/2, 24/2], // point of the icon which will correspond to marker's location
        });
        this.marker = L.marker(
            [this.lat, this.lon],
            {icon: this.icon},
        );
        this.headingLine = L.polyline([], {color: 'red'}).addTo(map);
    }
}

let beacons = [
    new Beacon(0, 40.7645145852504, -119.21121839614607, ),
    new Beacon(1, 40.78309835641549, -119.23576756423887),
    new Beacon(2, 40.80652268117702, -119.22001158844188),
    new Beacon(3, 40.802409462414424, -119.18571225558496),
    new Beacon(4, 40.77644550344593, -119.18029019558828)
];

// Plot beacon on map
beacons.forEach(beacon => {
    beacon.marker.addTo(map);
    // Find a <table> element with id="myTable":
    var table = document.getElementById("menuTable");

    // Create an empty <tr> element and add it to the 1st position of the table:
    var row = table.insertRow(beacon.id + 1);

    // Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
    row.insertCell(0).innerHTML = '<input type="checkbox"/>';
    row.insertCell(1).innerHTML = "";
    row.insertCell(2).innerHTML = "";
    row.insertCell(3).innerHTML = "";
});


setInterval(function(){
    beacons.forEach(beacon => {
        // Lat / Lon generation
        beacon.lat = beacon.lat + Math.floor(Math.random() * 10) / 100000;
        beacon.lon = beacon.lon + Math.floor(Math.random() * 10) / 100000;


        // Heading generation
        random = Math.floor(Math.random() * 15);
        let plusOrMinus = Math.random() < 0.5 ? -1 : 1;
        random = random * plusOrMinus;
        if(beacon.heading + random < 0) {
            beacon.heading = 360 + random
        } else if (beacon.heading + random > 360){
            beacon.heading = 0 + random
        } else {
            beacon.heading = beacon.heading + random
        }
        let length = .004;
        // console.log(`latLng: ${beacon.marker.getLatLng().lat} `)
        let end_lng = beacon.marker.getLatLng().lng + length * Math.cos(beacon.heading * Math.PI / 180);
        let end_lat = beacon.marker.getLatLng().lat + length * Math.sin(beacon.heading * Math.PI / 180);
        // console.log(`end_lng: ${end_lng} end_lat: ${end_lat}`)
        beacon.headingLine.setLatLngs([
            [beacon.lat, beacon.lon],
            [end_lat, end_lng]
        ]);


        beacon.marker.bindPopup(`<table><tr><td>ID</td><td>${beacon.id}</td></tr><tr><td>Heading</td><td>${beacon.heading}</td></tr></table>`);
        beacon.marker.setLatLng([beacon.lat, beacon.lon]);

        // Find a <table> element with id="myTable":
        var table = document.getElementById("menuTable");
        // table.rows[beacon.id + 1].cells[0].innerHTML = "Y";
        table.rows[beacon.id + 1].cells[1].innerHTML = "Online";
        table.rows[beacon.id + 1].cells[2].innerHTML = beacon.id;
        table.rows[beacon.id + 1].cells[3].innerHTML = beacon.heading;

    });
}, 1000);
