<template>
	<div v-resize="onResize" :style="$vuetify.breakpoint.width < 600?`height:calc(${$vuetify.breakpoint.height}px - 120px)`:null">

	<!-- this is a background for material designe..	 -->
	<v-card v-show='$vuetify.breakpoint.width > 600?true:false' class='amber' height='250px' @click='showChat = !showChat'>
	</v-card>


	<v-slide-y-transition>
	<v-toolbar light v-show='$vuetify.breakpoint.width < 600 && $route.name === "conversation" || $vuetify.breakpoint.width < 600 && $route.name === "chatProfile" ?true:false' color="amber" style='position:fixed; margin-top:-56px; z-index:3;'>
		<v-btn icon class='amber' @click='$router.go(-1)'>
			<v-icon>
				keyboard_backspace
			</v-icon>
		</v-btn>
		<span class="title">{{$route.name === 'chatProfile'?'profile':$route.name}}</span>
	  </v-toolbar>
	</v-slide-y-transition>
	<v-layout justify-space-around style=''>

	<!-- main content start from here -->

		<v-card class='transparent elevation-0'  :style='$vuetify.breakpoint.width < 600?`width:100%`:`margin-top:-190px; width:100%;`'>
			<v-container grid-list-xs>
				<v-layout>
				<v-flex sm4 md4 lg3 v-show='mobileView.list'>

					<!-- the very sidebar avtar start from here -->
					<v-card :height='$vuetify.breakpoint.width < 600? "calc("+$vuetify.breakpoint.height + "px - 56px)":"76vh"' >

						<!-- search box -->
						<v-layout v-show='false'>
						<v-text-field			  
					                  label="search here.."
					                  single-line
					                  full-width
					                  hide-details
					                ></v-text-field>

					    <!-- search icon -->
		                <v-btn icon style='margin:auto; margin-right:10px'>
		                	<v-icon>search</v-icon>
		                </v-btn>
					    </v-layout>

					    <!-- all user's friend list -->
						<div class="overfloww">				
							<v-container grid-list-md ripple>
								<v-list>
									<template v-for='user in list' v-if='list.length > 0'>
								          <v-list-tile avatar @click='gotochat(user.follow)'>
								          <v-list-tile-avatar>
								              <img :src="`${$store.state.server}picture/${user.follow.image}`"/>
								            </v-list-tile-avatar>
								            
								            <v-list-tile-content>

								            <!-- user name -->
								              <v-list-tile-title v-text="user.follow.name"></v-list-tile-title>

								              <!-- subtitle of last convercation -->
								              <v-list-tile-sub-title v-html='"start a talk with "+user.follow.name'></v-list-tile-sub-title>
								            </v-list-tile-content>
								            <v-list-tile-action>

								            	<!-- show if user is online -->
								              	<v-icon class='green--text' style='font-size:12px;'>brightness_1</v-icon>
								            </v-list-tile-action>
								          </v-list-tile>
								    </template>
								</v-list>
							</v-container>
						</div>
					</v-card>
				</v-flex>

				<!-- top toolbar strip -->
				<v-flex v-show='mobileView.chat' sm8 :hidden-md-and-down='chatMd' >
					<!-- later -->
					<v-card :height='$vuetify.breakpoint.width < 600? null:"76vh"'  :class='$vuetify.breakpoint.width > 600?`chatSection grey lighten-4`:`chatSection grey lighten-4 elevation-0`' >

					<!-- if user has no chat history or if user is new then display this -->
						<v-container v-show='!showChat'>
						<v-layout  justify-center align-center>
						<v-card class='elevation-0 transparent'>
						<v-container fluid>
						<br>
						<h1 class="text-xs-center display-1">its all empty!</h1>
						<v-layout justify-center>
						<v-icon style='font-size:280px;'>sms_failed</v-icon>
						</v-layout>
						<h1 class="text-xs-center display-1">select user to start chatting</h1>

						    <v-container>
						    	<h1 class="title text-xs-center grey--text">follow pepole to chat</h1>
							</v-container>
						</v-container>
						</v-card>
						</v-layout>
						</v-container>

						<!-- user active chat secction -->
						<v-slide-x-transition>
						<v-container grid-list-md style='z-index:10;'  v-show='showChat'>
						<!-- user toolbar strip starts here -->
						<v-list-tile avatar :style="$vuetify.breakpoint.width > 600?`z-index-1`:`position:fixed;width:100%; display:block; z-index:1`" @click='$router.push("/chat/"+activeUser._id+"/profile")'>
							<v-list-tile-avatar>
						    	<img class='elevation-2' :src="`${this.$store.state.server}picture/${activeUser.image}`"/>
						  	</v-list-tile-avatar>
						  
						  	<v-list-tile-content>
  
							  	<!-- user name   -->
							    <v-list-tile-title class='black--text' v-text="activeUser.name"></v-list-tile-title>

							    <!-- online/last seen -->
							    <v-list-tile-sub-title class='green--text' v-html='typing === true?`typing...`:"online"'></v-list-tile-sub-title>
						  	</v-list-tile-content>

						  	<v-list-tile-action class='hidden-lg-and-up'>
						  	<!-- show if user is online -->
						    	<v-icon>more_vert</v-icon>
						    </v-list-tile-action>
						</v-list-tile>

						<v-layout column justify-start >

							<!-- noooooooo -->
						<div class="chatbox grey lighten-4" :style='`height:${heightStyle.input}`' >
						<v-container>

						<!-- chat component all components goes here-->

						<!-- <chatDisplay :chat='chat'></chatDisplay> -->	
						<router-view name='chatDisplay' :chat='chat' :activeUser='activeUser'></router-view>

						</v-container>
						</div>


						<!-- middle component chatting display -->
						<v-layout :style="$vuetify.breakpoint.width > 600?null:`position:fixed;bottom:0;width:100%`">

							<!-- user input feald all msgs wll written here -->
							<v-text-field  	@keyup.enter='sendMsg'
											@keyup="keyup"
							                label="type your msg here..."
							               	single-line
							                full-width
							                hide-details
							                v-model='inputText'
							                autofocus
							                id='focus'
							           	    ></v-text-field>

							    <!-- send msg to server -->
								<v-btn :disabled='inputText === ""?true:false' icon style='margin: auto;' @click="sendMsg" >
							        <v-icon>send</v-icon>
							    </v-btn>

							    <!-- all emojis popup and button  -->
			           	    

			           	        <v-menu
			           	              offset-x
			           	              :close-on-content-click="false"
			           	              style='margin:auto;'
			           	            >
			           	                <v-btn slot="activator" icon >
			           	              		<v-icon>sentiment_very_satisfied</v-icon> 
			           	               	</v-btn>
			           	              	<v-card>
			           	 				<picker onclick="document.getElementById('focus').focus(); return false;" @click='em' class=' elevation-0' emoji='' :autoFocus='	false' title="Pick your emoji…" set="apple"></picker>
			           	 				</v-card>
			           	            </v-menu>

			           	        <!-- upload picture or video -->
			           	        <v-dialog v-model="dialog" lazy  width='500px' style='margin:auto'>
				           	         	<v-btn slot="activator" icon>
							           	     <v-icon>add_a_photo</v-icon>
							           	</v-btn>
					           	        <v-card height='300px'>
					           	        </v-card>
			           	        </v-dialog>

							</v-layout>
						</v-layout>
						</v-container>
						</v-slide-x-transition>
					</v-card>
				</v-flex>

				<!-- theird part user profile and more-->

				<!-- this will also should open when user clicks on the toolbar strip -->


							<router-view name='chatProfile'></router-view>

				</v-layout>
			</v-container>
		</v-card>
	</v-layout>
	</div>
</template>


<script>

const postPhotos  = ()=> import('../post/postPhotos')
import Dropzone from 'vue2-dropzone'
import chatDisplay from './chatDisplay'
import { Picker } from 'emoji-mart-vue'
import { Emoji } from 'emoji-mart-vue'
import {bus} from '../../main'
import axios from 'axios'

	export default{
		props:['list'],
		components:{
			chatDisplay,
			postPhotos,
			Picker,
			Emoji,
			Dropzone
		},
		data(){
			return{
				body:{
				  drawer:true,
				  colour:'blue-grey darken-3',
				  title:'chatting',
				  progress:false,
				},
				Chatdata:[],
				chat:[
				{self:true,msg:'hi' ,again:false},
				{self:true,msg:'hi' ,again:true},
				{self:false,msg:'just' ,again:false},
				{self:true,msg:'met' ,again:false},
				{self:false,msg:'you' ,again:false},
				{self:true,msg:'andgfs fs fgs dfg gdf dfg bdf f dfg g dfg dgf dfg ' ,again:false},
				{self:false,msg:'this' ,again:false },
				{self:false,msg:'bla' ,again:true },
				{self:false,msg:'bldfa saf g asfg sdfg. dfg s dfg  sfdg df g sdf gsd fg sdf g sd f gd fg sd f gsd fg sd fg sd f gs df gs df g sdf. gsdf g sdf g s df g sd f gs df ' ,again:true }

					],
				inputText:'',
				activeUser:'',
				txt:'',
				showChat:false,
				dialog:false,
				test:false,
				dialog2:false,
				timeNow:1,
				lastClicked:0,
				windowSize: {
				        x: 0,
				        y: 0
				      },
				heightStyle:{
					input:'',
					container:''
				},
				typingTimer:null,
				mobileView:{
					list:true,
					chat:true,
					profile:true
				},
				chatMd:false,
				typing:false
			}
		},
		sockets:{
			// sockets.on
			got_msg(_){
				bus.$emit('newMsg',_);
				this.scrollDown();
			},
			user_typing(_){
				this.typing = _.typing;
			}
		},
		watch:{
			inputText(i){
				
				this.$socket.emit('typing',{user:this.activeUser._id,typing:true})

				clearTimeout(this.typingTimer); 

				
					// const data2 = {
				 //        	user:this.activeUser._id,
				 //        	typing:true
				 //        }

				 //        this.$socket.emit('typing',data2)


					// const data = {
				 //        	user:this.activeUser._id,
				 //        	typing:false
				 //        }
					

					// this.timeNow = (new Date()).getTime();

				 //    if (this.timeNow > (this.lastClicked + 5000)) {
				 //        // Execute the link action
				        

				 //        setTimeout(()=>{
				 //        	this.$socket.emit('typing',data)
				 //        },500)

				 //    }

				 //    this.lastClicked = this.timeNow;

			},
			'$route.path'(){
				this.responsive();
				this.onResize();
				this.load();
			}
		},
		mounted () {
		      this.onResize()
		      this.load()
		      this.responsive();

		      bus.$emit('breadcrumbs', {path:'/chat'});
		},
		methods:{
			load(){
				      // waching router if user is allready exist
				      if(this.$route.name === 'conversation' || this.$route.name === 'chatProfile'){
					      if(this.$route.params.id){
					      	this.showChat=true;
					      	axios.get(`${this.$store.state.server}user/get/${this.$route.params.id}`,this.$store.getters.auth).then(r => {
					      		this.activeUser = r.data;
					      		console.log('uuusserrw',r.data);
					      	}).catch(e=>{
					      		console.log(e);
					      	})
					      }else{
					      	this.showChat = false;
					      }
				  	  }
			},
			responsive(){
				if(this.$vuetify.breakpoint.width < 600){
				this.$route.name === 'chat'  ? (this.mobileView.list = true,this.mobileView.chat = false,this.mobileView.profile = false):null;
				this.$route.name === 'conversation' ? (this.mobileView.chat = true,this.mobileView.list = false,this.mobileView.profile = false) : null;
				this.$route.name === 'chatProfile' ? (this.mobileView.profile = true,this.mobileView.list = false,this.mobileView.chat = false) : null;
			}else {
				this.mobileView.list = true;
				this.mobileView.chat = true;
				this.mobileView.profile = true;
			}
				this.$route.name === 'chatProfile'?this.chatMd = true: this.chatMd = false;
			},
			keyup(e){

				clearTimeout(this.typingTimer);

				this.typingTimer = setTimeout(()=>{

				this.$socket.emit('typing',{user:this.activeUser._id,typing:false})
				},500)

			},
			sendMsg(){
				if(this.inputText === ''){
					// error

				}else{
	      			this.chat.push({
						self:true,
						msg:this.inputText,
						again:false
					})

					const data = {
						user:this.$store.getters.id,
						to:this.activeUser._id,
						msg:this.inputText
					}

					bus.$emit('newMsg',data);

	      			axios.post(`${this.$store.state.server}chat/send`,data,this.$store.getters.auth).then(r=>{ 
	      				// console.log(r.data);
	      				bus.$emit('successMsg',r.data);
	      				// sending msg to socket io
	      				this.$socket.emit('typing',{user:this.activeUser._id,typing:false})
	      				this.$socket.emit('msg_created',r.data);
	      			}).catch(e => {
	      				console.log(e);
	      			})
	      			this.dialog2= false;
					this.inputText = '';
					this.scrollDown()
				}
			},
			// all chat window functions
			gotochat(i){
				this.$router.push('/chat/'+i._id)
				this.showChat = true;
				this.activeUser = i;
			},
			scrollDown(){
			setTimeout(()=>{
				var container = this.$el.querySelector(".chatbox");

      			container.scrollTop = container.scrollHeight;
      		},50)
			},

			em(e ){
				console.log(e)

				this.inputText += e.native	
			},
			onResize () {
				this.load()
				this.responsive();
        		this.windowSize = { x: window.innerWidth, y: window.innerHeight }
        		var container = this.$el.querySelector(".chatSection");
        		if(this.$vuetify.breakpoint.width > 600){

        		this.heightStyle.input = container.clientHeight - 64 - 64  + 'px';

        		}else{

        			this.heightStyle.input = this.$vuetify.breakpoint.height  - 63 - 64 - 64 + 'px; margin-top:56px';
        		}
      		}
		},
		updated(){
			this.scrollDown()
		}
	}
</script>

<style scoped>
.chatbox{

overflow: auto;
}

.overflow{
	overflow-x: auto;
	overflow-y: auto;
}
.center{
	margin-bottom: auto;
    margin-left: 0;
    margin-top: auto;
}

.max{
	max-width: 75%;
	border-radius: 5px;
}

.wraper{

}

.space{
	position: absolute;
	margin-top: 2px;
}


.sideImg{
	background-repeat: no-repeat !important;
	background-position: 50% !important;
	border-radius: 50% !important;
	width: 170px !important;
	height: 170px !important;

}

.avtar{

    background-repeat: no-repeat !important;
    background-position: 50% !important;
    border-radius: 50% !important;
    width: 40px !important;
    height: 40px !important;
    margin-right: 10px !important;

}

.emoji{
	margin-top: 15vh !important;

}

..overfloww{
	position: absolute;
	left: 0;
	right: 0;
    margin-top: 64px;
    margin-bottom: 64px;

}

li{
	list-style: none;
}

</style>