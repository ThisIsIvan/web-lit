import Vue from 'vue'
import App from './App.vue'
import * as VueGoogleMaps from 'vue2-google-maps'
import VueGeolocation from 'vue-browser-geolocation';

Vue.config.productionTip = false

Vue.use(VueGoogleMaps, {
    installComponents: true,
    load: {
        key: 'AIzaSyCDM_S_XXzHr9lWzesvLwBSNlssF9TQ9fc',
        libraries: 'places'
    }
});

Vue.use(VueGeolocation);

new Vue({
    render: h => h(App)
}).$mount('#app')
