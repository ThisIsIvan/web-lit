import Vue from 'vue'
import App from './App.vue'
import * as VueGoogleMaps from 'vue2-google-maps'
import VueGeolocation from 'vue-browser-geolocation';
import firebase from 'firebase'

Vue.config.productionTip = false

Vue.use(VueGoogleMaps, {
    installComponents: true,
    load: {
        key: 'AIzaSyCDM_S_XXzHr9lWzesvLwBSNlssF9TQ9fc',
        libraries: 'places'
    }
});

Vue.use(VueGeolocation);

var config = {
    apiKey: "AIzaSyBtMonQpoR2RxMu59pyIb1pweQdUv28OaQ",
    authDomain: "web2-203208.firebaseapp.com",
    databaseURL: "https://web2-203208.firebaseio.com",
    projectId: "web2-203208",
    storageBucket: "web2-203208.appspot.com",
    messagingSenderId: "991155619858"
};
firebase.initializeApp(config);

new Vue({
    render: h => h(App)
}).$mount('#app')
