import './assets/css/index.css'

import { createApp } from 'vue'
import App from './App.vue'
//全局引入datav
import DataVVue3 from '@kjgl77/datav-vue3'


const app = createApp(App);

app.use(DataVVue3);
app.mount('#app');
