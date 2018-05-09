<template>
    <div>
        <div class="locate">
            <div class="search">
                <input type="text" placeholder="Location suchen" v-model="searchAddressInput" v-on:change="searchLocation()">
            </div>
            <div class="geolocation" v-on:click="geolocation()"></div>
        </div>


        <GmapMap :center="currentLocation"
                 :options="mapOptions"
                 class="map">
            <!--<GmapMarker :key="index"
                        v-for="(m, index) in markers"
                        :position="m.position"
                        :clickable="true"
                        :draggable="true"
                        @click="currentLocation=m.position"/>-->
        </GmapMap>
    </div>
</template>

<script>
    import {has as _has} from 'lodash';

    export default {
        name: 'GoogleMaps',
        data() {
            return {
                currentLocation: {
                    lat: 10,
                    lng: 10
                },
                mapOptions: {
                    zoom: 12,
                    mapTypeId: "roadmap",
                    streetViewControl: false,
                    rotateControl: false,
                    fullscreenControl: false,
                    mapTypeControl: false,
                    zoomControl: false
                }
            }
                ;
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
                    this.currentLocation = {lat, lng};
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

    .locate {
        position: absolute;
        top: 10px;
        left: 0;
        z-index: 5;
        background-color: #2db6e9;
        border: 1px solid #999;
        line-height: 30px;
        padding: 10px;
    }
</style>