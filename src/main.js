import Vue from 'vue';
import App from './App.vue';
import router from './router';

import Element from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'element-ui/lib/theme-chalk/display.css';

Vue.use(Element, { size: 'small', zIndex: 3000 });



import {base} from './base';
Vue.use(base);

Vue.config.productionTip = false;

router.beforeEach((to, from, next) => {
    if (to.path === '/') {
        next({path: '/login'});
    } else {
        next();
    }
});

export const vueInstance = new Vue({
    router,
    render: h => h(App)
}).$mount('#app');
