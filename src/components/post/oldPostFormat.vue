<template>
<!-- you have to add the "<v-app>" tag in parant component -->
<v-app>




<div infinite-wrapper class="grey lighten-4">
<div style="width:100%">
<template v-for='(post,index) in posts'>
<br>
<v-layout :ref='"post"+index' :id='"post"+index' v-if='!post.movieId'>

    <!-- main card flex -->
   
   <!-- post card starts here -->
   <v-flex xs12>
    <v-scale-transition>
     <v-card elevation-2>

     <!-- user avtar strip -->
      <v-container grid-list-lg>
        <v-layout>

        <!-- user avatar image -->
          
          <v-avatar                 
            size="36px"
            class="grey lighten-4"
          >
             <img :src='`${$store.state.server}picture/${post.user.image}?q=low`'/>
          </v-avatar>

          <v-layout style='margin-left: 0px;margin-top: 0px;'>
          <!-- user name -->
          <p class="subheading" style="margin-top:auto; margin-bottom:auto; margin-left:5px;">{{post.user.name}}</p>
          <v-icon style='font-size:14px;'>play_arrow</v-icon>

          <!-- user post priority -->
          <p class="caption" style="margin-top:auto; margin-bottom:auto; margin-left:2px;">public</p>
          <v-icon style='margin-left:2px; font-size:13px;'>public</v-icon>
          </v-layout>
          <div style='position:absolute; right:0px; margin-top:-7px;'>
          <!-- more option to edit or remove post -->
          <v-menu bottom left >
            <v-btn @click='postMore(post)' icon slot="activator" light class='orange--text'>
              <v-icon style='font-size:22px;'>more_vert</v-icon>
            </v-btn>

            <!--if your post -->
            <v-list v-show='mypost'>
              <!-- edit action -->
              <v-list-tile @click='postEdit(post,index)'>
                <v-icon>edit</v-icon>
                <v-list-tile-title>edit</v-list-tile-title>
              </v-list-tile>

              <!-- delete post -->
              <v-list-tile @click='postDelete(post,index)'>
                <v-icon>delete</v-icon>
                <v-list-tile-title>delete</v-list-tile-title>
              </v-list-tile>
            </v-list>

            <!-- if other post -->
            <v-list v-show='!mypost'>
              <v-list-tile>
                <v-icon>flag</v-icon>
                <v-list-tile-title>report this post!</v-list-tile-title>
              </v-list-tile>
            </v-list>
          </v-menu>

          </div>  
        </v-layout>
        <!-- displaying time -->
        <div style="margin-top: -22px;margin-left: 33px;">
        <timeago style='font-size:12px' class='grey--text':since='Date.parse(post.created)'></timeago>
        </div>
        <v-container grid-list-xs>
        <p class="body-2" v-show='!post.onlycaption' :style="caption">{{post.caption}}</p>
        </v-container>
        <!-- user post title  -->
      </v-container>

      <v-container  v-show='post.onlycaption'>
      <h1 class="text-xs-center " :style="'font-size:'+ post.font+';'">{{post.caption}}</h1>
      </v-container>

        <!-- post image -->
       <img style='margin-top:-10px;' v-show='post.image !== ``' role='button' @click='openImg(post)' :src= 'post.image' class='wid'/>

       <!-- if post type pole -->
       <debatePost v-if='post.pole !== null' :post='post'></debatePost>


       <!-- debate show more comments btnn -->

<!-- 
       <div v-show='post.poleShow'>
         <v-btn block  @click='(showDebateComment(post,index))' flat class='grey lighten-4'>
            {{ `show commnets`}}

         </v-btn>
      </div> -->

       <v-container grid-list-xs v-show='post.pole === null'>
        <v-layout justify-space-around>
          <!-- like butten -->
         <v-btn flat  @click='postLike(index)' >
           <v-icon :class="{'orange--text':post.liked}">thumb_up</v-icon>
         </v-btn>


         <!-- comment butten -->
         <v-btn icon @click.native="comment(index)" class="orange--text" >
                     <v-icon>{{ post.showComment ? 'chat_bubble_outline' : 'chat_bubble' }}</v-icon>
          </v-btn>



         <!-- share butten -->
         <v-btn flat  >
          <v-icon class="orange--text">share</v-icon>
         </v-btn>
       </v-layout>
       </v-container>


       <!-- users comment and create section -->

       <!-- content visibility -->

          <div v-if='post.showComment' >

          <!-- comment creation by user -->
          <v-container  grid-list-lg >
          <v-layout >

            <!-- comment user profile image -->

              <v-avatar                  
                size="36px"
                class="grey lighten-4"
              >
                 <img src="/static/image.jpg" alt="avatar">
              </v-avatar>
            
         
            <!-- commet input-box -->
                    <div style="height:50px; width:100%;" >
                      <!-- pending loading bar -->
                      <v-text-field :id='"cmt"+index' 
                                    placeholder='your thought?'
                                    single-line
                                    full-width
                                    hide-details
                                    :value='temp'
                                    @input='value => {temp=""}'
                                    @keyup.enter='postComment(index)'
                                    style='margin-top:-14px; height:44px;'
                      ></v-text-field>
                      </div>



            <!-- comment post buttun -->
                               <v-btn class='orange--text' @click='post[index]?postComment(index):null' icon>
                  <v-icon>send</v-icon>
                  </v-btn>
                

          </v-layout>
          </v-container>
          <!-- comment loop -->

          <postCmt :post='post'></postCmt>
          </div>

     </v-card>
     </v-scale-transition>
     </v-flex>
 </v-layout>


<bestPlotCard v-if='post.movieId' :post='post.movieId' ></bestPlotCard>
  <br>

</template>
</div>
</div>
<router-view></router-view>
<!-- post image fullscreen-->
<infinite-loading @infinite="fetchData" loadbutton="once" force-use-infinite-wrapper='true' :distance='distance' ref="infiniteLoading">
    <span slot="no-more">
      Nothing more to show!
    </span>
  </infinite-loading>

</v-app>
</template>

<script>
const postCmt = () => import('./postCmt')
import { bus } from '../../main.js'
import axios from 'axios'
import MugenScroll from 'vue-mugen-scroll'
import InfiniteLoading from 'vue-infinite-loading';
const popImage = ()=> import('./popImage');
const debatePost = ()=> import('../debate/debatePost')
const bestPlotCard = ()=> import('../movieRating/bestPlotCard')


export default {
  props:['posts','noPost','loaded','path'],
  components:{
    postCmt,
    alert,
    MugenScroll,
    InfiniteLoading,
    popImage,
    debatePost,
    bestPlotCard
  },
  data(){
    return {
      somthing:'',
      show:false,
      thumb:false,
      mypost:false,
      test:'',
      loading: false,
      temp:null,
      alertDialog:false,
      random:'random this',
      caption:'',
      cmt:null,
      cmtInp:'',
      start:0,
      end:10,
      offsetTop:0,
      data: [],
      busy: false,
      list:[],
      fullImage:true,
      imageId:'',
      distance:10000,
      showDC:[],

    }
  },
  methods:{
    loadMore: function() {
      this.busy = true;
          console.log('this.fetchData();')
        this.busy = false;
    },

    showDebateComment(post,index){
      this.$bus.$emit('debate_cmt_load',post)
      this.posts[index].poleShow =false;

      // finally!
      this.$set(this.posts, index, post)

    },  
    fetchData($state) {
              this.distance = 3000;
              this.posts.length === 0?this.start = 0:null;

              axios.get(`${this.$store.state.server}${this.path}${this.$route.params.id || this.$store.getters.id}/${this.start}`,this.$store.getters.auth).then(r => {
                console.log(r.data);
              if(r.data.error){
                this.noPost = true;
                $state.complete();
              }else if(r.data){
                this.loaded = true;
                const add = 10;
                this.start += add;
                this.posts = this.posts.concat(r.data);
                $state.loaded();
                // alert('relod')
                  r.data.map(data=>{

                      // this.posts.push(data);
                      data.likes.map(l=>{
                        l.user === this.$store.getters.id?(data.liked = true,console.log(l)) : console.log('not liked')
                      })

                      if(data.pole){
                        // this.showDC.push(true)
                        data.poleShow = true;

                      }else{
                        // this.showDC.push(false)
                        data.poleShow = false;
                      }

                  })
                }else{
                  this.noPost = true;
                  $state.complete();
                }
                }).catch(e =>{
                  console.log(e);
                  this.$store.commit('sn',{context:'error',snac:'server error'});
                })

    },
    onScroll (e) {
        this.offsetTop = window.pageYOffset || document.documentElement.scrollTop
    },

    openImg(i){
      this.$router.push('/fullimage/'+i._id)
    },
    //this function cheaks post creater/viewer
    postMore(i){
      this.$store.getters.id === i.user._id?this.mypost = true:this.mypost= false;
    },
    postDelete(i,index){
      if (confirm('Are you sure you want to delete a post?')) {
      //requesting delete post
        const data = {
          post:i._id,
          user:this.$store.getters.id
        }
        axios.delete(`${this.$store.state.server}user/post/${i._id}+${this.$store.getters.id}`,this.$store.getters.auth).then(r => {
          console.log(r.data)
          this.$store.commit('sn',{context:'error',snac:r.data.result})
          setTimeout(()=>{
            if (index > -1) {
                this.posts.splice(index, 1);
            }
          },500)
        }).catch(e => {
          console.log(e)
          this.$store.commit('sn',{context:'error',snac:'error while deleteing post'})
        })
      } else {
      this.$store.commit('sn',{snac:'dont worry your post is still there.'})
      }
    },
    postEdit(i,index){
      bus.$emit('edit_post',{post:i,index:index})
    },
    //getting comments from server for perticular post...
    comment(i){
      const c = this.posts[i];
      const temp = i;
      this.posts[i].showComment = !this.posts[i].showComment;
      axios.get(`${this.$store.state.server}user/comment/${this.posts[i]._id}`,this.$store.getters.auth).then(r => {

        c.comments = r.data;
        r.data.map(d=>{
          d.likes.map(l=>{
              l.user === this.$store.getters.id? (d.liked = true , console.log('liked')): console.log('cnt not lk')
          })
        })
      }).catch(e=>{
        console.log(e,'asfasdfgasdgas')
        this.$store.commit('sn',{context:'error',snac:'error while getting comments from server.'})
      })
    },
    //posting comment for this post..
    postComment(i){
      const c = this.posts[i];
      const data = {
        user:this.$store.getters.id,
        post:c._id,
        comment:this.$el.querySelector('#cmt'+i).value

      }


      if(this.$el.querySelector('#cmt'+i).value !== ''){
        axios.post(`${this.$store.state.server}user/comment/${this.$store.getters.id}`,data,this.$store.getters.auth).then(r=>{

            if(r.data.error){

              this.$store.commit('sn',{context:'error',snac:r.data.error})

            }else{

              // cool
              this.temp = null;
              bus.$emit('comment_created',r.data)

            }

        }).catch(e=>{
          console.log(e)
          this.$store.commit('sn',{context:'error',snac:'server error while posting comment'})
        })
      }else{
        this.$store.commit('sn',{context:'error',snac:`commnet can't be empty!`});
      }
    },
    // submitting user like/dislike and storeing to server
    postLike(i){
      const c = this.posts[i]
      const data = {
        user:this.$store.getters.id,
        post:c._id
      }

      axios.post(`${this.$store.state.server}user/like/${this.$store.getters.id}`,data,this.$store.getters.auth).then(r=>{
        console.log(r.data)
        c.liked = r.data.liked;
      }).catch(e=> {
        console.log(e)
        this.$store.commit('sn',{context:'error',snac:'server error, try again...'})
      })
    }
  },
  mounted(){
    
    bus.$emit('loading_off',false);
    bus.$on('postCreated',p=>{
        this.posts.unshift(p);
      console.log('post')

      bus.$emit('debate_cmt_trigr',p);
    })

    bus.$on('post_updated',(p)=> {
      this.$set(this.posts,p.index, p.post.post)
      console.log( this.posts[p.index].caption)

    })


    bus.$on('live_route',(r)=>{
      console.log('pppaatthh',this.$route.matched[2].path)
      if(this.$route.matched[2].path !== '/fullimage/:id'){
        console.log()
      this.start = 0;
      this.fetchData()
      } 
    })

  },
  beforeDestroy () {
     bus.$off('postCreated')
     bus.$emit('post_exit',true)
  }
}
</script>

<style scoped>
 .wid{
  width: 100%;
 }

 .txt{
  width: auto;
  overflow: visible; 
  white-space: normal; 
 }

 li{
     list-style:none;
}

.hi{
  background-color: black;
}

p{
  margin: 1px ;
}

.al{
  margin: 5px !important;
},
.block{
}

.cirr{
    background-repeat: no-repeat !important;
    background-position: 50% !important;
    border-radius: 50% !important;
    width: 40px !important;
    height: 40px !important;

}
.overflow{
  overflow: scroll;
  min-height: 0px;
  max-height: 300px;
}
.bottom{
  position: absolute;
}

</style>
