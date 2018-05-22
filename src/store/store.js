import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import getters from './getters'
import mutations from './mutations'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
  	//snackbar
    context:'success',
    snackbar:false,
    snac:'vuex is good',
    userid:null,
    //server url
    server:'http://localhost:3000/',
    // tmdb api
    tmdb:'75dde4ee2f101b9992f81879454627fc'
  },
  getters,
  mutations
})