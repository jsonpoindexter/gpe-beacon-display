var mymap = L.map('mapid').setView([40.7864, -119.2065], 14);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    maxZoom: 18,
    id: 'mapbox.satellite'
}).addTo(mymap);


L.polygon([
    // Coordinates from iBurn Maps 2017: https://github.com/iBurnApp/iBurn-Data/tree/master/data/2017/geo
    [40.7645145852504, -119.21121839614607],
    [40.78309835641549, -119.23576756423887],
    [40.80652268117702, -119.22001158844188],
    [40.802409462414424, -119.18571225558496],
    [40.77644550344593, -119.18029019558828],
    [40.7645145852504, -119.21121839614607]
]).addTo(mymap);