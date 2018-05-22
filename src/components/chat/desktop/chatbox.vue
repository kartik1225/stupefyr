<template>
<div >
					<!-- user chat session starts here.................................. -->
					<v-container grid-list-md style='z-index:10;' v-show='showChat'>
					<!-- user toolbar strip starts here -->
					<v-list-tile avatar style='x-index:10'>
						<v-list-tile-avatar>
					    	<img src="/static/image.jpg"/>
					  	</v-list-tile-avatar>
					  
					  	<v-list-tile-content>

						  	<!-- user name -->
						    <v-list-tile-title class='black--text' v-text="'kartik'"></v-list-tile-title>

						    <!-- online/last seen -->
						    <v-list-tile-sub-title class='green--text' v-html='"online"'></v-list-tile-sub-title>
					  	</v-list-tile-content>

					  	<v-list-tile-action class='hidden-lg-and-up'>
					  	<!-- show if user is online -->
					    	<v-icon>more_vert</v-icon>
					    </v-list-tile-action>
					</v-list-tile>

					<v-layout column justify-start>
					<div class="chatbox grey lighten-4"  >
					<v-container>
					<!-- chat component all components goes here-->
					<chatDisplay :chat='chat'></chatDisplay>
					</v-container>
					</div>


					<!-- middle component chatting display -->
					<v-layout>

						<!-- user input feald all msgs wll written here -->
						<v-text-field  	@keyup.enter='sendMsg'
						                label="type your msg here..."
						               	single-line
						                full-width
						                hide-details
						                v-model='inputText'
						                autofocus
						                id='focus'
						           	    ></v-text-field>

						    <!-- send msg to server -->
							<v-btn icon style='margin: auto;' @click="sendMsg" >
						        <v-icon>send</v-icon>
						    </v-btn>

						    <!-- all emojis popup and button  -->
		           	        <v-dialog   hide-overlay class='elevation-0 ' content-class='emoji' v-model="dialog2" lazy absolute width='336px;' style='margin:auto;'>
			           	        <v-btn slot="activator" icon >
			           	    		<v-icon>sentiment_very_satisfied</v-icon> 
			           	     	</v-btn>
							<picker onclick="document.getElementById('focus').focus(); return false;" style='width: 338px;position:absolute;bottom: 18vh;right: 14vw;'  @click='em' class=' elevation-0' emoji='' :autoFocus='false' title="Pick your emoji…" set="apple"></picker>
		           	        </v-dialog>

		           	        <!-- upload picture or video -->
		           	        <v-dialog v-model="dialog" lazy  width='500px' style='margin:auto'>
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
					</v-layout>
					</v-container>
	</div>
</template>

<script>
import chatDisplay from '../chatDisplay'
export default {
	props:['heightStyle'],
	components:{
			chatDisplay
		},
	data(){
		return{
			showChat:false,
			dialog2:false,
			dialog:false,
			inputText:'',
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

					]
		}
	},
	methods:{
		sendMsg(){
      			this.chat.push({
					self:true,
					msg:this.inputText,
					again:false
				})

      			this.dialog2= false;
				this.inputText = '';
				this.scrollDown()
		},
		em(e ){
				console.log(e)

				this.inputText += e.native	
			},
		onResize () {
        		this.windowSize = { x: window.innerWidth, y: window.innerHeight }
        		var container = this.$el.querySelector(".chatSection");
        		this.heightStyle.input = container.clientHeight - 64 -64  + 'px';
      		}
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

li{
	list-style: none;
}
	
</style>