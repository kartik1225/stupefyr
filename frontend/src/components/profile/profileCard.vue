<template>
<div>
    <v-container row v-bind="{ [`grid-list-${size}`]: true }">
    <v-layout row wrap>
    <template v-for='list in lists'>
    <v-flex xs6 sm4 md3>
    <v-card hover>
    <v-container fluid>
    <v-layout column  >
      <img :src="list.img" style="width:80px; height:80px;" class="profile" ><br>
      <p class="title" style="margin:auto">{{list.name}}</p>
    </v-layout>
    </v-container>
    <v-divider></v-divider>
    <v-card-actions>
      <v-btn flat class='white black--text' style='margin:auto;'>follow</v-btn>
    </v-card-actions>
    </v-card>
    </v-flex>
    </template>
    </v-layout>
    </v-container>
</div>
</template>

<script>
import {bus} from '../../main.js'

export default {
  components:{

  },
  data(){
    return{
      data:'data',
      size:'lg',
      lists:[
      {name:'kartik',img:'/static/image.jpg'},
      {name:'kartik',img:'/static/image.jpg'},
      {name:'kartik',img:'/static/image.jpg'},
      {name:'kartik',img:'/static/image.jpg'},{name:'kartik',img:'/static/image.jpg'},{name:'kartik',img:'/static/image.jpg'},{name:'kartik',img:'/static/image.jpg'},{name:'kartik',img:'/static/image.jpg'},{name:'kartik',img:'/static/image.jpg'},{name:'kartik',img:'/static/image.jpg'},{name:'kartik',img:'/static/image.jpg'},{name:'kartik',img:'/static/image.jpg'},{name:'kartik',img:'/static/image.jpg'},{name:'kartik',img:'/static/image.jpg'},{name:'kartik',img:'/static/image.jpg'},{name:'kartik',img:'/static/image.jpg'},{name:'kartik',img:'/static/image.jpg'},{name:'kartik',img:'/static/image.jpg'},{name:'kartik',img:'/static/image.jpg'}
    ]
    }
  },
  mounted(){
    this.$nextTick(function() {
      window.addEventListener('resize', this.getWindowWidth);
      //Init
      this.getWindowWidth()
    })
  },
  methods:{
    getWindowWidth(event) {
            this.windowHeight = document.documentElement.clientWidth;

            parseInt(this.windowHeight)
            // xs
            if(this.windowHeight < 576){
                this.size = 'sm'
            }

            // sm
            if(this.windowHeight < 768){

                this.size = 'sm'
            }

            // md
            if(this.windowHeight > 992){
              this.size = 'md'
            }
    }

  },
  beforeCreate(){
    bus.$emit('loading_on',true)
  },
  mounted(){
    bus.$emit('loading_off',false)
  }
}
</script>

<style>
.profile{
    background-repeat: no-repeat !important;
    background-position: 50% !important;
    border-radius: 50% !important;
    width: 100px !important;
    height: 100px !important;
    margin: auto;
}


</style>
