<template>
<div>

<!-- <postCreateMobile v-show='smallView' :postData='postData'></postCreateMobile> -->
<postCreateDesktop :postData='postData'></postCreateDesktop>


</div>
</template>

<script>
const postCreateDesktop = () => import('./postCreateDesktop.vue')
import Dropzone from 'vue2-dropzone'
import axios from 'axios'
import { bus } from '../../main'

export default {
  components:{
    Dropzone,
    postCreateDesktop
  },
  data(){
    return{
      smallView:false,
      largeView:true,
      dialog:false,
      fullScreen:false,
      dz:false,
      upImage:false,
      upImageUrl:'',
      windowHeight:'',
      body:{
        drawer:true,
        colour:'blue-grey darken-3',
        title:'testing'
      },
      postData:{
        index:null,
        edit:false,
        postId:'',
        user:'',
        pop:false,
        fs:false,
        caption:'',
        post:false,
        image:'',
        active:false,
        dialog:true,
        onlycaption:false,
        font:'18px',
        pole:null
      }
    }
  },
  watch:{
    'postData.caption':function(i){
      i === ''?this.postData.active=false:this.postData.active=true;
      console.log(this.postData.active)
    },
    'postData.image':function(i){
      i === ''?this.postData.active=false:this.postData.active=true;
      console.log(this.postData.active)
    },
    'postData.pole':function(i){
      i !== null?this.postData.active = true:this.postData.active = false;
    },
    'postData.post':function(i){
      // data

      this.postData.caption.length < 20 ?this.postData.font = '40px':this.postData.caption.length < 40?this.postData.font = '28px': this.postData.font = '18px';

      // image pole
      this.postData.image === ''?this.postData.onlycaption = true : this.postData.onlycaption = false;

      // pole caption
      if(this.postData.pole !== null){

        this.postData.pole.imgs.length === 0?this.postData.onlycaption = true:this.postData.onlycaption = false;
      } 

      let data = {
          user:this.$store.getters.id,
          caption:this.postData.caption,
          image:this.postData.image,
          onlycaption:this.postData.onlycaption,
          font:this.postData.font,
          pole:this.postData.pole
        }
      //edting post
      if(this.postData.edit){

        axios.put(`${this.$store.state.server}user/post/${this.postData.postId}+${this.$store.getters.id}`,data,this.$store.getters.auth).then(r => {
          console.log('edited post',r.data)

          bus.$emit('post_updated',{post:r.data,index:this.postData.index})
          this.postData.pop = false;
          this.postData.fs = false;
          this.$store.commit('sn',{snac:'your post is updated!'})

        }).catch(e=>{console.log(e)})

        // creating new post
      }else{
        
        console.log('caption', this.postData.image)
        console.log(this.postData.font)
        axios.post(`${this.$store.state.server}user/post/${this.$store.getters.id}`,data,this.$store.getters.auth).then(r=> {
          if(r.data.error){

            this.$store.commit('sn',{context:'error',snac:r.data.error})
            console.log(r.data)
          }else{
            console.log(r.data);

            this.$socket.emit(`n_new_post`,r.data);


            //emiting event for other components
            bus.$emit('postCreated',r.data)
            this.postData.pop = false;
            this.postData.fs = false;
            this.postData.dialog = false;
            this.$store.commit('sn',{snac:'your post is live!'})

            //setting values to default
            this.postData.caption = '';
          }


        }).catch(e=>{
          console.log(e);
          this.$store.commit('sn',{context:'error',snac:'server error! try again'})
        })
    }
  }

  }, 
   mounted() {
    this.$nextTick(function() {
      window.addEventListener('resize', this.getWindowWidth);
      //Init
    })
  },
  methods:{
    // resposive swicher

    },
    created(){
      
      bus.$on('edit_post',(p)=> {
        this.postData.edit = true;
          this.postData.index = p.index;
          this.postData.caption = p.post.caption;
          this.postData.image = p.post.image;
          this.postData.postId = p.post._id;
        if(this.smallView){
          this.postData.fs = true;
        }else{
          this.postData.pop = true;
        }

      })


    }
}
</script>

<style>


.overflow{
  overflow: scroll;
  min-height: 0px;
  max-height: 300px;
}
.bottom{
  position: absolute;
}
</style>

