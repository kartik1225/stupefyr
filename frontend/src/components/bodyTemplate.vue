<template>
  <v-app>
    <v-navigation-drawer
      fixed
      :clipped="$vuetify.breakpoint.width > 1264"
      v-model="drawer"
      :class="$route.matched[1].path === '/chat'?`grey lighten-4 elevation-2`:`grey lighten-4`"
      app
      :hide-overlay='true'
      :mini-variant='miniVariant'
      :disable-resize-watcher='resizeWatcher'
      :disable-route-watcher='disableRouteW'


    >
      <v-list
        dense
        class="grey lighten-4"
      >
        <template v-for="(item, i) in items">
          <v-layout
            row
            v-if="item.heading"
            align-center
            :key="i"
          >
            <v-flex xs6>
              <v-subheader v-if="item.heading">
                {{ item.heading }}
              </v-subheader>
            </v-flex>
            <v-flex xs6 class="text-xs-right">
              <v-btn small flat>edit</v-btn>
            </v-flex>
          </v-layout>
          <v-divider
            dark
            v-else-if="item.divider"
            class="my-4"
            :key="i"
          ></v-divider>
          <v-list-tile
            :key="i"
            v-else
            :to='item.href'
            href
          >
            <v-list-tile-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title class="grey--text">
                {{ item.title }}
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </template>

        <v-list-tile
        href
        style='position:absolute; bottom:0;'
        @click='miniVariant = !miniVariant'
        >
          <v-list-tile-action>
            <v-icon>{{miniVariant?`keyboard_arrow_right`:`keyboard_arrow_left`}}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title class="grey--text">
              {{miniVariant?`expand`:`collapse`}}
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

      </v-list>
    </v-navigation-drawer>


    <v-toolbar :color="toolClr" fixed app clipped-left ref='toolbar'>
      <!-- <v-toolbar-side-icon v-if="$vuetify.breakpoint.width <= 1264" @click="drawer = !drawer"></v-toolbar-side-icon> -->

      <v-toolbar-side-icon  @click="drawer = !drawer"></v-toolbar-side-icon>
      <span role='button' @click='$router.push(`/`)' class="title">stupifyr&nbsp;<span class="text"></span></span>

<!--       <v-btn icon v-show='false'>
        <v-icon>arrow_back</v-icon>
      </v-btn>
      <span v-show='false' class="title">chat</span> -->

      <v-spacer></v-spacer>

      <!-- query bar -->

    <div class='query white elevation-4'  v-show='showSearch'>
      <v-container grid-list-md align-content-center    >
      <v-text-field
              label="find..."
              single-line
              full-width
              hide-details
              class='white  '
              append-icon = 'arrow_forward'
              :append-icon-cb="() => {(showSearch = !showSearch)}"
              v-model='query'
              clearable
              autofocus
      ></v-text-field>
    </v-container>



    </div>
      <div class="queryList" v-show='showSearch'>
      <v-list class='elevation-4' v-show='query === ""?false:true'>
      <template v-for='(q,index) in qResult'>
        <v-list-tile class='white' @click='qClick(q)'>
          <v-list-tile-avatar>
            <img v-show='q.userName === Null?false:true' :src='q.image ==="default/profile.jpg"?`${$store.state.server}default/profile.jpg`:`${$store.state.server}picture/${q.image}?q=low`'/>
          </v-list-tile-avatar>
          <v-list-tile-title>{{q.userName}}</v-list-tile-title>
        </v-list-tile>
        <v-divider v-if="index + 1 < qResult.length"></v-divider>
        </template>
      </v-list>
    </div>

      <div v-show='hideIco'>
        <v-btn @click='showSearch = !showSearch' icon v-show='!showSearch'>
          <v-icon>search</v-icon>
        </v-btn>
      </div>

        <!-- notifications -->
        <div id="f" style='position:relative;' v-show='!showSearch'>
          <v-btn id='clickbox' icon @click='nfAction' v-show='hideIco'>
          <v-badge overlap color="green elevation-5" v-model='notifyBox.newNfCount !== 0'>
               <span slot="badge" >{{notifyBox.newNfCount}}</span>
               <v-icon>
                  {{notifyBox.newNfCount !== 0?`notifications_active`:`notifications`}}
               </v-icon>
              </v-badge>  
            </v-btn>      
        </div>


          <v-menu bottom v-show='hideIco'>
            <v-toolbar-title slot="activator">
            <v-btn icon v-show='!showSearch'>
              <v-icon light>expand_more</v-icon>
            </v-btn>
            </v-toolbar-title>
            <v-list>
              <v-list-tile @click.native='logout'>
                <v-icon>exit_to_app</v-icon>
                <v-list-tile-title v-text="'logout'"></v-list-tile-title>
              </v-list-tile>
            </v-list>
          </v-menu>
          

    </v-toolbar>

    <v-content>

      <!-- notifications box -->
      <v-slide-y-transition>
      <div id='clickbox' style='position:fixed; max-width:400px; z-index:3; right:0; padding:2px;' v-show='notifyBox.show'>
            <div class='tg' style='position: absolute;z-index: 3;right: 83px;top: -8px;'></div>
          <v-card>
            <notifyDisp></notifyDisp>
          <div class='grey lighten-4' >
              <v-divider></v-divider>
              <v-btn block flat @click='$router.push(`/notifications`)'>see all notifications</v-btn>
          </div>
          </v-card>  
        </div>
      </v-slide-y-transition>
          <slot></slot>

          <v-snackbar top right 
                :success="context === 'success'"
                :info="context === 'info'"
                :warning="context === 'warning'"
                :error="context === 'error'"
                :primary="context === 'primary'"
                :secondary="context === 'secondary'"
                :color='context === `error`?`error`:`success`'
                v-model="snackbar"
              >
                {{ snac }}
                <v-btn dark flat @click.native="$store.commit('snclose')">Close</v-btn>
          </v-snackbar>

          <!-- notify -->
          <v-snackbar
            :timeout="5000"
            color='grey lighten-2'
            :multi-line="true"
            :vertical="false"
            v-model="notifyShow"
            :top="true"
            :right="true"
            @click='$router.push()'
            role='button'
          >
          <v-layout v-if='notifyShow'  @click='notifyRedirect(notifyData)'> 

            <v-avatar
                size="40px"
                class="grey lighten-4 "
              >
                <img :src="`${$store.state.server}picture/${notifyData.pp}`" alt="avatar">
              </v-avatar>

                  <div   style=' margin-left:10px; width: calc(100% - 24px - 50px);margin-top: auto;margin-bottom: auto;' >

                  <p class="body-1 black--text long-and-truncated ellipsed" style="margin:auto;">
                    {{notifyData.context}}
                  </p>

              </div>

                <div style='right:0;'>
                 <v-btn style='margin:auto' light flat @click.native="notifyShow = false" icon><v-icon>clear</v-icon></v-btn>
                </div>
          </v-layout>
          </v-snackbar>
    </v-content>
  </v-app>
</template>

<script>
import { mapState } from 'vuex'
import axios from 'axios'
import { bus } from '../main.js'
import notifyDisp from './notifications/notifyDisp.vue'

  export default {

    components:{
      notifyDisp
    },

    data: () => ({
      clipped: true,
      navResize:false,
      inlogin:true,
      drawer:null,
      query:'',
      qResult:null,
      showSearch:false,
      hideIco:true,
      Null:'no result found!',
      items: [
        { icon: 'dashboard', title:'timeline' , href:'/'},
        { icon: 'face', title: 'profile', href:'/profile/post' },
        { icon: 'question_answer',title:'quiz', href:'/quiz'},
        { icon: 'movie', title: 'movie page', href:'/movie' },
        { icon: 'chat' , title:'chat' , href:'/chat'},
        // { icon: 'whatshot', title: 'creating', href:'/new'},
      ],
      miniVariant: false,
      breadcrumbs:{
        path:'',
        show:false
      },
      respIcon:false,
      toolClr:'white',
      // notify data 
      notifyShow:false,
      notfyData:null,
      notifyBox:{
        show:false,
        newNfCount:0
      },
      resizeWatcher:false,
      disableRouteW:false
    }),
    watch:{
      drawer:function(i){
        if(this.$route.path === '/login' || this.$route.path === '/signup' || this.$route.path ===  '/login/' || this.$route.path ===  '/signup'){
          this.drawer = false;
          this.disableRouteW=true;
        }
      },
      // hideing toolbar icons in authentications routs.. 
      '$route.path':function(i){
          if(this.$route.path === '/login' || this.$route.path === '/signup' || this.$route.path ===  '/login/' || this.$route.path ===  '/signup'){
            this.hideIco = false;
            this.drawer = false;
            this.resizeWatcher = true;
            this.disableRouteW=true;
          }else{

          this.profileDrawer()
          this.routeValidation()
          }
          

          bus.$emit('live_route',i)


      },
      // changing qury results
      query:function(i){

        axios.get(`${this.$store.state.server}search/q?q=${i}`,this.$store.getters.auth).then(r=> {
          r.data.length !== 0?this.qResult = r.data:this.qResult = [{userName:this.Null}]
          i === ''?this.qResult = null : null;
          console.log(this.qResult)
        }).catch((e)=>{
          console.log(e);
        })

      }
    },

     sockets:{
       connect: function(){

        if(localStorage.getItem('me')){

          this.$socket.emit('register_user',this.$store.getters.id);

        }

       },
       quizResults: function(val){
         console.log(val);
       },
       notify:function(_){
        console.log('notify',_);
       this.notifyData = _.newNotify;
       this.notifyShow = true;
       this.$bus.$emit(`new_notifincation_socket`,_.newNotify);
       }
     },


    methods:{
      notifyRedirect(nf){
        this.$router.push(nf.link);
        this.notifyShow = false;
      },
      logout(){
        localStorage.clear();
        this.$router.push('/login')
      },
      qClick(i){
        this.$router.push(`/user/${i._id}/post`);
        this.showSearch = false;
      },
      hide(){
        console.log('outside')
        this.showSearch = false;
      },
      profileDrawer(){
        if(this.$route.matched[1].path === '/profile'){
          setTimeout(()=>{
          this.drawer = false;
          this.navResize =true;
          this.resizeWatcher = true;
          },300)
        }else{
          this.resizeWatcher = false;
        }
        
        console.log(this.$route)
        if(this.$route.matched[1].path === '/user/:id'){
          setTimeout(()=>{
          this.drawer = false;
          this.navResize =true;
          this.resizeWatcher = true;
          },300)
        }else{
          this.resizeWatcher = false;
        }

        if(this.$route.matched[1].path === '/chat' ||this.$route.matched[1].path === '/movie' || this.$route.matched[1].path === '/quiz'){
          setTimeout(()=>{

          this.navResize = true;
          this.miniVariant = true;
          },300)
        }else{
          this.miniVariant = false;
        }
         
      },
      routeValidation(){
        if(this.$route.path === '/login' || this.$route.path === '/signup'){
          console.log('ignore')

          this.hideIco = false;
          this.drawer = false;
          this.resizeWatcher = true;

        }else{

            if(localStorage.getItem('me')){
              console.log('this')
              axios.get(`${this.$store.state.server}user/isvalid`,this.$store.getters.auth).then(r => {
              }).catch(e => {
                // if user's token got unauthorized then;
                this.$store.commit('sn',{context:'error',snac:'login session expired , login again'})
                this.$router.push('/login')
              })
            }else{
              // if localstorege is emty then...
              this.$store.commit('sn',{context:'error',snac:'you have to login/sign-up'})
              this.$router.push('/login')
            }
         }
      },
      // breadcrumbsControler(){
      //   if(this.breadcrumbs.show && this.$vuetify.breakpoint.width < 600){
      //     this.respIcon = false;

      //   }else{
      //     this.respIcon =true;
      //   }
      // } 
      nfAction(){
          this.notifyBox.show = !this.notifyBox.show;
          this.$bus.$emit(`seen_notificetions`,true);
        }
    },
      computed:mapState({
        context:state=>state.context,
        snackbar:state=>state.snackbar,
        snac:state=>state.snac
      }),
      mounted(){

        let self = this; 
        window.addEventListener('click', function(e){  
          if (document.getElementById('clickbox').contains(e.target)){
            // Clicked in box
            self.notifyBox.show = true;
           
          } else{
            // Clicked outside the box
            self.notifyBox.show = false;
          }
        });


         this.routeValidation();

         if(localStorage.getItem('me')){

          this.$socket.emit('register_user',this.$store.getters.id);

          this.$bus.$on('new_notifications_count',r=>{
              this.notifyBox.newNfCount = r;
          })

        }

       },

      updated(){
        if(this.$route.path === '/login'){
          console.log('ignore')
          this.inlogin =false;
        }
      }
    
  }
</script>

<style>
  .tg {
    width: 0; 
    height: 0; 
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-bottom: 10px solid white;
    z-index: 4;
  }

  #keep main .container {
    height: 660px;
  }


  .navigation-drawer__border {
    display: none;
  }
  .text {
    font-weight: 400;
  }

  .ellipsed {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    margin:auto;
  }

  .query { 
        position: absolute;
        width: 40%;
        right: 1%;
        border-radius: 2px;
    }

  @media only screen and (max-width: 960px){

    .query {
        position: absolute;
        width: 60%;
        right: 1%;
      
    }
  }

  @media only screen and (max-width: 600px){

    .query {
        position: absolute;
        width: 98%;
        right:1%;
        left: 1%;
      
    } 
  }


    .queryList {
        top: 60px;
        position: absolute;
        width: 40%;
        right: 1%;
        border-radius: 2px;
    }

  @media only screen and (max-width: 960px){

    .queryList {

        position: absolute;
        top: 54px;
        width: 60%;
        right: 1%;
      
    }
  }

  @media only screen and (max-width: 600px){

    .queryList {

        position: absolute;
        width: 98%;
        right:1%;
        left: 1%;
      
    } 
  }
  
</style>