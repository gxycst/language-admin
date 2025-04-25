import Vue from "vue";
import App from "./src/App.vue";
import router from "./src/router";
import 'normalize.css'
Vue.config.productionTip = false
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);
new Vue({
    router,
    render: h => h(App)
}).$mount("#app");