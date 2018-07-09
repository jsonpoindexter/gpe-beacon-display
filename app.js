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
            }
        ],
    },
    mounted() {
        this.initMap();
        this.initLayers();
    },
    methods: {
        initMap() {
            this.map = L.map('map').setView([40.7864, -119.2065], 14);
            this.tileLayer = L.tileLayer(
                'https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}.png',
                {
                    maxZoom: 18,
                    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution">CARTO</a>',
                }
            );
            this.tileLayer.addTo(this.map);
        },
        initLayers() {
            this.layers.forEach((layer) => {
                const markerFeatures = layer.features.filter(feature => feature.type === 'marker');
                markerFeatures.forEach((feature) => {
                    feature.leafletObject = L.marker(feature.coords)
                        .bindPopup(feature.name);
                });

                const polygonFeatures = layer.features.filter(feature => feature.type === 'polygon');
                polygonFeatures.forEach((feature) => {
                    feature.leafletObject = L.polygon(feature.coords)
                        .bindPopup(feature.name);
                });
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
    },
});