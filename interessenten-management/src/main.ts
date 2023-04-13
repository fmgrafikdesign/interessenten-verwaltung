import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import './assets/main.css'
import {VueFire, VueFireAuth} from "vuefire";
import {firebaseApp} from "@/firebase";
import {getAuth, onAuthStateChanged} from "firebase/auth";

const app = createApp(App)

app.use(createPinia())
app.use(router)
app
    .use(VueFire, {
        // imported above but could also just be created here
        firebaseApp,
        modules: [
            // we will see other modules later on
            VueFireAuth(),
        ],
    })

const auth = getAuth();
onAuthStateChanged(auth, (user) => {
    if (user) {
        router.push({ name: 'index' });
    } else {
        router.push({ name: 'login' });
    }
});

app.mount('#app')
