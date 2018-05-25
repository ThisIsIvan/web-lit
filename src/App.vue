<template>
    <div id="app">
        <google-maps></google-maps>
    </div>
</template>

<script>
    import GoogleMaps from './components/GoogleMaps.vue';

    export default {
        name: 'app',
        components: {
            GoogleMaps
        }
    }
</script>

<style>
    #app {
        /*font-family: 'Avenir', Helvetica, Arial, sans-serif;*/
        /*-webkit-font-smoothing: antialiased;*/
        /*-moz-osx-font-smoothing: grayscale;*/
        /*text-align: center;*/
        /*color: #2c3e50;*/
    }
</style>
