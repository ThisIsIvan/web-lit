<template>
    <div class="container">
        <div class="speech" v-if="show">
            <img src="../assets/pin_short.png"/> 0 - 9 Going <br/>
            <img src="../assets/pin_middle.png"/> 10 - 19 Going <br/>
            <img src="../assets/pin_big.png"/> >20 Going
        </div>
        <img class="logo" src="../assets/icon_red.png" v-on:click="openContainer"/>
    </div>
</template>

<script>

    export default {
        name: "Logo",
        data() {
            return {
                show: false
            }
        },
        methods: {
            openContainer() {
                this.show = !(this.show);
            }
        }
    }
</script>

<style scoped>
    .container {
        position: fixed;
        top: 0%;
        right: 0%;
    }
    .logo{
        background-color: #ffffff;
        /*background-color: #002d7c;*/
        padding: 1em;
        border-radius: 50%;
        width: 7em;
        float: right;
        margin: 0.5em;
    }
    .speech {
        position: relative;
        /*background: #002d7c;*/
        background: #ffffff;
        border-radius: .4em;
        float: left;
        width: 25em;
        height: 10em;
        margin: 0.5em;
        margin-right: 2em;
        padding: 1em;
    }
    .speech:after {
        content: '';
        position: absolute;
        right: 0;
        top: 50%;
        width: 0;
        height: 0;
        border: 2em solid transparent;
        /*border-left-color: #002d7c;*/
        border-left-color: #ffffff;
        border-right: 0;
        margin-top: -2em;
        margin-right: -2em;
    }
</style>