import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Vue from 'vue'
import axios from 'axios'
import deeplink from '@/router/deeplink'
import {ipcRenderer} from 'electron';
import locale from 'element-ui/lib/locale/lang/nl'


import App from './App.vue'
import router from './router'
import store from './store'

import Raven from 'raven-js';
// import RavenVue from 'raven-js/plugins/vue';
// Raven
//     .config('https://5ad90cc5806d47f98270c1d39783a007@sentry.io/257702')
//     .addPlugin(RavenVue, Vue)
//     .install();

Raven.context(function () {
    Vue.use(ElementUI, {locale});

    if (!process.env.IS_WEB) Vue.use(require('vue-electron'));

    // TODO get bearer token from somewhere
    // axios.defaults.headers.common['Authorization'] = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjM0NjJkNmY5MTE1YjQyNTU1OTFhMTE0MGFmMjdiMmIzMDVhNDY4ZmM5NTJmNmRiZTNiZmQ1ODdlNDQ0ODFmYjY0NTlmMWYxNmU3MTBlZWZkIn0.eyJhdWQiOiIxIiwianRpIjoiMzQ2MmQ2ZjkxMTViNDI1NTU5MWExMTQwYWYyN2IyYjMwNWE0NjhmYzk1MmY2ZGJlM2JmZDU4N2U0NDQ4MWZiNjQ1OWYxZjE2ZTcxMGVlZmQiLCJpYXQiOjE0OTI2MTMxMjcsIm5iZiI6MTQ5MjYxMzEyNywiZXhwIjoxODA4MTQ1OTI3LCJzdWIiOiIxIiwic2NvcGVzIjpbXX0.EpL9SFX4ay33AeqWC7ePwzLkNTx0ZFya8A0uqkUGtTOG1r47Nu2p2F6ovp3qlY0bzNiiyl2RnA5Ow6vDa5awVSjh0C3UvjFojCA1yckgtVD9j_tQHo5rnFLYYT5u27SkzSE6jVYnZCSpBiOMEMCrdBFPnDrXLw11SUNOdJ2bJF0FTHjHjBAzcePFhqMYlyBWgwj4vHVndxjogVLvIF-1xCTzDfDm0nnui5SdxcZnj7Pozsnoe_Hkh_T9z8W2JfNfe3EmUITAWjgpMBwyfUQjwr49U5VFhq-mim_HGK5kX_dLjgnhSA7owOqLp7uuKNHSVX6CqHed-FRvuGmSnDbIGUz11vy7j-NR9479gMnE9zHg_Jjqe6s1opiuM5-O9ZWHgdT4kVVsv34KgVQHQl5k6DwbYjAeEWqaLN_QMHT3pwf6JAVHbSIbeYu9XtQu7wuR47GQmexbURoxxZHDK6m3K1kaXs7IbZqqUMs-43Mk6y0cN6Zi--DJTTdU2wNvx5LYwwCB3mbDlAonnvP4_wUF5pwJZQYoTkmyYD3Iy8APeYy-huNL0W7u868__8cp1gMQLyVXLDHsExGbwuwO4xYQ88HWdYjRwFzEMu6fId7VTbp3Qjbpudy1dQk7B4PM7dKIP-X_sPenE_w3jd1Hx0NT2NrutuNDJJgX8YP0to1rrV8';

    Vue.http = Vue.prototype.$http = axios;
    Vue.config.productionTip = false;

    /* eslint-disable no-new */
    new Vue({
        components: { App },
        router,
        store,
        template: '<App/>'
    }).$mount('#app');

    ipcRenderer.on('open-url', (event, arg) => {
        deeplink.matchIfNeeded( arg, router );
    });
    deeplink.matchIfNeeded( ipcRenderer.sendSync('get-deeplink'), router );

    window.router = router;
});