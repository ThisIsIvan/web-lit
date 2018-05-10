<template>
    <div>
        <search-bar v-on:current-location-changed="locationChanged"></search-bar>
        <GmapMap :center="currentLocation"
                 :options="mapOptions"
                 class="map">
            <GmapMarker :position="locationMarkerPosition"/>
            <GmapMarker :key="index" v-for="(m,index) in eventMarkers"
                        :position="m.position"
                        :icon="m.eventIcon"
                        :clickable="true"></GmapMarker>
        </GmapMap>
    </div>
</template>

<script>
    //import {has as _has} from 'lodash';
    import SearchBar from "./SearchBar";
    //import ImageBlue from "../assets/icon_blue.png"
    import ImageRed from "../assets/icon_red.png"

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
                eventMarkers: [{
                    position: {
                        lat: 47.370000,
                        lng: 8.542297
                    },
                    eventIcon: ImageRed
                }],
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
            },
            /*getIcon(litMeter){

            }*/
        }
    }
</script>

<style>
    .map {
        width: 100%;
        height: 100vh;
    }
</style>