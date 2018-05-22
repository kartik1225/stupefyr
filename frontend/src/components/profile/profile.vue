<template>
  <v-app>
    <div class="sidecol" >
      <div class="colwrap" >

          <v-card class='white' height='100%' v-grad>

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
                                    ref='myCroppa'
                                    >
            </croppa>
          </div>

          <!-- profile cover dialog -->
          <v-dialog persistent v-model='Pcover'>
            <v-card>
              <v-container>
                <v-list>
                <!-- edit -->

                  <v-list-tile @click='editCover'>
                    <v-icon>edit</v-icon>
                    <v-list-tile-title v-html='"upload cover"'>
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
            <img v-track ref='track' v-track='$route.path' @click='Pcover = true' role='button' :src="user.cover === 'default/cover.png'?`${$store.state.server}default/cover.png`:`${this.$store.state.server}picture/${user.cover}`" style="width:100%;" />
          </div>

          <div v-grad style="height:100%; margin-top:-6px;">
          <v-container fluid >


          <!-- profile cover dialog -->
          <v-dialog persistent v-model='Pprofile' width='500px'>
            <v-card>
              <v-container>
                <v-list v-if='edPro'>
                <!-- edit -->
                  <v-list-tile @click='edPro = !edPro'>
                    <v-icon>edit</v-icon>
                    <v-list-tile-title v-html='"upload profile image"'>
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
            
            <v-avatar
              size="90px"
              class="grey lighten-4 elevation-2"
              style='margin-top:-68px;z-index:1;'
            >
                          <img role='button' @click='Pprofile = true' :src='user.image ==="default/profile.jpg"?`${$store.state.server}default/profile.jpg`:`${this.$store.state.server}picture/${user.image}?q=low`' />
                        </v-avatar>
            </v-layout>


          <!-- user profile name  -->

            <br><p v-grad='"text"' class="text-xs-center headline">{{user.userName}}</p>

          <!-- user followers and following & counting -->
            <v-layout>
              <v-flex xs6>
                <p v-grad='"text"'class="subheading text-xs-center">followers</p>
                <p v-grad='"text"' class="subheading text-xs-center ">{{user.followers.length}}</p>
              </v-flex>
              <v-flex xs6>
                <p v-grad='"text"' class="subheading text-xs-center">following</p>
                <p v-grad='"text"' class="subheading text-xs-center ">{{user.followings.length}}</p>
              </v-flex>
          </v-layout>

          <!-- user follow buttuns -->
          <v-layout  justify-center>
          </v-layout>

          </v-container>
        </div>
          </v-card>
          </div>
      </div>
    </div>

    <!-- main content -->
    <div class="main">
      <div class='content'>

        <v-tabs fixed icons centered @input='activeTAb' v-model='aTab'>
           <v-tabs-bar light >
             <v-tabs-slider color="grey"></v-tabs-slider>
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

           
           <v-tabs-items>
                 <v-tabs-content
                   id="post"
                    style='width:100%'>
                    <v-container grid-list-sm>
                     <v-layout justify-center>
                      <v-flex lg6 md8 sm10 xs12>
                     <br>
                     <div style="width:100%">
                     <router-view name='postCreater'></router-view>
                     </div>
                     <br>
                     <router-view name='post' :posts='posts' path='user/post/' :noPost='noPost'></router-view>
                         </v-flex>
                       </v-layout>
                     </v-container>
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

           </v-tabs-items>
      
         </v-tabs>


      </div>
    </div>
  </v-app>
</template>


<script>
import post from '../post/post.vue'
import bodyTemplate from '../bodyTemplate.vue'
import axios from 'axios'
import Dropzone from 'vue2-dropzone'
import {bus} from '../../main'
import vibrant from 'node-vibrant'
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
      this.$store.commit('sn',{snac:'drag image to adjust'})
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

    },
    editCover(){
      this.cvb.image = true;

      this.$refs.myCroppa.chooseFile()
      this.Pcover = false;
      
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

    bus.$emit('toolbar')
    // tab changing behaviour in tabs and routers
    var parts = window.location.pathname.split("/");
    var result = parts[parts.length - 1];
    setTimeout(()=>{
    this.aTab = result;
    },500)

    axios.get(`${this.$store.state.server}user/pictures/${this.$store.getters.id}`,this.$store.getters.auth).then(r => {
      r.data.map(d =>{
        this.pics.push(d);
        console.log('asdsd')
        vibrant.from(this.user.cover === 'default/cover.png'?`${$store.state.server}default/cover.png`:`${this.$store.state.server}picture/${this.user.cover}`).getPalette()
                      .then((palette) => {
                        let final = `rgb(${palette.Vibrant._rgb[0]},${palette.Vibrant._rgb[1]},${palette.Vibrant._rgb[2]})`
                        console.log('got it',final);
                        bus.$emit('toolbar',final)

        })

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
  canvas{
    width: 100% !important;
    height:auto !important;

  }
  
  .sidecol{
    width: 23em;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    animation: slideHeader-860 .3s cubic-bezier(0.0,0.0,0.2,1);
    -webkit-animation: slideHeader-860 .3s cubic-bezier(0.0,0.0,0.2,1);

  }

  .colwrap{
    height:calc(100% - 64px);
    margin-top: 64px;


  }

  .main{
    position: relative;
    left:23em;
    width: calc(100% - 23em);
    height: 100%;
    right:0;
  }

  .content{

  }

 
  @media only screen and (max-width:1280px){
    .sidecol{
      width:24%; 
    }

    .main{
      width:76%;
      left:calc(100% - 76%);
    }
  }

  @media only screen and (max-width: 960px){
    .colwrap{
      height:calc(100% - 48px);
      margin-top:48px;
    }
  }

  @media only and (max-width:875px){
    .colwrap{
      height:calc(100% - 56px);
    }
  }

  @media only screen and (max-width: 860px){
    .sidecol{
      width: 30%;
    }

    .main{
      width:70%;
      left:calc(100% - 70%);
    }
  }

  @media only screen and (max-width:600px){
    .sidecol{
      width:100%; 
      position: relative;

    }

    .colwrap{
      margin-top:0px;
      height: auto;
      width:100%;
    }

    .main{
      position:relative;
      width:100%;
      left: 0;
    }
  }



</style>