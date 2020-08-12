import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import Vcomp from './components/index'
import ElementUI from 'element-ui'

import '@/assets/styles/global.scss'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/styles/element-variables.scss'
import '@/assets/styles/common.scss'

Vue.use(Vcomp)
Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')