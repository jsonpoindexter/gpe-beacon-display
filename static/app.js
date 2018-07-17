const beaconIcon = L.icon({
    iconUrl: 'marker/car-top_heading.png',
    // iconSize:     [48/2, 48/2], // size of the icon
    // iconAnchor:   [24/2, 24/2], // point of the icon which will correspond to marker's location
});

const selectedIcon = L.icon({
    iconUrl: 'marker/car-dodger_blue.png',
    iconSize:     [48/2, 48/2], // size of the icon
    iconAnchor:   [24/2, 24/2], // point of the icon which will correspond to marker's location
});

var app = new Vue({
    el: '#app',
    data: {
        map: null,
        tileLayer: null,
        layers: [
            {
                id: 0,
                name: 'Polygons',
                active: true,
                features: [
                    {
                        id: 0,
                        name: 'Trash Fence',
                        type: 'polygon',
                        coords: [[40.7645145852504, -119.21121839614607],
                            [40.78309835641549, -119.23576756423887],
                            [40.80652268117702, -119.22001158844188],
                            [40.802409462414424, -119.18571225558496],
                            [40.77644550344593, -119.18029019558828],
                            [40.7645145852504, -119.21121839614607]],
                    },
                ],
            },

        ],
        beacons: [
            {
                id: 0,
                name: '',
                type: 'marker',
                active: true,
                isSelected: false,
                status: 'unknown',
                heading: null,
                coords: [0,0],
            },
            {
                id: 1,
                name: '',
                type: 'marker',
                active: true,
                isSelected: false,
                status: 'unknown',
                heading: null,
                coords: [0,0],
            },
            {
                id: 2,
                name: '',
                type: 'marker',
                active: true,
                isSelected: false,
                status: 'unknown',
                heading: null,
                coords: [0,0],
            },
            {
                id: 3,
                name: '',
                type: 'marker',
                active: true,
                isSelected: false,
                status: 'unknown',
                heading: null,
                coords: [0,0],
            },
            {
                id: 4,
                name: '',
                type: 'marker',
                active: true,
                isSelected: false,
                status: 'unknown',
                heading: null,
                coords: [0,0],
            },
        ],
        menu: {
            headers: ['Active', 'Id', 'Status', 'Name', 'Heading']
        }
    },
    computed: {
         doShow:() => {
            return this.acti
        }
    },
    mounted() {
        this.initMap();
        this.initLayers();
        this.initEss();
    },
    methods: {
        initMap() {
            this.map = L.map('map', { zoomControl: false }).setView([40.7864, -119.2065], 14);
            this.tileLayer = L.tileLayer(
                'leaflet/tiles/ter_tiles/{z0}/{x0}/{x1}/{y0}/{y1}.png', {
                    maxZoom: 18
                }).addTo(this.map);
            L.control.zoom({position: 'bottomright'}).addTo(this.map);
        },
        initLayers() {
            this.layers.forEach((layer) => {
                const markerFeatures = layer.features.filter(feature => feature.type === 'marker');
                markerFeatures.forEach((feature) => {
                    feature.leafletObject = L.marker(feature.coords).bindPopup(feature.name);
                    if(layer.active) {
                        feature.leafletObject.addTo(this.map);
                    }
                });

                const polygonFeatures = layer.features.filter(feature => feature.type === 'polygon');
                polygonFeatures.forEach((feature) => {
                    feature.leafletObject = L.polygon(feature.coords)
                        .bindPopup(feature.name);
                    if(layer.active) {
                        feature.leafletObject.addTo(this.map);
                    }
                });
            });

            this.beacons.forEach((beacon) => {
                beacon.leafletObject = L.marker(beacon.coords, {
                    icon: beaconIcon,
                    rotationAngle: 0
                });
                if(beacon.active) {
                    beacon.leafletObject.addTo(this.map);
                }
            });
        },
        initEss(){
            var source = new EventSource("/stream");
            source.addEventListener('beacon', event => {
                var data = JSON.parse(event.data);
                // console.log("Received beacon data: " + data);
                const beacon = this.beacons.find(beacon => beacon.id === data.id)
                beacon.leafletObject.setLatLng(data.coords)
                beacon.leafletObject.setRotationAngle(data.heading)
                beacon.heading = data.heading


            }, false);
            source.addEventListener('error', () => {
                // console.log("Failed to connect to event stream. Is Redis running?");
            }, false);
            source.onmessage = event =>{
                // console.log("Unkown message: " + event.data);
            }

        },
        layerChanged(layerId) {
            const layer = this.layers.find(layer => layer.id === layerId);
            layer.features.forEach((feature) => {
                if (layer.active) {
                    feature.leafletObject.addTo(this.map);
                } else {
                    feature.leafletObject.removeFrom(this.map);
                }
            });
        },
        beaconActiveChanged(id) {
            const beacon = this.beacons.find(beacon => beacon.id === id);
            if (beacon.active) {
                beacon.leafletObject.addTo(this.map);
            } else {
                beacon.isSelected = false;
                beacon.leafletObject.removeFrom(this.map);
                beacon.leafletObject.setIcon(beaconIcon)
            }

        },
        beaconNameChanged(id) {
            const beacon = this.beacons.find(beacon => beacon.id === id);
            beacon.leafletObject.bindPopup(beacon.name)
        },
        selectedChanged(id) {
            const beacon = this.beacons.find(beacon => beacon.id === id);
            if(beacon.active) {
                beacon.isSelected = !beacon.isSelected;
                if(beacon.isSelected){
                    beacon.leafletObject.setIcon(selectedIcon)
                } else {
                    beacon.leafletObject.setIcon(beaconIcon)
                }
            }
        }
    },
});
