<template>
    <div>
        <!--<div class="geolocation" v-on:click="geolocation()">-->
            <!--<img src="../assets/logo.png" />-->
        <!--</div>-->
        <GmapMap :center="currentLocation"
                 :zoom="zoom"
                 map-type-id="terrain"
                 class="map">
            <GmapMarker :key="index"
                        v-for="(m, index) in markers"
                        :position="m.position"
                        :clickable="true"
                        :draggable="true"
                        @click="currentLocation=m.position"/>
        </GmapMap>
        <gmap-autocomplete @place_changed="setLocation"></gmap-autocomplete>
    </div>
</template>

<script>
    import { has as _has } from 'lodash';

    export default {
        name: 'GoogleMaps',
        data() {
            return {
                markers: [{
                    position: {
                        lat: 10.0,
                        lng: 10.0
                    }
                },{
                    position: {
                        lat: 11.0,
                        lng: 11.0
                    }
                }],
                currentLocation: {
                    lat:10,
                    lng:10
                },
                zoom: 10,
                searchAddressInput: ''
            };
        },
        mounted() {
            this.geolocation();
        },
        methods: {
            geolocation() {
                navigator.geolocation.getCurrentPosition((position) => {
                    this.currentLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                });
            },
            searchLocation() {
                // eslint-disable-next-line no-undef
                const geocoder = new google.maps.Geocoder();
                geocoder.geocode({'address': this.searchAddressInput}, (results, status) => {
                    if (status === 'OK') {
                        this.currentLocation.lat = results[0].geometry.location.lat();
                        this.currentLocation.lng = results[0].geometry.location.lng();
                    }
                });
            },
            setLocation(location) {
                console.log(location);
                if (_has(location, 'geometry')) {
                    const lat = location.geometry.location.lat();
                    const lng = location.geometry.location.lng();
                    this.currentLocation = { lat, lng };
                } else {
                    this.searchAddressInput = location.name;
                    this.searchLocation();
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