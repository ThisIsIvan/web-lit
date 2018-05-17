<template>
    <div id="sidebar" class="sidebar" v-show="show">
        <div id="image" class="image"></div>
        <div class="namecontainer">
            <h2 id="name" style="padding: 3vh; margin: 0"></h2>
        </div>
        <div class="iconcontainer"><i class="fas fa-map-marker-alt"></i></div>
        <div id="location" class="textcontainer"></div>
        <div class="iconcontainer"><i class="fas fa-globe"></i></div>
        <div id="website" class="textcontainer"></div>
        <div class="iconcontainer"><i class="fas fa-clock"></i></div>
        <div id="time" class="textcontainer"></div>
        <img class="litbtn" src="../assets/lit_button.png" v-on:click="increaseLitMeter"/>
        <div class="litcontainer">UP-VOTE THE EVENT</div>
        <div id="votes" class="litcontainer" style="margin-bottom: 8vh"></div>
        <div class="ticketbtn"><i class="fas fa-ticket-alt"></i> TICKETS</div>
        <div class="routebtn"><i class="fas fa-compass"></i> ROUTE</div>
    </div>
</template>

<script>

    export default {
        name: "SideBar",
        data() {
            return {
                lit: 0
            }
        },
        props: ["name", "location", "website", "time", "litMeter", "show"],
        updated: function() {
          this.setEventData();
        },
        destroyed: function() {
            document.getElementById("name").innerText = " ";
            document.getElementById("location").innerHTML = " ";
            document.getElementById("website").innerHTML = " ";
            document.getElementById("time").innerHTML = " ";
            this.collapsed = false;
        },
         methods: {
            setEventData() {
                document.getElementById("name").innerText = this.name;
                document.getElementById("location").innerText = this.location;
                document.getElementById("website").innerText = this.website;
                document.getElementById("time").innerText = this.time;
                this.lit = this.litMeter;
                document.getElementById("votes").innerText = this.lit + " Votes"
            },
            increaseLitMeter() {
                this.lit++;
                document.getElementById("votes").innerText = this.lit + " Votes"
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
    }
    .image {
        width: 100%;
        height: 25vh;
        background-image: url("../assets/flame.png");
    }
    .namecontainer {
        width: 100%;
        color: #ffffff;
        background-color: #002d7c;
    }
    .iconcontainer {
        float: left;
        margin-left: 2vh;
        margin-top: 2vh;
        color: #002d7c;
    }
    .textcontainer {
        margin-left: 7vh;
        margin-top: 2vh;
    }
    .litbtn {
        display: block;
        margin-left: auto;
        margin-right: auto;
        margin-top: 8vh;
        width: 15vh;
    }
    .litcontainer {
        width: 100%;
        text-align: center;
        color: #838383;
    }
    .ticketbtn {
        margin-left: 2vh;
        float: left;
        width: 40%;
        height: 7vh;
        background-color: #002d7c;
        color: #ffffff;
        line-height: 7vh;
        text-align: center;
    }
    .routebtn {
        margin-right: 2vh;
        float: right;
        width: 40%;
        height: 7vh;
        background-color: #002d7c;
        color: #ffffff;
        line-height: 7vh;
        text-align: center;
    }
</style>