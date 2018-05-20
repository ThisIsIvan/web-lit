<template>
    <div id="sidebar" class="sidebar" v-if="show">
        <div class="image"/>
        <div class="namecontainer">
            <h2 id="name" style="padding: 3vh; margin: 0"></h2>
        </div>

        <div class="iconcontainer"><i class="fas fa-map-marker-alt"></i></div>
        <div id="location" class="textcontainer"></div>

        <div class="iconcontainer"><i class="fas fa-globe"></i></div>
        <div class="textcontainer"><a id="website" href=""></a></div>

        <div class="iconcontainer"><i class="fas fa-clock"></i></div>
        <div id="time" class="textcontainer"></div>

        <img class="litbtn" src="../assets/lit_button.png" v-on:click="increaseLitMeter"/>
        <div class="litcontainer">UP-VOTE THE EVENT</div>
        <div id="votes" class="litcontainer" style="margin-bottom: 8vh"></div>

        <div class="ticketbtn" onclick="window.open('https://www.starticket.ch/de')"><i class="fas fa-ticket-alt"></i> TICKETS</div>
        <div class="routebtn"><i class="fas fa-compass"></i> ROUTE</div>
    </div>
</template>

<script>
    import firebase from 'firebase'
    import axios from 'axios'

    export default {
        name: "SideBar",
        data() {
            return {
            }
        },
        props: ["marker", "show"], //["name", "location", "website", "time", "litMeter", "show", "index"]
        updated: function() {
          this.setEventData();
        },
        destroyed: function() {
            document.getElementById("name").innerText = " ";
            document.getElementById("location").innerHTML = " ";
            document.getElementById("website").innerHTML = " ";
            document.getElementById("time").innerHTML = " ";
        },
         methods: {
            setEventData() {
                document.getElementById("name").innerText = this.marker.name;

                const coordinates = this.marker.position;
                var location = axios.post('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + coordinates.lat + ',' + coordinates.lng + '&key=AIzaSyCDM_S_XXzHr9lWzesvLwBSNlssF9TQ9fc')
                     .then(response => {
                         console.log(response.data);
                         location = response.data.results[0].formatted_address;
                    })
                    .catch(e => {
                        console.log(e)
                    });
                document.getElementById("location").innerText = location;
                document.getElementById("website").innerText = this.marker.url;
                document.getElementById("website").href = this.marker.url;

                const time = new Date(this.marker.time);
                let minutes = time.getMinutes();
                minutes = minutes< 10 ? '0'+minutes : minutes;
                document.getElementById("time").innerText = time.getHours()+":"+minutes;
                document.getElementById("votes").innerText = this.marker.litMeter + " Votes";

                // document.getElementById("name").innerText = this.name;
                // document.getElementById("location").innerText = this.location;
                // document.getElementById("website").innerText = this.website;
                // document.getElementById("website").href = this.website;
                // document.getElementById("time").innerText = this.time;
                // this.lit = this.litMeter;
                // document.getElementById("votes").innerText = this.lit + " Votes";
            },
            increaseLitMeter() {
                this.marker.litMeter++;
                document.getElementById("votes").innerText = this.marker.litMeter + " Votes";
                var ref = firebase.database().ref('events');
                console.log(ref.child(this.marker));
                ref.child(this.marker).update({
                    litMeter: this.marker.litMeter
                });

                // this.lit++;
                // document.getElementById("votes").innerText = this.lit + " Votes";
                // var ref = firebase.database().ref('events');
                // console.log(ref.child(this.index));
                // ref.child(this.index).update({
                //     litMeter: this.lit
                // });
            },

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
        background-image: url("../assets/flame.png");
        background-size: cover;
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
        width: 8vw;
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