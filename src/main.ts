import './assets/css/index.css'

import { createApp } from 'vue'
import App from './App.vue'
//全局引入datav
import DataVVue3 from '@kjgl77/datav-vue3'


const app = createApp(App);

app.use(DataVVue3);
app.mount('#app');


// 设置重新加载页面的时间间隔，这里设置为每 1 小时（3600000 毫秒）
const reloadInterval = 18000000; 

setInterval(() => {
    location.reload();
}, reloadInterval);