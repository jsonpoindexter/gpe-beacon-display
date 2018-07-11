new Vue({
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
                status: 'unknown',
                heading: null,
                coords: [40.7645145852504, -119.21121839614607],
            },
            {
                id: 1,
                name: '',
                type: 'marker',
                active: true,
                status: 'unknown',
                heading: null,
                coords: [40.78309835641549, -119.23576756423887],
            },
            {
                id: 2,
                name: '',
                type: 'marker',
                active: true,
                status: 'unknown',
                heading: null,
                coords: [40.80652268117702, -119.22001158844188],
            },
            {
                id: 3,
                name: '',
                type: 'marker',
                active: true,
                status: 'unknown',
                heading: null,
                coords: [40.802409462414424, -119.18571225558496],
            },
            {
                id: 4,
                name: '',
                type: 'marker',
                active: true,
                status: 'unknown',
                heading: null,
                coords: [40.77644550344593, -119.18029019558828],
            },
        ],
        menu: {
            headers: ['Active', 'Id', 'Status', 'Name', 'Heading']
        }
    },
    mounted() {
        this.initMap();
        this.initLayers();
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
                    icon: L.icon({
                        iconUrl: 'marker/car.png',
                        iconSize:     [48/2, 48/2], // size of the icon
                        iconAnchor:   [24/2, 24/2], // point of the icon which will correspond to marker's location
                    })
                });
                if(beacon.active) {
                    console.log("init add beacon " + beacon.id)
                    beacon.leafletObject.addTo(this.map);
                }
            });
        },
        layerChanged(layerId, active) {
            const layer = this.layers.find(layer => layer.id === layerId);
            layer.features.forEach((feature) => {
                if (active) {
                    feature.leafletObject.addTo(this.map);
                } else {
                    feature.leafletObject.removeFrom(this.map);
                }
            });
        },
        beaconChanged(id, active) {
            const beacon = this.beacons.find(beacon => beacon.id === id);
            if (active) {
                console.log("add beacon " + beacon.id)
                beacon.leafletObject.addTo(this.map);
            } else {
                console.log("remove beacon " + beacon.id)
                console.log("remove beacon leafletObject " + beacon.leafletObject)
                beacon.leafletObject.removeFrom(this.map);
            }

        },
    },
});
