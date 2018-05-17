<template>
    <div>
        <search-bar v-on:current-location-changed="locationChanged"></search-bar>
        <GmapMap :center="currentLocation"
                 :options="mapOptions"
                 v-on:click="closeSideBar"
                 class="map">
            <GmapMarker :position="locationMarkerPosition"
                        :clickable="false"></GmapMarker>
            <GmapMarker :key="index" v-for="(m,index) in eventMarkers"
                        :position="m.position"
                        :litMeter="m.litMeter"
                        :icon="getIcon(m.litMeter)"
                        :clickable="true"
                        v-on:click="setEventData"></GmapMarker>
        </GmapMap>
        <side-bar :name="eventName"
                  :location="eventLocation"
                  :website="eventWebsite"
                  :time="eventTime"
                  :litMeter="eventLitMeter"
                  :show="showSidebar"></side-bar>
    </div>
</template>

<script>
    //import {has as _has} from 'lodash';
    import SearchBar from "./SearchBar";
    import SideBar from "./SideBar";
   // import ImageBlue from "../assets/icon_blue.png"
    //import ImageRed from "../assets/icon_red.png"
    import PinBlue from "../assets/pin_big_blue.png"
    import PinRed from "../assets/pin_big_red.png"
    import firebase from 'firebase'

    export default {
        name: 'GoogleMaps',
        components: {SideBar, SearchBar},
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
                // eventMarkers: [{
                //     position: {
                //         lat: 47.370000,
                //         lng: 8.542297
                //     },
                //     eventIcon: ImageRed
                // }],
                eventMarkers: [],
                searchAddressInput: '',
                eventName: " ",
                eventLocation: " ",
                eventWebsite: " ",
                eventTime: " ",
                eventLitMeter: 0,
                showSidebar: false
            }
        },
        mounted() {
            this.geolocation();
            this.getMarkers();
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
            getMarkers(){
                var database = firebase.database().ref();
                database.on('child_added', function (data) {
                    console.log(data.val());
                    try{
                        this.eventMarkers = data.val();
                        console.log("passed")
                    } catch(e){
                        console.log("Failed")
                    }
                });
            },
            getIcon(litMeter) {
                if (litMeter > 10) {
                    return PinBlue
                } else {
                    return PinRed
                }
            },
            setEventData() {
                this.eventName = "Nachtseminar";
                console.log(this.eventName);
                this.eventLocation = "Badenerstrasse 109, 8004 Zürich";
                this.eventWebsite = "plaza-zürich.ch";
                this.eventTime = "20:00 Uhr";
                this.eventLitMeter = 50;
                this.showSidebar = true;
            },
            closeSideBar() {
              this.showSidebar = false;
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