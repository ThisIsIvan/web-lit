<template>
    <div>
        <search-bar v-on:current-location-changed="locationChanged"></search-bar>
        <GmapMap :center="centeredLocation"
                 :options="mapOptions"
                 v-on:click="closeSideBar"
                 class="map">
            <GmapMarker :position="currentLocation"
                        :clickable="false"></GmapMarker>

            <GmapCluster :minimumClusterSize="3"
                         :zoomOnClick="true">
                <GmapMarker :key="index" v-for="(m,index) in eventMarkers"
                            :position="m.position"
                            :litMeter="m.litMeter"
                            :icon="getIcon(m.attendance, m.litMeter)"
                            v-on:click="setEventData(index)"></GmapMarker>
            </GmapCluster>
        </GmapMap>
        <side-bar v-bind:marker="eventMarker"
                  :show="showSidebar"
                  :current-location="currentLocation"></side-bar>
        <logo></logo>
    </div>
</template>

<script>
    import SearchBar from "./SearchBar";
    import SideBar from "./SideBar";
    import Logo from "./Logo";
    import PinSmall from "../assets/pin_short.png"
    import PinMiddle from "../assets/pin_middle.png"
    import PinBig from "../assets/pin_big.png"
    import PinSmallBlue from "../assets/pin_small_blue.png"
    import PinMiddleBlue from "../assets/pin_middle_blue.png"
    import PinBigBlue from "../assets/pin_big_blue.png"
    import PinSmallRed from "../assets/pin_small_red.png"
    import PinMiddleRed from "../assets/pin_middle_red.png"
    import PinBigRed from "../assets/pin_big_red.png"
    import firebase from 'firebase'
    import axios from 'axios'

    export default {
        name: 'GoogleMaps',
        components: {Logo, SideBar, SearchBar},
        data() {
            return {
                currentLocation: {
                    lat: 47.370000,
                    lng: 8.542297
                },
                centeredLocation: {},
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
                eventMarker: {
                    valid: false
                },
                showSidebar: false,
                watchId: 0
            }
        },
        created() {
            this.getLocation();
        },
        beforeDestroy() {
            navigator.geolocation.clearWatch(this.watchId);
        },
        mounted() {
            this.getMarkers();
            this.changeMarker();
            this.centeredLocation = this.currentLocation;
        },
        methods: {
            locationChanged(location) {
                this.centeredLocation = location;
            },
            getLocation() {
                navigator.geolocation.getCurrentPosition((position) => {
                    this.currentLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    this.centeredLocation = this.currentLocation;
                    this.watchLocation();
                });
            },
            watchLocation() {
                const options = {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 0
                };
                this.watchId = navigator.geolocation.watchPosition(
                    (position) => {
                        this.currentLocation = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        };
                    },
                    () => {}, options);
            },
            getMarkers() {
                const ref = firebase.database().ref('events');
                const eventMarkers = [];
                const self = this;
                ref.orderByChild("litMeter").on("child_added", function (snapshot) {

                    let marker = snapshot.val();
                    axios.post('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + marker.position.lat + ',' + marker.position.lng + '&key=AIzaSyCDM_S_XXzHr9lWzesvLwBSNlssF9TQ9fc')
                        .then(response => {
                            marker.eventLocation = response.data.results[0].formatted_address;
                            const time = new Date(marker.time);
                            let minutes = time.getMinutes();
                            minutes = minutes < 10 ? '0' + minutes : minutes;
                            marker.time = time.getHours() + ":" + minutes;
                            eventMarkers.push(marker);
                            self.eventMarkers = eventMarkers;
                            self.$forceUpdate();
                        })
                        .catch(e => {
                            console.log(e)
                        });
                });
            },
            changeMarker() {
                const ref = firebase.database().ref('events');
                let changedMarker;
                const reef = this;
                //var markers = this.eventMarkers;
                ref.on("child_changed", function (snapshot) {
                    changedMarker = snapshot.val();

                    const name = changedMarker.name;
                    const index = reef.eventMarkers.findIndex(x => x.name === name);

                    axios.post('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + changedMarker.position.lat + ',' + changedMarker.position.lng + '&key=AIzaSyCDM_S_XXzHr9lWzesvLwBSNlssF9TQ9fc')
                        .then(response => {
                            changedMarker.eventLocation = response.data.results[0].formatted_address;
                            const time = new Date(changedMarker.time);
                            let minutes = time.getMinutes();
                            minutes = minutes < 10 ? '0' + minutes : minutes;
                            changedMarker.time = time.getHours() + ":" + minutes;
                            reef.eventMarkers[index] = changedMarker;
                            reef.$forceUpdate();
                        })
                        .catch(e => {
                            console.log(e)
                        });
                });
            },
            getIcon(attendance, litMeter) {
                //console.log("attendance: " + attendance + " litMeter:" + litMeter);
                if (litMeter <= 20) {
                    if (attendance <= 10) {
                        return PinSmall
                    } else if (attendance <= 20) {
                        return PinMiddle
                    } else {
                        return PinBig
                    }
                } else if (litMeter <= 40) {
                    if (attendance <= 10) {
                        return PinSmallBlue
                    } else if (attendance <= 20) {
                        return PinMiddleBlue
                    } else {
                        return PinBigBlue
                    }
                } else {
                    if (attendance <= 10) {
                        return PinSmallRed
                    } else if (attendance <= 20) {
                        return PinMiddleRed
                    } else {
                        return PinBigRed
                    }
                }
            },
            setEventData(index) {
                this.eventMarker = this.eventMarkers[index];
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