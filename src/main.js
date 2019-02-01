import Vue from "vue";
import App from "./App.vue";
import Components from "@aeternity/aepp-components";
import BootstrapVue from "bootstrap-vue";
import "@aeternity/aepp-components/dist/aepp.components.css";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

Vue.use(BootstrapVue);
Vue.use(Components);

new Vue({
  el: "#app",
  render: h => h(App)
});
