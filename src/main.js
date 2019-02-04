import Vue from 'vue'
import app from './App'
import router from './router'
import '@aeternity/aepp-components/dist/aepp.components.css'
import '@aeternity/aepp-components/dist/aepp.fonts.css'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(app)
}).$mount('#app')
