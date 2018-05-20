<template>
    <div class="container">
        <img src="../assets/icon_red.png"/>
        <!--<div v-show="this.show">AAAA</div>-->
    </div>
</template>

<script>

    export default {
        name: "Logo",
        data() {
            this.show = true;
        },
        methods: {
            openContainer() {
                console.log(this.show);
                this.show = !(this.show);
            }
        }
    }
</script>

<style scoped>
    .container {
        position: absolute;
        top: 0%;
        right: 0%;
    }
    img{
        /*background-color: #ffffff;*/
        background-color: #002d7c;
        padding: 1em;
        border-radius: 50%;
        width: 7em;
    }
</style>