<template>
    <div>
        <search-bar v-on:current-location-changed="locationChanged"></search-bar>
        <GmapMap :center="currentLocation"
                 :options="mapOptions"
                 class="map">
            <GmapMarker :position="locationMarkerPosition"/>
            <GmapMarker :key="index"
                        v-for="(m, index) in eventMarkers"
                        :position="m.position"
                        :clickable="true"
                        @click="currentLocation=m.position"/>
        </GmapMap>
    </div>
</template>

<script>
    import SearchBar from "./SearchBar";

    export default {
        name: 'GoogleMaps',
        components: {SearchBar},
        data() {
            return {
                currentLocation: {
                    lat: 47.370000,
                    lng: 8.542297
                },
                locationMarkerPosition: {
                    lat: 47.370000,
                    lng: 8.542297
                },
                mapOptions: {
                    zoom: 12,
                    mapTypeId: "roadmap",
                    streetViewControl: false,
                    rotateControl: false,
                    fullscreenControl: false,
                    mapTypeControl: false,
                    zoomControl: false
                },
                eventMarkers: [{}],
                searchAddressInput: ''
            }
        },
        mounted() {
            this.geolocation();
        },
        methods: {
            locationChanged(location) {
                console.log('event', location);
                this.currentLocation = location;
                this.locationMarkerPosition = location;
            },
            geolocation() {
                navigator.geolocation.getCurrentPosition((position) => {
                    this.currentLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    this.locationMarkerPosition = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    }
                });
            }
        }
    }
</script>

<style>
    .map {
        width: 100%;
        height: 100vh;
    }
</style>