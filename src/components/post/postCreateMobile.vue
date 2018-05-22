<template>
  <div v-scroll="onScroll" v-resize="onResize">
      <v-card>
    <v-container fluid grid-list-xs >
    <v-layout row>
      <v-flex xs11 @click.stop='postFull'>

                      <v-text-field
                        label="Subject"
                        value="what is new with you?"
                        single-line
                        full-width
                        hide-details
                        disabled
                      ></v-text-field>
                    </v-flex>
          <v-icon>edit</v-icon>
        </v-layout>
      </v-container> 
    </v-card>
    <v-dialog v-model="postData.fs" fullscreen transition="dialog-bottom-transition" :overlay='false'>
          <v-card>
            <v-toolbar dark class="primary">
              <v-btn icon @click.native="postData.fs = false , sp = true" dark>
                <v-icon>close</v-icon>
              </v-btn>
              <v-toolbar-title>Settings</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-toolbar-items>
                <v-btn dark flat :disabled='!postData.active' @click.native="postData.post = !postData.post">post</v-btn>
              </v-toolbar-items>
            </v-toolbar>
           
                     <v-card >
                     <v-container fluid style='position:absolute;'>

            <!-- user info strip -->
                        <v-layout>
                          <img src='/static/image.jpg' class="cir"/>
                          <p class="subheading" style="margin-top:auto; margin-bottom:auto; margin-left:5px;">kartik</p>
                          <v-icon style='font-size:14px;'>play_arrow</v-icon>
                          <p class="caption" style="margin-top:auto; margin-bottom:auto; margin-left:2px;">public</p>
                          <v-icon style='margin-left:2px; font-size:20px;'>public</v-icon>
                          <div style='position:absolute; right:0px;'>
                          <v-btn icon >
                            <v-icon >more_vert</v-icon>
                          </v-btn>
                          </div>
                        </v-layout>

            <!-- post capction textarea-->
                        <v-text-field
                                          label="Message"
                                          counter
                                          max="120"
                                          full-width
                                          multi-line
                                          single-line
                                          v-model='postData.caption'
                                        ></v-text-field>

            <!-- user uploaded image preview -->
                            <div class='overflows' :style='"height:"+heightStyle.input' v-show='upImage'>
                            <div style="position:absolute">
                           <v-btn fab dark small class='red' @click.native='imageCancel'>
                                <v-icon dark>remove</v-icon>
                              </v-btn>
                            </div>
                              <img :src='upImageUrl' style="width:100%" />
                            </div>

            <!-- image upload zone/dropzone -->
            <dropzone ref="myUniqueID2" :style='"height:"+heightStyle.input' v-show='dz' id="myVueDropzone" :url="`${$store.state.server}picture/upload`" v-on:vdropzone-success="imageUpload">
              <!-- Optional parameters if any! -->
              <input type="hidden" name="token" value="xxx">
             </dropzone>

                      </v-container>

                     </v-card>
            <!-- bottom post buttuns -->
                
                     <v-layout class='bottom'>
                      <!-- image upload btns -->
                          <v-btn icon :disabled='imgBtn' @click.native='dz=!dz'>           
                          <v-icon >add_a_photo</v-icon>
                          </v-btn>
                      <!-- add link icon -->
                           <v-btn icon>           
                          <v-icon >link</v-icon>
                          </v-btn>
                      <!-- add location icon??  -->
                           <v-btn icon>           
                          <v-icon >location_on</v-icon>
                          </v-btn>
                     </v-layout>
          </v-card>
        </v-dialog>

        <!-- fixed floating button  -->
              <div v-show='spdiv'>
              <v-fab-transition>
                 <v-btn  v-show='sp' @click.stop='postFull'
                dark
                fab
                fixed
                bottom
                right
                style='z-index:10'
              >
                <v-icon >edit</v-icon>
              </v-btn>
            </v-fab-transition>
            </div>
  </div>
</template>

<script>
const Dropzone = () => import('vue2-dropzone')
import {bus} from '../../main'
  export default{
    props:['postData'],
    components:{
      Dropzone
    },
    data(){
      return{
        dialog:false,
        upImage:true,
        upImageUrl:'',
        dz:false,
        offsetTop:'',
        lastScroll:0,
        sp:true,
        spdiv:false,
        imgBtn:false,
        heightStyle:{
          input:'',
          container:''
        },
        windowSize: {
                x: 0,
                y: 0
              }
      }
    },
    watch:{
      'postData.dialog':function(i){
        this.dialog = i
      },
      'postData.fs':function(i){
        this.spdiv = !i;
      }
    },
    mounted () {
          this.onResize()
    },
    methods:{
      postFull(){
        this.postData.edit = false;
        this.postData.caption = '';
        this.postData.image = '';
        this.imageCancel();
        this.postData.fs =true;
        this.sp = false;
      },
      imageUpload(file,respond){

            this.imgBtn = true;
            this.dz= false;
            this.upImageUrl=`${this.$store.state.server}picture/${respond.imageId}`
            this.upImage = true;
            this.postData.image = this.upImageUrl;

        },
      imageCancel(){
        this.imgBtn = false;
          this.dz = false;
          this.upImage = false;
          this.$refs.myUniqueID2.removeAllFiles();
        this.postData.image = '';
      },
      onScroll (e) {
        this.offsetTop = window.pageYOffset || document.documentElement.scrollTop

        setTimeout(()=>{
          this.lastScroll = this.offsetTop
        },100)
        
        if(this.lastScroll > this.offsetTop){
          // up
          this.sp=true;
        }else{
          // down
          this.sp = false;
        }
      },
      onResize () {
            this.windowSize = { x: window.innerWidth, y: window.innerHeight }
            this.heightStyle.input =this.windowSize.y - 66 -287  + 'px';

          }
    },
    created(){
      this.spdiv = true;
              bus.$on('postCreated',p=>{  
                this.imageCancel()
              })

              bus.$on('edit_post',i=>{

                if(i.post.image === ''){
                      this.imgBtn = false;
                      this.dz= false;
                      this.upImageUrl='';
                      this.upImage = false;
                      this.postData.image = '';
                      this.imageCancel();
                }else{
                      this.imgBtn = true;
                      this.dz= false;
                      this.upImage = true;
                      this.upImageUrl=i.post.image;
                      this.postData.image = this.upImageUrl;

                    }
              })

    }
  }

</script>

<style>
  
.cir{
    background-repeat: no-repeat !important;
    background-position: 50% !important;
    border-radius: 50% !important;
    width: 40px !important;
    height: 40px !important;

}
.overflows{
  overflow: scroll;
}
.bottom{
  position: absolute;
  bottom: 5px;
  left:15px;
}

</style>