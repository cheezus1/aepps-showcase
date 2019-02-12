import Vue from "vue";
import Router from "vue-router";

import Index from "../screens/index/index.vue";
import Pending from "../screens/pending/pending.vue";
import Governance from "../screens/governance/governance.vue";
import NewAepp from "../screens/new_aepp/new_aepp.vue";

Vue.use(Router);

export default new Router({
  routes: [
    {
      name: "Index",
      path: "/",
      component: Index
    },
    {
      name: "Governance",
      path: "/governance",
      component: Governance
    },
    {
      name: "Pending",
      path: "/pending",
      component: Pending
    },
    {
      name: "NewAepp",
      path: "/new_aepp",
      component: NewAepp
    }
  ]
});
