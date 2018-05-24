<template>
    <div class="locate">
        <div class="geolocation" v-on:click="geolocation()"></div>
        <gmap-autocomplete class="autoComplete" placeholder="Orte Durchsuchen" @place_changed="setLocation"></gmap-autocomplete>
    </div>
</template>

<script>
    import {has as _has} from 'lodash';

    export default {
        name: "SearchBar",
        data() {
            return {
                searchAddressInput: ''
            }
        },
        methods: {
            searchLocation() {
                // eslint-canVote-next-line no-undef
                const geocoder = new google.maps.Geocoder();
                geocoder.geocode({'address': this.searchAddressInput}, (results, status) => {
                    if (status === 'OK') {
                        const lat = results[0].geometry.location.lat();
                        const lng = results[0].geometry.location.lng();
                        console.log(lat, lng);
                        this.$emit('current-location-changed', {lat, lng});
                    }
                });
            },
            geolocation() {
                navigator.geolocation.getCurrentPosition((position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    this.$emit('current-location-changed', {lat, lng});
                });
            },
            setLocation(location) {
                console.log(location);
                if (_has(location, 'geometry')) {
                    const lat = location.geometry.location.lat();
                    const lng = location.geometry.location.lng();
                    this.$emit('current-location-changed', {lat, lng});
                } else {
                    this.searchAddressInput = location.name;
                    this.searchLocation();
                }
            }
        }
    }
</script>

<style>
    .locate {
        position: absolute;
        left: 40%;
        width: 20%;
        height: 3%;
        bottom: 5%;
        z-index: 5;
    }

    .autoComplete{
        width: 100%;
        height: 100%;
        font-size: 16px;
    }
    .pac-container{
        position: absolute;
        margin-top: -210px;
    }
</style>