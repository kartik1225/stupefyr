// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuetify from 'vuetify'
import App from './App'
import router from './router'
import {store} from './store/store'
import Croppa from 'vue-croppa'
import VueSocketio from 'vue-socket.io';
import VueTimeago from 'vue-timeago'
import InfiniteLoading from 'vue-infinite-loading';
import test from './plugin/test'
import axios from 'axios'
import helper from './plugin/helper'
import Vibrant from 'node-vibrant'
import vuescroll from 'vue-scroll'
import moment from 'vue-moment';

Vue.use(moment) 
Vue.use(test)
Vue.use(InfiniteLoading)
Vue.use(Croppa) 
Vue.use(Vuetify)
Vue.use(VueSocketio,'http://localhost:3000')
Vue.use(VueTimeago, {
  name: 'timeago', // component name, `timeago` by default
  locale: 'en-US',
  locales: {
    // you will need json-loader in webpack 1
    'en-US': require('vue-timeago/locales/en-US.json')
  }
})
Vue.use(vuescroll)



Vue.prototype.$axios = axios;

Vue.config.productionTip = false

export const bus = new Vue();

Vue.prototype.$bus = bus;

Vue.prototype.$txtRe = helper.txtRe;

Vue.prototype.$inView = helper.inView;

Vue.prototype.$vb =(img)=>{
    if(img){
      Vibrant.from(img).getPalette((err, palette) => {
        return palette
      })
    }else{
      return null
    }
  }

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  router,
  store
})
