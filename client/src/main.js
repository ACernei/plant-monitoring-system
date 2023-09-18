import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import CanvasJSChart from '@canvasjs/vue-charts';


import './index.css'

const app = createApp(App)
// app.use(ChartPlugin);

app.use(router)
app.use(CanvasJSChart); // install the CanvasJS Vuejs Chart Plugin

app.mount('#app')
