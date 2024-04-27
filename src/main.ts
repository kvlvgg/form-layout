import Vue from 'vue';
import App from './App.vue';
import Fragment from 'vue-fragment';
import '@/vue.prototype';

Vue.config.productionTip = false;
Vue.use(Fragment.Plugin);

/*
 * Autoimport components, name = filename - .vue
 */
const requireComponent = require.context('./components', true, /\.(vue|ts)$/);
requireComponent.keys().forEach((fileName: string) => {
    const componentConfig = requireComponent(fileName);
    const componentName = (<string>fileName.split('/').pop()).replace(/\.\w+$/, '');
    Vue.component(componentName, componentConfig.default || componentConfig);
});

new Vue({
    render: h => h(App),
}).$mount('#app');
