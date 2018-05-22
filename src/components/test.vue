<template>
<div>
<bodyTemplate :body='body' class='grey lighten-4'>
  <v-slide-y-transition>
  <router-view></router-view>
  </v-slide-y-transition>
<div class="top">
</div>
</bodyTemplate>
</div>
</template>

<script>
const profile = ()=> import('./profile/profile')
const bodyTemplate = ()=>import('./bodyTemplate')
import {bus} from '../main.js'
export default{
  components:{
    profile,
    bodyTemplate
  },
  data(){
    return{
      data:'test',
      body:{
        drawer:true,
        colour:'blue-grey darken-3',
        title:'profile',
        progress:false
      }
    }
  },
  methods:{
  },
  computed:{
    
  },
  created(){
    bus.$on('loading_on',(data)=>{
      this.body.progress = true
    })

    bus.$on('loading_off',(data)=>{
      setTimeout(()=>{this.body.progress = false},500)
    })
  }
}
</script>

<style>
.top{
  position: relative;
  top:0;

}

</style>
