<template>
    <div>
        <search-bar v-on:current-location-changed="locationChanged"></search-bar>
        <GmapMap :center="currentLocation"
                 :options="mapOptions"
                 class="map">
            <GmapMarker :position="locationMarkerPosition"
                        :clickable="false"></GmapMarker>
            <GmapMarker :key="index" v-for="(m,index) in eventMarkers"
                        :position="m.position"
                        :litMeter="m.litMeter"
                        :icon="getIcon(m.litMeter)"
                        :clickable="true"></GmapMarker>
        </GmapMap>
    </div>
</template>

<script>
    //import {has as _has} from 'lodash';
    import SearchBar from "./SearchBar";
    import ImageBlue from "../assets/icon_blue.png"
    import ImageRed from "../assets/icon_red.png"
    import PinBlue from "../assets/pin_big_blue.png"
    import PinRed from "../assets/pin_big_red.png"
    import axios from "axios"

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
                eventMarkers: [],
                searchAddressInput: ''
            }
        },
        mounted() {
            this.geolocation();
            this.getEventMarkers();
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
            getEventMarkers() {
                axios.get("http://127.0.0.1:5000/events").then((response) => {
                    console.log(response.data._items);
                    this.eventMarkers = response.data._items;
                }).catch((error) => {
                    console.log(error)
                })
            },
            getIcon(litMeter) {
                if (litMeter > 10) {
                    return PinBlue
                } else {
                    return PinRed
                }
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