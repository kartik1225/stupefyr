<template>
<div>
<v-app>

<!-- to active use @click.stop='activate' method  -->
<!-- you have to send prop that chages the value all time -->

  <!-- as showen below -->
  
<!-- <div @click.stop='dialog = !dialog'>
<postImage :activate='dialog'></postImage> -->

<!-- image fullview is started -->
<v-dialog persistent v-model="fullImage" fullscreen transition="dialog-bottom-transition" :overlay='false'>
  <v-card class='black'>
  <div class="center">

<!-- image display centred -->
    <img src="/static/image.jpg" class="flexImage" @click='toolbar = !toolbar'/>

  </div>

  <!-- top toolbar to navigate and some action buttons -->
  <v-toolbar dark class='opacity black' v-show='toolbar'>

<!-- back -->
     <v-btn  icon @click.stop='goback'>
       <v-icon>arrow_back</v-icon>
     </v-btn>

     <v-spacer></v-spacer>

<!-- image/post_info -->
     <v-btn  icon  @click.stop='info = true'>
       <v-icon>info</v-icon>
     </v-btn>

<!-- download image -->
     <v-btn  icon @click.stop='fullImage = !fullImage'>
       <v-icon>file_download</v-icon>
     </v-btn>

<!-- dropdown menu -->

     <v-menu bottom >
          <v-toolbar-title slot="activator">
          <v-btn icon>
            <v-icon dark>more_vert</v-icon>
          </v-btn>
          </v-toolbar-title>
          <v-list>
            <v-list-tile >
              <v-icon>launch</v-icon>
              <v-list-tile-title v-text="'OPEN POST'"></v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
   </v-toolbar>

<!-- bottom navigation bar -->
  <div class='down opacity black'v-show='toolbar'>

    <v-layout aligne-center>
    <v-container  fluid style='height:64px'>
    <v-layout>
    <!-- left side content name and post type -->
    <p role='button' class="white--text">posted by <strong>{{post.user.name}}</strong> <v-icon style='font-size:15px;' class='white--text'>public</v-icon></p>
    </v-layout>
    </v-container>
    <v-spacer></v-spacer>
    <v-container  style='height:64px;'>
    <!-- like button and right side content -->
    <v-btn  dark icon style='margin-top:-10px; float:right;'>
      <v-icon>thumb_up</v-icon>
      </v-btn>
    </v-container>
    </v-layout>

  </div>

  <v-dialog v-model='info'>
    <v-card class='grey lighten-4'>
    <v-container grid-list-lg>
        <p>posted by: <strong>kartik</strong></p>
        <p>created at: <strong><timeago :since='post.created'></timeago></strong></p>
    </v-container>
    <v-card-actions>
    <v-spacer></v-spacer>
    <v-btn flat @click='info=false'>
      <v-icon class='green--text'>done</v-icon>
    </v-btn>
    </v-card-actions>
    </v-card>
  </v-dialog>
  
  </v-card>
</v-dialog>

</v-app>
</div>
</template>

<script>
import axios from 'axios'
export default{
  props:['full-image','post-id'],
  data(){
    return{
      test:'test',
      toolbar:true,
      post:null,
      info:false,
      image:null
    }
  },
  methods:{
    getPost(){
      axios.get(`${this.$store.state.server}one/post/${this.postId}`,this.$store.getters.auth).then(r => {
        console.log('fullimage data',r.data)
      }).catch(e=>{

      })
    }
  }
}
</script>

<style scoped>

.fixed{
  position: fixed;
}

.flexImage{
  max-height: 100%;
  max-width: 100%;
  width: auto;
  height: auto;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
}

.center{
  margin: auto;
}

.opacity{
  opacity: 0.7;
}

.overflow{
  max-width: 100px;
}
.down{
  position: absolute;
  bottom: 0;
  z-index: 10;
  width: 100%;
  height: 64px;
}


</style>
