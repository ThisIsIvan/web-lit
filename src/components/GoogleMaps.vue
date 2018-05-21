<template>
    <div>
        <search-bar v-on:current-location-changed="locationChanged"></search-bar>
        <GmapMap :center="currentLocation"
                 :options="mapOptions"
                 v-on:click="closeSideBar"
                 class="map">
            <GmapMarker :position="locationMarkerPosition"
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
                  :show="showSidebar"></side-bar>
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
    import PinBlue from "../assets/pin_big_blue.png"
    import PinRed from "../assets/pin_big_red.png"
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
                //console.log('event', location);
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
            getMarkers() {
                const ref = firebase.database().ref('events');
                const eventMarkers = [];
                ref.orderByChild("litMeter").on("child_added", function (snapshot) {
                    console.log(snapshot.val().litMeter);
                    let marker = snapshot.val();
                    axios.post('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + marker.position.lat + ',' + marker.position.lng + '&key=AIzaSyCDM_S_XXzHr9lWzesvLwBSNlssF9TQ9fc')
                        .then(response => {
                            marker.eventLocation = response.data.results[0].formatted_address;
                            const time = new Date(marker.time);
                            let minutes = time.getMinutes();
                            minutes = minutes < 10 ? '0' + minutes : minutes;
                            marker.time = time.getHours() + ":" + minutes;
                            eventMarkers.push(marker);
                        })
                        .catch(e => {
                            console.log(e)
                        });
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
                    //console.log(snapshot.val());
                    const name = changedMarker.name;
                    const index = reef.eventMarkers.findIndex(x => x.name === name);
                    reef.eventMarkers[index] = changedMarker;
                    reef.$forceUpdate();
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
                    return PinBlue
                } else {
                    return PinRed
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