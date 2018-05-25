<template>
    <div id="sidebar" class="sidebar" v-if="show">
        <div class="image">
            <img class="image" :src="marker.image" style="height: 100%"/>
        </div>
        <div class="namecontainer">
            <h2 id="name" style="padding: 3vh; margin: 0">{{marker.name}}</h2>
        </div>

        <div class="iconcontainer"><i class="fas fa-map-marker-alt"></i></div>
        <div id="location" class="textcontainer">{{marker.eventLocation}}</div>

        <div class="iconcontainer"><i class="fas fa-globe"></i></div>
        <div class="textcontainer"><a id="website" href="">{{marker.url}}</a></div>

        <div class="iconcontainer"><i class="fas fa-clock"></i></div>
        <div id="time" class="textcontainer">{{marker.time}}</div>

        <button class="litbtn" :disabled=!this.canVote v-on:click="increaseLitMeter">
            <img v-if="this.canVote" src="../assets/lit_button.png" style="width: 8vw"/>
            <img v-else src="../assets/lit_button_disabled.png" style="width: 8vw" v-bind:title="this.errorMessage"/>
        </button>
        <div class="litcontainer">UP-VOTE THE EVENT</div>
        <div id="votes" class="litcontainer" style="margin-bottom: 5em">{{marker.litMeter}} Votes</div>

        <div class="ticketbtn" onclick="window.open('https://www.starticket.ch/de')"><i class="fas fa-ticket-alt"></i>
            TICKETS
        </div>
        <div class="routebtn"><i class="fas fa-compass"></i> ROUTE</div>
    </div>
</template>

<script>
    import      firebase from 'firebase';
    import geolib from 'geolib';
    import GoogleMaps from "./GoogleMaps";
    import {has as _has} from 'lodash';

    const MAX_DISTANCE = 1000;
    const ERROR_VOTED = 'You can only vote once!';
    const ERROR_DISTANCE = 'You must be within ' + MAX_DISTANCE + 'm of the event!';
    const ERROR_BOTH = ERROR_VOTED + '\n' + ERROR_DISTANCE;

    export default {
        name: "SideBar",
        components: {GoogleMaps},
        data() {
            return {
                withinAllowedDistance: false,
                errorMessage: '',
                votedMarkers: []
            }
        },
        updated() {
            this.updateCanVote();
            this.updateErrorMessage();
        },
        watch: {
            currentLocation() {
                this.checkDistance();
            },
            marker() {
                this.checkDistance();
            }
        },
        props: ["marker", "show", "currentLocation"],
        computed: {
            canVote() {
                return this.withinAllowedDistance && !this.hasVotedForCurrentEvent;
            },
            hasVotedForCurrentEvent() {
                return this.votedMarkers.includes(this.marker.id);
            }
        },
        methods: {
            increaseLitMeter() {
                this.updateCanVote();

                if (!this.canVote) {
                    this.withinAllowedDistance = false;
                    console.log("User is too far away from event!");
                    return;
                }

                this.withinAllowedDistance = true;

                this.marker.litMeter++;
                const ref = firebase.database().ref('events/' + this.marker.id);

                ref.update({
                    litMeter: this.marker.litMeter
                });

                this.votedMarkers.push(this.marker.id);
                this.updateCanVote();
            },
            checkDistance() {
                if (!this.currentLocation || !_has(this.marker, 'position')) {
                    return;
                }

                const currentLocation = {latitude: this.currentLocation.lat, longitude: this.currentLocation.lng};
                const eventLocation = {latitude: this.marker.position.lat, longitude: this.marker.position.lng};
                const distance = this.calculateDistance(currentLocation, eventLocation);

                this.withinAllowedDistance = distance <= MAX_DISTANCE;
                this.updateCanVote();
            },
            calculateDistance(coordinatesA, coordinatesB) {
                return geolib.getDistance({
                    latitude: coordinatesA.latitude,
                    longitude: coordinatesA.longitude
                }, {latitude: coordinatesB.latitude, longitude: coordinatesB.longitude});
            },
            updateCanVote() {
                if (!this.canVote) {
                    this.updateErrorMessage();
                }
            },
            updateErrorMessage() {
                if (!this.withinAllowedDistance && this.hasVotedForCurrentEvent) {
                    this.errorMessage = ERROR_BOTH;
                } else if (!this.withinAllowedDistance) {
                    this.errorMessage = ERROR_DISTANCE;
                } else if (this.hasVotedForCurrentEvent) {
                    this.errorMessage = ERROR_VOTED;
                }
            }
        }
    }
</script>

<style>
    .sidebar {
        position: absolute;
        left: 0%;
        top: 0%;
        height: 100%;
        width: 50vh;
        background-color: #ffffff;
        overflow-y: auto;
        overflow-x: hidden;
    }

    .image {
        width: 100%;
        height: 11em;
    }

    .namecontainer {
        max-width: 100%;
        color: #ffffff;
        background-color: #002d7c;

    }

    .iconcontainer {
        float: left;
        margin-left: 1em;
        margin-top: 0.8em;
        color: #002d7c;
    }

    .textcontainer {
        margin-left: 3em;
        margin-top: 0.8em;
        max-width: 100%;
        word-break: break-word;
    }

    .litbtn {
        display: block;
        margin-left: auto;
        margin-right: auto;
        margin-top: 4em;
        border: Transparent;
        background: Transparent;
    }

    .litcontainer {
        width: 100%;
        text-align: center;
        color: #838383;
    }

    .ticketbtn {
        margin-left: 1em;
        margin-bottom: 1em;
        float: left;
        width: 40%;
        height: 3em;
        background-color: #002d7c;
        color: #ffffff;
        line-height: 3em;
        text-align: center;
    }

    .routebtn {
        margin-right: 1em;
        margin-bottom: 1em;
        float: right;
        width: 40%;
        height: 3em;
        background-color: #002d7c;
        color: #ffffff;
        line-height: 3em;
        text-align: center;
    }
</style>