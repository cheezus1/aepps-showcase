import Vue from "vue";
import app from "./App";
import router from "./router";
import "@aeternity/aepp-components/dist/aepp.components.css";
import "@aeternity/aepp-components/dist/aepp.fonts.css";
import Notifications from "vue-notification";

Vue.use(Notifications);

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(app)
}).$mount("#app");
