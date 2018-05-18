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
                        v-on:click="setEventData(index)"></GmapMarker>
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
    import SearchBar from "./SearchBar";
    import SideBar from "./SideBar";
    import PinBlue from "../assets/pin_big_blue.png"
    import PinRed from "../assets/pin_big_red.png"
    import firebase from 'firebase'
    import axios from 'axios'

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
            this.changeMarker();
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
            reverseGeocoding(coordinates) {
                console.log(coordinates);
                axios.post('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + coordinates.lat + ',' + coordinates.lng + '&key=AIzaSyCDM_S_XXzHr9lWzesvLwBSNlssF9TQ9fc')
                    .then(response => {
                        console.log(response.data);
                        this.eventLocation = response.data.results[0].formatted_address;
                    })
                    .catch(e => {
                        console.log(e)
                    })
            },
            getMarkers() {
                const ref = firebase.database().ref('events');
                const eventMarkers = [];
                ref.on("child_added", function (snapshot) {
                    console.log(snapshot.val());
                    eventMarkers.push(snapshot.val());
                });
                this.eventMarkers = eventMarkers;
                this.$forceUpdate();

            },
            changeMarker() {
                const ref = firebase.database().ref('events');
                let changedMarker;
                const reef = this;
                //var markers = this.eventMarkers;
                ref.on("child_changed", function (snapshot) {
                    changedMarker = snapshot.val();
                    console.log(snapshot.val());
                    const name = changedMarker.name;
                    const index = reef.eventMarkers.findIndex(x => x.name === name);
                    reef.eventMarkers[index] = changedMarker;
                    reef.$forceUpdate();
                });
            },
            getIcon(litMeter) {
                if (litMeter > 10) {
                    return PinBlue
                } else {
                    return PinRed
                }
            },
            setEventData(index) {
                this.eventName = this.eventMarkers[index].name;
                const coordinates = this.eventMarkers[index].position;
                this.eventLocation = axios.post('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + coordinates.lat + ',' + coordinates.lng + '&key=AIzaSyCDM_S_XXzHr9lWzesvLwBSNlssF9TQ9fc')
                    .then(response => {
                        console.log(response.data);
                        this.eventLocation = response.data.results[0].formatted_address;
                        this.showSidebar = true;
                    })
                    .catch(e => {
                        console.log(e)
                    });
                this.eventWebsite = this.eventMarkers[index].url;

                const time = new Date(this.eventMarkers[index].time);
                let minutes = time.getMinutes();
                minutes = minutes< 10 ? '0'+minutes : minutes;
                this.eventTime = time.getHours()+":"+minutes;

                this.eventLitMeter = this.eventMarkers[index].litMeter;

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