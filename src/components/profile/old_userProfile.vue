<template>


<v-app >

<!-- main page content start here -->
<v-container grid-list-md>
<v-layout row-md column child-flex-md>

<!-- user profile content (stickey) -->
<v-flex xs12 md4 >
<div class="fixed">
<v-card class='white'>

<!-- profile cover upload -->


<!-- profile cover dialog -->
<v-dialog persistent v-model='Pcover'>
  <v-card>
    <v-container>
      <v-list>
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

<div>
  <img @click='Pcover = true' role='button' :src="`${this.$store.state.server}picture/${user.cover}`" style="width:100%;" />
</div>


<v-container fluid  >


<!-- profile cover dialog -->
<v-dialog persistent v-model='Pprofile' width='500px'>
  <v-card>
    <v-container>
      <v-list v-if='edPro'>
      <!-- edit -->
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
  <img role='button' @click='Pprofile = true' :src="user.image === 'default/profile.jpg'?`${$store.state.server}default/profile.jpg`:`${this.$store.state.server}picture/${user.image}?q=low`" class='circal elevation-2' style='margin-top:-100px;z-index:10;' />
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
    <br>
    <v-btn dark class='blue-grey darken-3'@click='followAction'>{{isFollowing?'following':'follow'}}</v-btn>
</v-layout>

</v-container>
</v-card>
</div>
</v-flex>


<!-- user posts , user posted images , sharred and tagend posts -->
<v-flex xs12 md8>
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
        <router-view name='post' :posts='posts'></router-view>
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
      isFollowing:false,
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
    '$route.params.id':function(i){
        if(this.$store.getters.id !== this.$route.params.id){
          axios.get(`${this.$store.state.server}user/get/${this.$route.params.id}`,this.$store.getters.auth).then(r => {
            this.user = r.data;

            console.log(r.data)

            r.data.followers.map(u=>{
              u.user === this.$store.getters.id?(this.isFollowing = true) : null;
            })
            
          }).catch(e =>{
            this.$store.commit('sn',{context:'error',snac:'getting error in server'})
          })
        }else{
          this.$router.push('/profile/post')
        }
        // showing user likes
        axios.get(`${this.$store.state.server}user/post/${i}/0/`,this.$store.getters.auth).then(r => {
          console.log(i)
          this.posts = []

        r.data.map(data=>{
          this.posts.push(data);

          data.likes.map(l=>{
            // console.log(l)
            l.user === this.$store.getters.id?(data.liked = true,console.log(l)) : console.log('not liked')
          })

        })
        console.log(r.data);
      }).catch(e =>{
        console.log(e);
      })

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
    showSuccess:function(data,file){
     console.log(data)
    },
    activeTAb(a){
      this.$router.push('/user/'+this.$route.params.id+'/'+a)
      this.aTab = a

    },
    coverExistence(){
      alert(this.user.cover)
    },
    // following this user
    followAction(){
      const data = {
        user:this.$store.getters.id,
        follow:this.$route.params.id
      }

      axios.post(`${this.$store.state.server}rel/follow`,data).then(r=>{
        console.log(r.data)
        this.isFollowing = r.data.result;
        if(r.data.result){
          this.user.followers.push(r.data.follow)
        }else{
         const index = this.user.followers.findIndex(x => x.user === this.$store.getters.id);

          this.user.followers.splice(
            this.user.followers.indexOf(index), 1
          );
        }

      }).catch((e)=>{
        console.log(e)
      })
    }

   },
   beforeCreate(){
    if(this.$store.getters.id !== this.$route.params.id){
      axios.get(`${this.$store.state.server}user/get/${this.$route.params.id}`,this.$store.getters.auth).then(r => {
        this.user = r.data;

        console.log(r.data)

        r.data.followers.map(u=>{
          u.user === this.$store.getters.id?(this.isFollowing = true) : null;
        })
        
      }).catch(e =>{
        this.$store.commit('sn',{context:'error',snac:'getting error in server'})
      })
    }else{
      this.$router.push('/profile/post')
    }


   },
   created(){
    alert(this.user.cover)

    // tab changing behaviour in tabs and routers
    var parts = window.location.pathname.split("/");
    var result = parts[parts.length - 1];

    setTimeout(()=>{
      this.aTab = result;
    },500)

    axios.get(`${this.$store.state.server}user/pictures/${this.$route.params.id}`,this.$store.getters.auth).then(r => {
      r.data.map(d =>{
        this.pics.push(d);
      })
    })


   bus.$on('postfeed',d => {
        d.start -= 10;
        console.log(d)
        axios.get(`${this.$store.state.server}user/post/${this.$route.params.id}/${d.start}`,this.$store.getters.auth).then(r => {

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
