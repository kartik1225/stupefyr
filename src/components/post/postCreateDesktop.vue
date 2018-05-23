<template>
	<div v-scroll="onScroll">
	  <v-card>
	<v-container fluid grid-list-xs >
	<v-layout row>
	  <v-flex role='button' xs11 @click.stop='postPop'>


	                  <v-text-field 
	                    label="what is new with you?"
	                    single-line
	                    full-width
	                    hide-details
	                    auto-focus
	                  ></v-text-field>

	                </v-flex>
	      <v-icon role='button' @click='postPop'>edit</v-icon>
	    </v-layout>
	  </v-container>
	</v-card>
 
	

	<!-- post popup -->
	       <v-dialog :fullscreen='$vuetify.breakpoint.width < 600?true:false' :transition='$vuetify.breakpoint.width < 600?"dialog-bottom-transition":"scale-transition"'  v-model="postData.pop" width='600px'origin='bottom'>  
	       	

	         <v-card >

	         	<v-toolbar light color="amber" v-show='$vuetify.breakpoint.width < 600?true:false'>
	         	          <v-btn icon @click.native="postData.pop = false" light>
	         	            <v-icon>close</v-icon>
	         	          </v-btn>
	         	          <v-toolbar-title>create post</v-toolbar-title>
	         	          <v-spacer></v-spacer>
	         	          <v-toolbar-items>
	         	            <v-btn light flat :disabled='!postData.active' @click='postData.post = !postData.post'>post</v-btn>
	         	          </v-toolbar-items>
	         	        </v-toolbar>


	         <v-container fluid>

	         <div :style="$vuetify.breakpoint.width > 600 ?`height:auto;`:`overflow:auto; height:${$vuetify.breakpoint.height - 97 - 54 - 24}px`">
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
				<div class='cap'>
	            <v-text-field	  autofoucs	
	                              label="write hrere..."
	                              counter
	                              max="120"
	                              full-width
	                              multi-line
	                              single-line
	                              v-model='postData.caption'
	                              @keyup.enter='postData.post = !postData.post'
	                            ></v-text-field>
	            </div>
	                           	 <debateCreater v-show='pole' ></debateCreater>

	                           	 
	                           	 <debatePreView :poles='postData.pole' v-if='debatePre'></debatePreView>

	               	<!-- user uploaded image preview -->
	                <div class="overflow" v-show='upImage'>
	                <div style="position:absolute;right:0;">
	               <v-btn fab dark small class='red' @click.native='imageCancel'>
	                    <v-icon dark>remove</v-icon>
	                  </v-btn>
	                </div>
	                  <img :src='upImageUrl' style="width:100%" />
	                </div>

	<!-- image upload zone/dropzone -->

	    <vue-dropzone v-show='dz' @vdropzone-success='imageUpload' ref="myVueDropzone" id="dropzone" :options="dropzoneOptions"></vue-dropzone>


	</div>
	<!-- bottom btns -->
	          <!-- image upload btns -->



	          <div :style="$vuetify.breakpoint.width > 600 ? `position:relative;`:`position:absolute;left:0;bottom:0;width:100%`">
	         <div >
	          	<v-layout>
	              <v-btn icon :disabled='imgBtn' @click.native='dz=!dz'>           
	              <v-icon >add_a_photo</v-icon>
	              </v-btn>
	          <!-- add link icon -->
	               <v-btn :disabled='linkBtn' icon>           
	              <v-icon >link</v-icon>
	              </v-btn>
	          <!-- create a pole  -->
	               <v-btn icon :disabled='poleBtn' @click='$bus.$emit("showDebate",true)'>           
	              <v-icon >insert_chart</v-icon>
	              </v-btn>
	              </v-layout>
	              <v-divider></v-divider>
	      	</div>

	<!-- bottom post buttuns -->
	            <div style="position:relative;">
	              <v-layout>

	              	<v-spacer></v-spacer>
	               <v-btn flat error @click='warning = true'>           
	               cancel
	              </v-btn>

	              <v-btn flat :disabled='!postData.active' @click='postData.post = !postData.post' >           
	               post
	              </v-btn>

	            </v-layout>
	          </div>
	      </div>

	          </v-container>


	         </v-card>

	         <!-- warning -->

	         <v-dialog v-model='warning' :max-width='210'>
	         	<v-card>
	         		<v-container>
	         			<p class="body-2 text-xs-center">All data will be removed</p>
	         		</v-container>
	         		<v-layout>
	         			<v-btn @click='cancel()' flat error>
	         				remove
	         			</v-btn>

	         			<v-btn @click='warning = false' flat>
	         				keep
	         			</v-btn>
	         		</v-layout>
	         	</v-card>
	         </v-dialog>

	       </v-dialog>

<!-- fixed floating button  -->
		<div v-show='spdiv'>
		<v-fab-transition>
	       <v-btn v-show='sp' @click.stop='postPop'
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
import vue2Dropzone from 'vue2-dropzone'
import 'vue2-dropzone/dist/vue2Dropzone.css'

const debateCreater = () => import('../debate/debateCreater')
const debatePreView = ()=> import('../debate/debatePreView')
import {bus} from '../../main'
	export default{

			props:['postData'],
			components:{
				vueDropzone: vue2Dropzone,
				debateCreater,
				debatePreView
			},
		data(){
			return{
				dropzoneOptions: {
				          url: `${this.$store.state.server}picture/upload`,
				          thumbnailWidth: 150,
				          maxFilesize: 20,
				          dictDefaultMessage: "Drop or Click here to Upload image!"
				 },
				upImage:false,
				upImageUrl:false,
				dz:false,
				offsetTop:'',
				lastScroll:0,
				sp:true,
				pole:false,
				caption:'',
				imgBtn:false,
				linkBtn:false,
				poleBtn:false,
				spdiv:false,
				debatePre:false,
				warning:false

			}
		},
		watch:{
			'postData.pop':function(i){
				this.spdiv = !i
			},
			'postData.caption':function(){
				this.textareaResize(document.querySelector('.cap textarea'))
			},
			'postData.pole':function(i){
				i === null ?(this.debatePre = false , setTimeout(()=>{this.poleCanceled()},500)):null
			},
		},
		methods:{
			postPop(){
			this.postData.edit = false;
			this.postData.caption = '';
			this.postData.image = '';
			this.imageCancel();
			this.postData.pop =true;
			},
			imageUpload(file,respond){
	        	this.imgBtn = true;
		        this.dz= false;
		        this.upImageUrl=`${this.$store.state.server}picture/${respond.imageId}`
		        this.upImage = true;
		        this.postData.image = this.upImageUrl;

		        // disabling btns
		        this.linkBtn = true;
		        this.poleBtn = true;

  			},
		  	imageCancel(){

		  		if(this.postData.image !== ''){
			  		this.imgBtn = false;
				    this.dz = false;
				    this.upImage = false;
				    this.$refs.myVueDropzone.removeAllFiles();
					this.postData.image = ''

					// enabling btns 
					this.linkBtn = false;
					this.poleBtn = false;
				}	

		  },
		  cancel(){
	  		this.warning = false;
	  		this.postData.pop = false;
		  	setTimeout(()=>{
		  		this.postData.caption = '';
		  		this.postData.image = '';
		  		this.imageCancel();
		  		this.poleCanceled();
		  		this.$bus.$emit('poleCancel',true);
		  	},500)
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
     	 textareaResize(el){
     	 	setTimeout(function(){
     	 	   el.style.cssText = 'height:auto; padding:0';
     	 	   // for box-sizing other than "content-box" use:
     	 	   el.style.cssText = '-moz-box-sizing:content-box';
     	 	   el.style.cssText = 'height:' + el.scrollHeight + 'px';
     	 	 },0);

     	 },
     	 poleCanceled(){

     	 	this.imgBtn = false;
     	 	this.linkBtn = false;

     	 }
		},
		mounted(){
			this.spdiv = true;
			// new post 
			bus.$on('postCreated',p=>{  
				this.cancel();
			})

			// old post edting
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
			        this.upImageUrl=i.post.image;
			        this.upImage = true;
			        this.postData.image = this.upImageUrl;

		        }
			})

			this.$bus.$on('poleData',(r)=>{
				this.postData.pole  = r;
				this.debatePre = true;
				this.imgBtn = true;
				this.linkBtn = true;
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
.overflow{
  position: relative;
  overflow: scroll;
  min-height: 0px;
  max-height: 300px;
}
.bottom{
	top: 100%;
transform: translateY(-100%);
}

.cap textarea{
	font-size: 24px !important;
	overflow:hidden;
	min-height: 64px;
	line-height: 135%;
	height: 51px;
}

</style>