<template>
    <div id="app">
        <!--<HelloWorld msg="Welcome to Your Vue.js App"/>-->
        <google-maps></google-maps>
    </div>
</template>

<script>
    import HelloWorld from './components/HelloWorld.vue';
    import GoogleMaps from './components/GoogleMaps.vue';

    export default {
        name: 'app',
        components: {
            HelloWorld,
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
