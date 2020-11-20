import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import components from './components/index';
import MenuModule from './store/modules/menu';
import Component from 'vue-class-component';
Component.registerHooks(['beforeRouteEnter', 'beforeRouteUpdate']);
Vue.use(ElementUI);
Vue.use(components);
Vue.config.productionTip = false;
Vue.directive('power', {
  inserted(el, binding) {
    if (!MenuModule.btnList.includes(binding.value)) {
      if (el.parentNode) {
        el.parentNode.removeChild(el);
      }
    }
  }
});
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
