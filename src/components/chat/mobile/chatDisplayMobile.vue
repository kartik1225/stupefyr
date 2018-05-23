<template>

<!-- 	::readme::

		route-path : allList.vue => " THIS COMPONENT " => userChatProfile.vue -->


<!-- main div covers entire page -->
<div style="position:relative" class="amber " v-resize="onResize">

	<!-- toolbar strip with usre profile picture -->
	<div class="elevation-1 white" style="position:fixed;width:100%; display:block; z-index:10">
		<v-list-tile avatar href to='/test/chat/kartik/profile' >
			<v-list-tile-avatar>

				<!-- profile image -->
				<img src="/static/image.jpg"/>
			</v-list-tile-avatar>
			<v-list-tile-content>

				<!-- user name -->
				<v-list-tile-title v-text="'kartik'" class='black--text'></v-list-tile-title>
			</v-list-tile-content>
			<v-list-tile-action>

				<!-- more opctions -->
				<v-btn icon>
					<v-icon class='' >more_vert</v-icon>
				</v-btn>
			</v-list-tile-action>
		</v-list-tile>
	</div>

	<!-- chat component -->
	<div class="overfloww scroll scroll-y"  id="scroll-target"  :style="{height:divHeight}">
		<v-container grid-list-md  >
			<!-- chat component all chat will going to display here-->
			<chatDisplay :chat='chat'></chatDisplay>
		</v-container>
	</div>

	<!-- this is a user input bottom div -->
	<div style="position:fixed;bottom:0;width:100%">
		<v-card class='elevation-4'>
			<v-layout>

			<!-- msg will creat here -->
			<v-text-field   @keyup.enter='sendMsg'
			                label="type your msg here..."
			                single-line
			                full-width
			                hide-details
			                v-model='inputText'
			                autofocus
			           	    ></v-text-field>

			 <!-- send msg to server -->
		    <v-btn icon style='margin: auto;' @click="sendMsg" >
	   	    	<v-icon>send</v-icon>
	   	    </v-btn>

	   	    <!-- emogi pop section -->
		        <v-dialog hide-overlay v-model='dialog2' lazy absolute width='500px' style='margin:auto'>
			 		<v-btn slot="activator" @click.prevent icon >
			   	    	<v-icon>sentiment_very_satisfied</v-icon>
			   	    </v-btn>
					<picker @click='em' emoji='' :autoFocus='false' title="Pick your emoji…" set="apple" style='position:absolute; bottom:65px; right:5px;'></picker>
		        </v-dialog>

		        <!-- image upload section -->
		        <v-dialog v-model="dialog" lazy absolute width='500px' style='margin:auto'>
			     	<v-btn slot="activator" icon>
				        <v-icon>add_a_photo</v-icon>
				    </v-btn> 
				    <v-card height='300px' >
					    <dropzone style='width:100%;height:100%' id="myVueDropzone" url="https://httpbin.org/post" v-on:vdropzone-success="showSuccess">
				        <!-- Optional parameters if any! -->
				        <input type="hidden" name="token" value='upload here'>
					    </dropzone>
			        </v-card>
	        	</v-dialog>
			</v-layout>
		</v-card>
	</div>
</div>
</template>

<script>
import Dropzone from 'vue2-dropzone'
import chatDisplay from '../chatDisplay'
import { Picker } from 'emoji-mart-vue'
import { Emoji } from 'emoji-mart-vue'

	export default{
		components:{
			chatDisplay,
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
				  progress:false
				},

				chat:[
				{self:true,msg:'hi' ,again:false},
				{self:true,msg:'hi' ,again:true},
				{self:false,msg:'just' ,again:false},
				{self:true,msg:'met' ,again:false},
				{self:false,msg:'you' ,again:false},
				{self:true,msg:'andgfs fs fgs dfg gdf dfg bdf f dfg g dfg dgf dfg ' ,again:false},
				{self:false,msg:'this' ,again:false },
				{self:false,msg:'bla' ,again:true },
				{self:false,msg:'bldfa saf g asfg sdfg. dfg s dfg  sfdg df g sdf gsd fg sdf g sd f gd fg sd f gsd fg sd fg sd f gs df gs df g sdf. gsdf g sdf g s df g sd f gs df ' ,again:true },
				{self:true,msg:'andgfs fs fgs dfg gdf dfg bdf f dfg g dfg dgf dfg ' ,again:false},
				{self:false,msg:'this' ,again:false },
				{self:false,msg:'bla' ,again:true },
				{self:false,msg:'bldfa saf g asfg sdfg. dfg s dfg  sfdg df g sdf gsd fg sdf g sd f gd fg sd f gsd fg sd fg sd f gs df gs df g sdf. gsdf g sdf g s df g sd f gs df ' ,again:true }

					],
				inputText:'',
				txt:'',
				divHeight:'500px',
				windowSize: {
				        x: 0,
				        y: 0
				      },
				dialog: false,
				test: true,
				dialog2: false,
				test2: true
			}
		},
		mounted () {
      this.onResize()
    },
		methods:{
			sendMsg(){
      			this.chat.push({
					self:true,
					msg:this.inputText,
					again:false
				})
				this.inputText = '';
	
				this.scrollDown()


			},
			scrollDown(){
						setTimeout(()=>{
							var container = this.$el.querySelector(".scroll");
							this.divHeight = this.windowSize.y - 63 - 64 - 64 + 'px';
			      			container.scrollTop = container.scrollHeight;
			      		},50)
						},

			em(e){
				console.log(e)

				this.inputText += e.native	
			},
			onResize () {
        		this.windowSize = { x: window.innerWidth, y: window.innerHeight }
      		}
			
		},
		created(){

			this.scrollDown()
		}
	}
</script>

<style scoped>
.overfloww{
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