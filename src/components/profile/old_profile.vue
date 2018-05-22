<template>


<v-app >

<!-- main page content start here -->
<v-container grid-list-md>
<v-layout row-md column child-flex-md>

<!-- user profile content (stickey) -->
<v-flex xs12 md4  >
<div class="fixed">
<v-card class='white'>

<!-- profile cover upload -->
<div v-show='cvb.image'>
  <v-btn icon v-show='cvb.done' @click='finalcover' class='elevation-2 white' style='position:absolute; right:0px; '>
    <v-icon class='green--text'>done</v-icon>
  </v-btn>
  <v-btn icon v-show='!cvb.done' @click='cvb.image = false' class='elevation-2 white' style='position:absolute; right:0px; '>
    <v-icon class=''>cancel</v-icon>
  </v-btn>

  <croppa v-model="myCroppa"  :width="640" class="croppa"
                          :height="398" :disable-scroll-to-zoom="true"
                          :prevent-white-space="true"
                          @file-choose='cover'
                          :input-accept="'image/*'"
                          name='file'
                          :show-remove-button="false"
                          style='height:100%'
                          >
  </croppa>
</div>

<!-- profile cover dialog -->
<v-dialog persistent v-model='Pcover'>
  <v-card>
    <v-container>
      <v-list>
      <!-- edit -->
        <v-list-tile @click='cvb.image = true , Pcover = false'>
          <v-icon>edit</v-icon>
          <v-list-tile-title v-html='"edit cover"'>
          </v-list-tile-title>
        </v-list-tile>
        <v-divider></v-divider>
        <!-- show fullimage -->
        <v-list-tile @click='showCover'>
          <v-icon>image</v-icon>
          <v-list-tile-title v-html='"show cover"'>
          </v-list-tile-title>
        </v-list-tile>
        <v-divider></v-divider>
        <!-- cancel -->
        <v-list-tile @click='Pcover = false'>
          <v-icon>cancel</v-icon>
          <v-list-tile-title v-html='"cancel"'>
          </v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-container>
  </v-card>
</v-dialog>
<!-- end -->


<!-- {{$store.state.server+'picture/low/'+user.image}} -->

<div v-show='!cvb.image'>
  <img @click='Pcover = true' role='button' :src="`${this.$store.state.server}picture/${user.cover}`" style="width:100%;" />
</div>


<v-container fluid  >


<!-- profile cover dialog -->
<v-dialog persistent v-model='Pprofile' width='500px'>
  <v-card>
    <v-container>
      <v-list v-if='edPro'>
      <!-- edit -->
        <v-list-tile @click='edPro = !edPro'>
          <v-icon>edit</v-icon>
          <v-list-tile-title v-html='"edit profile image"'>
          </v-list-tile-title>
        </v-list-tile>
        <v-divider></v-divider>
        <!-- show fullimage -->
        <v-list-tile @click='showCover'>
          <v-icon>image</v-icon>
          <v-list-tile-title v-html='"show profile image"'>
          </v-list-tile-title>
        </v-list-tile>
        <v-divider></v-divider>
        <!-- cancel -->
        <v-list-tile @click='Pprofile = false'>
          <v-icon>cancel</v-icon>
          <v-list-tile-title v-html='"cancel"'>
          </v-list-tile-title>
        </v-list-tile>
      </v-list>
      <div v-show='!edPro'>
      <v-btn  icon @click='edPro = !edPro'>
        <v-icon>arrow_back</v-icon>
      </v-btn>
      <setProfile ></setProfile>
      </div>
    </v-container>
  </v-card>
</v-dialog>
<!-- end -->



<!-- profile image -->
  <v-layout  justify-center >
  <img role='button' @click='Pprofile = true' :src='`${this.$store.state.server}picture/${user.image}?q=low`' class='circal elevation-2' style='margin-top:-100px;z-index:10;' />
  </v-layout>

<!-- user profile name  -->
  <br><p class="text-xs-center headline">{{user.name}}</p>

<!-- user followers and following & counting -->
  <v-layout>
    <v-flex xs6>
      <p class="subheading text-xs-center">followers</p>
      <p class="subheading text-xs-center ">{{user.followers.length}}</p>
    </v-flex>
    <v-flex xs6>
      <p class="subheading text-xs-center">following</p>
      <p class="subheading text-xs-center ">{{user.followings.length}}</p>
    </v-flex>
</v-layout>

<!-- user follow buttuns -->
<v-layout  justify-center>
</v-layout>

</v-container>
</v-card>
</div>
</v-flex>


<!-- user posts , user posted images , sharred and tagend posts -->
<v-flex xs12 md8 >
<v-tabs light fixed icons centered scrollable @input='activeTAb' v-model='aTab'>
    <v-tabs-bar slot="activators" class="transparent">

      <v-tabs-slider class="black"></v-tabs-slider>

      <!-- all tabs -->
      <v-tabs-item href="#post" >
        <v-icon>phone</v-icon>
        posts
      </v-tabs-item>
      <v-tabs-item href="#photos">
        <v-icon>favorite</v-icon>
        photos
      </v-tabs-item>
      <v-tabs-item href="#taged">
        <v-icon>account_box</v-icon>
        taged
      </v-tabs-item>
    </v-tabs-bar>

<!-- posts tab :~ all user's posts created will be here -->
    <v-tabs-content
      id="post">

        <v-flex xs12 md8 offset-md3>

        <br>
        <router-view name='postCreater'></router-view>
        <br>
        <router-view name='post' :posts='posts' :noPost='noPost'></router-view>
        </v-flex>

    </v-tabs-content>

<!-- photos tab :~ all user's pictures will be here -->
    <v-tabs-content
      id="photos">
      <v-flex offset-md1>
      <router-view name='postPhotos' :posts='pics'></router-view>
      </v-flex>
    </v-tabs-content>

<!-- tagged tab :~ user's tagged posts will be here -->
    <v-tabs-content id='taged'>   
    <router-view></router-view>
    </v-tabs-content>

  </v-tabs>

</v-flex>
</v-layout>
</v-container>
</v-app>


</template>

<script>
import post from '../post/post.vue'
import bodyTemplate from '../bodyTemplate.vue'
import axios from 'axios'
import Dropzone from 'vue2-dropzone'
import {bus} from '../../main'
const postCreater = ()=> import('../post/postCreater')
const profileCard = ()=> import('./profileCard')
const setProfile = ()=> import('./setProfile')


export default {

  components:{
    bodyTemplate,
    Dropzone,
    post,
    postCreater,
    profileCard,
    setProfile
  },
  data(){
    return {
      dialog:false,
      edPro:true,
      Pcover:false,
      Pprofile:false,
      dialog1:false,
      test:true,
      coverRemove:false,
      myCroppa:null,
      coverImg:'',
      aTab:'post',
      posts:[],
      noPost:false,
      pics:[],
      propic:'',
      user:'',
      cvb:{
        done:false,
        edit:true,
        image:false
      }
    }
  },
  watch:{
    'coverImg':function(i){

    }
  },
  methods:{
    onScroll:function(e,p){
      console.log(p)
      console.log(e)
    },
    showCover(){
     this.$store.commit('sn',{snac:'not working rightnow'})
    },
    cover:function(data){
      this.coverRemove = true;
      console.log(data);
      this.cvb.done = true;
    },
    finalcover(){
      const orignal =this.myCroppa.getChosenFile();
      // getting current visible aria blob
      this.myCroppa.generateBlob((blob) => {
        const orignal =this.myCroppa.getChosenFile()
        const data = new FormData()
          data.append("file", blob ,orignal.name);

            // savig current image to database 
                axios.post(`${this.$store.state.server}picture/upload`,data,{
                headers: {
                  'Content-Type': 'multipart/form-data'
                }
              }).then(r=>{
                      this.coverImg = r.data.imageId;
                      // getting values from localStoreage
                      const put = {
                        cover:this.coverImg,
                        user:this.$store.getters.id
                      }

                      // setting Authorization of use
                      const auth = {
                        headers:{ Authorization : this.$store.getters.token}
                      }

                      //updating user image profile to database
                      axios.put(`${this.$store.state.server}one/user/edit/post`,put,auth).then(r=>{
                        console.log(r.data)
                        this.user = r.data;
                        this.cvb.image =false;
                        this.cvb.done = false;
                        // notifying user
                        setTimeout(()=>{
                          this.$store.commit('sn',{snac:'cover image updated'})
                        },500)
                      }).catch(e=>{
                        //server error
                        console.log(e)
                        this.$store.commit('sn',{snac:'server error , try again',context:'error'})
                      })

                }).catch(e=>{
                  //server error
                  console.log(e)
                  this.$store.commit('sn',{snac:'server error , try again',context:'error'})
                })

      }, orignal.type) 
      // axios.put(`${this.$store.state.server}one/user/edit/post`,{data:'data'},this.$store.getters.auth).then(r => {
      //   console.log(r.data);
      // })
    },
    showSuccess:function(data,file){
     console.log(data)
    },
    activeTAb(a){
      this.$router.push('/profile/'+a)
      this.aTab = a

    }
   },
   computed:{

   },
   beforeCreate(){
    this.$store.getters.user.then(u=> {
      this.user = u.data;

    })
   },
   created(){
    // tab changing behaviour in tabs and routers
    var parts = window.location.pathname.split("/");
    var result = parts[parts.length - 1];
    setTimeout(()=>{
    this.aTab = result;
    },500)

    axios.get(`${this.$store.state.server}user/pictures/${this.$store.getters.id}`,this.$store.getters.auth).then(r => {
      r.data.map(d =>{
        this.pics.push(d);
      })
    })

    // showing user likes
    bus.$on('postfeed',d => {
        console.log(d)
        axios.get(`${this.$store.state.server}user/post/${this.$store.getters.id}/${d.start}`,this.$store.getters.auth).then(r => {

          if(r.data){
            r.data.map(data=>{
              this.posts.push(data);
              data.likes.map(l=>{
                // console.log(l)
                l.user === this.$store.getters.id?(data.liked = true,console.log(l)) : console.log('not liked')
              })

            })
          }else{
            this.noPost = true;
          }
          }).catch(e =>{
            console.log(e);
          })

    })


    bus.$on('profilePic_updated',(resp =>{
      this.Pprofile=false
      this.user = resp;
      this.edPro = true;
      console.log('resp',resp)
    }))

    
   }

}
</script>

<style scoped>

.circal{
    background-repeat: no-repeat;
    background-position: 50%;
    border-radius: 50%;
    width: 150px;
    height: 150px;
}

.card {
    /*margin-top: -85px;*/
  }

.card--flex-toolbar {
    margin-top: -64px;
}

.dialog{

  width: 100%;

}
canvas{
  width:100% !important;
  height: 100% !important;
}


.wrap {
    width: 100%;
    height: 100%;

}
.fixed{
  position: sticky;
  top: 66px;

}


</style>
