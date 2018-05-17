<template>
    <div id="sidebar" class="sidebar" v-on:click="setName" v-show="show">
        <div id="image" class="image"></div>
        <div class="namecontainer">
            <h2 id="name" style="padding: 3vh; margin: 0"></h2>
        </div>
        <div id="location"></div>
        <div id="website"></div>
        <div id="time"></div>
    </div>
</template>

<script>
    export default {
        name: "SideBar",
        data() {
            return {
                collapsed: true
            }
        },
        props: ["name", "location", "website", "time", "show"],
        created() {
          console.log(this.show);
        },
         methods: {
            setName() {
                document.getElementById("name").innerText = this.name;
                document.getElementById("location").innerHTML = '<i class="fas fa-map-marker-alt"></i>' + this.location;
                document.getElementById("website").innerHTML = '<i class="fas fa-globe"></i>' + this.website;
                document.getElementById("time").innerHTML = '<i class="fas fa-clock"></i>' + this.date;
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
        margin-bottom: 3vh;
    }
    .namecontainer {
        width: 100%;
        background-color: #16abe7;
    }
</style>