var app = new Vue({
    el: '#app',
    data: {
        map: null,
        tileLayer: null,
        layers: [
            {
                id: 0,
                name: 'Misc',
                features: [
                    {
                        id: 0,
                        name: 'Trash Fence',
                        type: 'polygon',
                        active: true,
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
                selected: false,
                status: 'circle-grey',
                heading: null,
                timestamp: null,
            },
            {
                id: 1,
                name: '',
                type: 'marker',
                active: true,
                selected: false,
                status: 'circle-grey',
                heading: null,
                timestamp: null,
            },
            {
                id: 2,
                name: '',
                type: 'marker',
                active: true,
                selected: false,
                status: 'circle-grey',
                heading: null,
                timestamp: null,
            },
            {
                id: 3,
                name: '',
                type: 'marker',
                active: true,
                selected: false,
                status: 'circle-grey',
                heading: null,
                timestamp: null,
            },
            {
                id: 4,
                name: '',
                type: 'marker',
                active: true,
                selected: false,
                status: 'circle-grey',
                heading: null,
                timestamp: null,
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
        this.time();
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
                    if(feature.active) {
                        feature.leafletObject.addTo(this.map);
                    }
                });

                const polygonFeatures = layer.features.filter(feature => feature.type === 'polygon');
                polygonFeatures.forEach((feature) => {
                    feature.leafletObject = L.polygon(feature.coords)
                        .bindPopup(feature.name);
                    if(feature.active) {
                        feature.leafletObject.addTo(this.map);
                    }
                });
            });

            this.beacons.forEach((beacon) => {
                beacon.leafletObject = L.marker([0,0], {
                    icon: beaconIcon,
                    rotationAngle: 0,
                }).on('click', () => {
                    this.beaconSelectedChanged(beacon.id)
                });
                if(beacon.active) {
                    beacon.leafletObject.addTo(this.map);
                }
            });
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
                beacon.selected = false;
                beacon.leafletObject.removeFrom(this.map);
                beacon.leafletObject.setIcon(beaconIcon)
                beacon.status = 'circle-grey'
            }

        },
        beaconNameChanged(id) {
            const beacon = this.beacons.find(beacon => beacon.id === id);
            beacon.leafletObject.bindPopup(beacon.name)
        },
        beaconSelectedChanged(id) {
            const beacon = this.beacons.find(beacon => beacon.id === id);
            if(beacon.active) {
                beacon.selected = !beacon.selected;
                if(beacon.selected){
                    beacon.leafletObject.enablePermanentHighlight()
                } else {
                    beacon.leafletObject.disablePermanentHighlight()
                }
            }
        },
        nextName: function (index) {
            if (index >= this.$refs.beaconName.length-1) {
                index = 0
            } else {
                index = index + 1
            }
            this.$refs.beaconName[index].focus();
        },
        initEss(){
            let source = new EventSource("/stream");
            source.addEventListener('beacon', event => {
                let data = JSON.parse(event.data);
                console.debug("Received beacon data: " + data);
                const beacon = this.beacons.find(beacon => beacon.id === data.id);
                beacon.leafletObject.setLatLng(data.coords);
                beacon.leafletObject.setRotationAngle(data.heading);
                beacon.heading = data.heading;
                beacon.timestamp = data.timestamp;
            }, false);
            source.addEventListener('error', () => {
                console.debug("Failed to connect to event stream. Is Redis running?");
            }, false);
            source.onmessage = event =>{
                console.debug("Unkown/Unhandled message: " + event.data);
            }

        },
        time() {
            this.beacons.forEach((beacon) => {
                if(beacon.active && beacon.timestamp != null){
                    let timediff = Date.now() - beacon.timestamp;
                    if(timediff > status_red) beacon.status = 'circle-red';
                    else if(timediff > status_yellow) beacon.status = 'circle-yellow';
                    else beacon.status = 'circle-green';
                }

            });
            setTimeout(this.time, 1000)
        }
    },
});
