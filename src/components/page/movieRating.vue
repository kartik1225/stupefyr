<template>
<div v-resize='onResize'>

<v-card class='light-green lighten-2 hidden-xs-only' height='200px'>
<v-layout justify-center>
	<h2>this is a movie title</h2>
</v-layout>
</v-card>

<!-- rating card -->
<v-layout justify-center>
<v-flex xs12>

<!-- for desktop -->
<desktopComponent class='hidden-xs-only'></desktopComponent>

<!-- for small display -->
<mobileComponent class='hidden-sm-and-up'></mobileComponent>

<!-- more cards -->

<v-flex offset-md2  md8>
	<!-- user feed back card yes/no -->
	<v-slide-x-reverse-transition>
		<v-card class='orange darken-1' v-show='feed.feedbox'>
			<v-layout>
				<v-container>
				<p class="display-2 text-xs-center white--text"> have you seen this movie yet?</p>
				<v-layout>

				<!-- yes button -->
				<v-flex xs6 >
					<div>
						<v-layout justify-center>
						<v-btn block large outline class=' white--text' @click='feed.yes = false , feed.feedbox =false'>
							yes
						</v-btn>
						</v-layout>

						<br>

						<!-- if yes then user can do this things -->
						<p class="text-xs-center white--text caption">if yes then you can do followings..</p>
						<v-chip outline class='white--text'>give a review</v-chip>
						<v-chip outline class='white--text'>talk about it</v-chip>
						<v-chip outline class='white--text'>share your thought</v-chip>
						<v-chip outline class='white--text'>suggest</v-chip>
					</div>
				</v-flex>

				<!-- no button -->
				<v-flex xs6>

					<div>
						<v-layout justify-center>
							<v-btn block large outline class='white--text' @click='feed.no = false, feed.feedbox =false'>
								no
							</v-btn>
						</v-layout>

						<br>	

						<!-- if no then user can do this things -->
						<p class="text-xs-center white--text caption">if you don't then see this things first !</p> 
						<v-chip outline class='white--text'>look at castings</v-chip>
						<v-chip outline class='white--text'>recomendations</v-chip>
						<v-chip outline class='white--text'>talk to community</v-chip>
					</div>
				</v-flex>
				</v-layout>
				</v-container>
				
			</v-layout>
		</v-card>
	</v-slide-x-reverse-transition>

		<br>
	<yesAction :feed='feed'></yesAction>
	<noAction :feed='feed'></noAction>

		<br>

	<!-- tabs for casting , best plot , more suggestions -->
		<v-card>
			
		<!-- tab stuff starts here -->
			<v-tabs dark fixed icons centered>
			    <v-tabs-bar slot="activators" class="cyan">
			      <v-tabs-slider class="yellow"></v-tabs-slider>

			      <!-- tabs icons and names -->
			      <v-tabs-item href="#casting">
			        <v-icon>face</v-icon>
			        casting
			      </v-tabs-item>
			      <v-tabs-item href="#bestplot">
			        <v-icon>timeline</v-icon>
			        best plot
			      </v-tabs-item>
			      <v-tabs-item href="#more">
			        <v-icon>content_copy</v-icon>
			       	suggestions
			      </v-tabs-item>
			    </v-tabs-bar>

			    <!-- casting route tab -->
			    <v-tabs-content
			      id="casting"
			    >
			      <v-card flat>

			        

			        <!-- character component  -->


			        <character v-show='true'></character>


			      </v-card>
			    </v-tabs-content>


<!-- best plot tab -->
			    <v-tabs-content
			      id="bestplot"
			    >

			    <!-- best plot card  -->
			      <v-card flat>
			      	<v-container fluid>
			      	  <v-layout>

			      	  <!-- user avatar image -->
			      	    <img src='/static/image.jpg' class="cirr"/>

			      	    <!-- user name -->
			      	    <p class="subheading" style="margin-top:auto; margin-bottom:auto; margin-left:5px;">kartik</p>
			      	    <v-icon style='font-size:14px;'>play_arrow</v-icon>

			      	    <!-- user post priority -->
			      	    <p class="caption" style="margin-top:auto; margin-bottom:auto; margin-left:2px;">movie title</p>
			      	    <v-icon style='margin-left:2px; font-size:20px;'>movie</v-icon>
			      	    <div style='position:absolute; right:0px;'>

			      	    <!-- more option to edit or remove post -->
			      	    <v-menu bottom left  >
			      	      <v-btn icon slot="activator" light class='orange--text'>
			      	        <v-icon>more_vert</v-icon>
			      	      </v-btn>

			      	    </v-menu>

			      	    </div>  
			      	  </v-layout>

			      	  <!-- user post title  -->
			      	  <br>
			      	  <v-card class='elevation-0 light-green'>
			      	  	<v-container>
			      	  		<h1 class="display-1 white--text">this part is awosome!
			      	  		<br>when bla bla happens ✌️
			      	  		</h1>
			      	  	</v-container>

			      	  			 <v-card-actions>
			      	  	          <!-- like butten -->
			      	  	         <v-btn flat   v-tooltip:top="{ html: 'like' }">
			      	  	           <v-icon class="white--text">thumb_up</v-icon>
			      	  	         </v-btn>

			      	  	         <v-spacer></v-spacer>

			      	  	         <!-- comment butten -->
			      	  	         <v-btn icon @click.native="show = !show" class="white--text" v-tooltip:top="{ html: 'comments' }">
			      	  	                     <v-icon>{{ show ? 'chat_bubble_outline' : 'chat_bubble' }}</v-icon>
			      	  	                   </v-btn>

			      	  	         <v-spacer></v-spacer>

			      	  	         <!-- share butten -->
			      	  	         <v-btn flat  v-tooltip:top="{ html: 'share post' }">
			      	  	          <v-icon class="white--text">share</v-icon>
			      	  	         </v-btn>

			      	  	       </v-card-actions>

			      	  	      


			      	  </v-card>
			      	  	<!-- content visibility -->
			      	  	   <div v-show='show'>

			      	  	   <!-- comment creation by user -->
			      	  	   <v-container fluid>
			      	  	   <v-layout row wrap >

			      	  	     <!-- comment user profile image -->
			      	  	     <v-flex  md1 hidden-sm-and-down>
			      	  	       <v-list-tile-avatar>
			      	  	         <img src="/static/image.jpg"/>
			      	  	       </v-list-tile-avatar>
			      	  	     </v-flex>

			      	  	     <!-- commet input-box -->
			      	  	     <v-flex sm10 md9 >
			      	  	               <v-text-field
			      	  	                             label="Subject"
			      	  	                             placeholder='your thought?'
			      	  	                             single-line
			      	  	                             full-width
			      	  	                             hide-details
			      	  	                             ></v-text-field>
			      	  	     </v-flex>

			      	  	     <!-- comment post buttun -->
			      	  	         <v-layout row justify-center >
			      	  	         <v-flex xs1>
			      	  	         <v-btn class='white--text' icon>
			      	  	           <v-icon>send</v-icon>
			      	  	           </v-btn>
			      	  	         </v-flex>
			      	  	           </v-layout>

			      	  	   </v-layout>
			      	  	   </v-container>

			      	  	   <!-- comment loop -->
			      	  	   <postCmt :items='items'></postCmt>

			      	  	   </div>


			      	</v-container>
			      </v-card>
			    </v-tabs-content>

			    <v-tabs-content
			      id="more"
			    >

			    <!-- user suggestions card for more related movies movies -->
			      <v-card flat>
			      <v-container>
			      <v-layout>

			      <!-- user avatar image -->
			        <img src='/static/image.jpg' class="cirr"/>

			        <!-- user name -->
			        <p class="subheading" style="margin-top:auto; margin-bottom:auto; margin-left:5px;">kartik</p>
			        <v-icon style='font-size:14px;'>play_arrow</v-icon>

			        <!-- user post priority -->
			        <p class="caption" style="margin-top:auto; margin-bottom:auto; margin-left:2px;">movie title</p>
			        <v-icon style='margin-left:3px; font-size:14px;'>movie</v-icon>
			        <v-icon style=' font-size:14px;'>play_arrow</v-icon>
			        <p class="caption" style="margin-top:auto; margin-bottom:auto; margin-left:5px;">suggested</p>
			        <v-icon style='font-size:17px; margin-left:2px;'>whatshot</v-icon>
			        <div style='position:absolute; right:0px;'>

			        <!-- more option to edit or remove post -->
			        <v-menu bottom left  >
			          <v-btn icon slot="activator" light class='orange--text'>
			            <v-icon>more_vert</v-icon>
			          </v-btn>

			        </v-menu>

			        </div>  
			      </v-layout>
			      <div style="margin-left:42px;">
			      <p >this is  best movie to watch... this is a rabdom text for testing </p>
			      </div>
			      <v-card class='elevation-0'>
			      <v-container  grid-list-xs>

			      <v-card class='blue lighten-3'>
			      <v-layout>
			      <img src='/static/poster.jpg'  height="200px">
			      <v-container fluid  >
			      	<p class='title'>this is movie title </p>

			      	<p class="caption"><strong>42</strong> pepole 👍 this</p>
			      </v-container>
			      </v-layout>
			      </v-card>

			      		 <v-card-actions>
			                <!-- like butten -->
			               <v-btn flat   v-tooltip:top="{ html: 'like' }">
			                 <v-icon class="black--text">thumb_up</v-icon>
			               </v-btn>

			               <v-spacer></v-spacer>

			               <!-- comment butten -->
			               <v-btn icon @click.native="show = !show" class="black--text" v-tooltip:top="{ html: 'comments' }">
			                           <v-icon>{{ show ? 'chat_bubble_outline' : 'chat_bubble' }}</v-icon>
			                         </v-btn>

			               <v-spacer></v-spacer>

			               <!-- share butten -->
			               <v-btn flat  v-tooltip:top="{ html: 'share post' }">
			                <v-icon class="black--text">share</v-icon>
			               </v-btn>

			             </v-card-actions>
			      <!-- content visibility -->
			      	  	   <div v-show='show'>

			      	  	   <!-- comment creation by user -->
			      	  	   <v-container fluid>
			      	  	   <v-layout row wrap >

			      	  	     <!-- comment user profile image -->
			      	  	     <v-flex  md1 hidden-sm-and-down>
			      	  	       <v-list-tile-avatar>
			      	  	         <img src="/static/image.jpg"/>
			      	  	       </v-list-tile-avatar>
			      	  	     </v-flex>

			      	  	     <!-- commet input-box -->
			      	  	     <v-flex sm10 md9 >
			      	  	               <v-text-field
			      	  	                             label="Subject"
			      	  	                             placeholder='your thought?'
			      	  	                             single-line
			      	  	                             full-width
			      	  	                             hide-details
			      	  	                             ></v-text-field>
			      	  	     </v-flex>

			      	  	     <!-- comment post buttun -->
			      	  	         <v-layout row justify-center >
			      	  	         <v-flex xs1>
			      	  	         <v-btn class='white--text' icon>
			      	  	           <v-icon>send</v-icon>
			      	  	           </v-btn>
			      	  	         </v-flex>
			      	  	           </v-layout>

			      	  	   </v-layout>
			      	  	   </v-container>

			      	  	   <!-- comment loop -->
			      	  	   <postCmt :items='items'></postCmt>
			      	  	   </div>
			      </v-container>
			      </v-card>
			      </v-container>
			      </v-card>
			    </v-tabs-content>
			  </v-tabs>
		</v-card>
</v-flex>


</v-flex>
</v-layout> 

</div>
</template>

<script>
const postCmt = ()=> import('../post/postCmt')
const StarRating = ()=> import('vue-star-rating')
const desktopComponent = ()=> import('./movieRating/desktopComponent')
const mobileComponent = ()=> import('./movieRating/mobileComponent')
const character =()=> import('./character')
const  yesAction =()=>  import('./movieRating/yesAction')
const  noAction =()=>  import('./movieRating/noAction')


	export default{
		components:{
			desktopComponent,
			mobileComponent,
			character,
			StarRating,
			yesAction,
			postCmt,
			noAction
		},
		data(){
			return{
				testCol:'white--text',
				show:false,
				 width:0,
				 desktop:false,
				 mobile:false,
				 items: [
          {
            title: 'edit',
            icon: 'edit'
          },
          {
            title: 'delete',
            icon: 'delete'
          }
        ],
				 feed:{
				 	feedbox:true,
				 	rate:true,
				 	yes:true,
				 	no:true,
				 	size:'lg3'
				 }
			}
		},
		mounted(){
			this.onResize()
		},
		methods:{
			onResize(){
				this.width = window.innerWidth

			}
		}
	}
</script>

<style>
.sidebar{
	margin-top: -70px;
}

.center{
	margin: auto;
}

.profile{
    background-repeat: no-repeat !important;
    background-position: 50% !important;
    border-radius: 50% !important;
    width: 100px !important;
    height: 100px !important;
}

.cirr{
    background-repeat: no-repeat !important;
    background-position: 50% !important;
    border-radius: 50% !important;
    width: 40px !important;
    height: 40px !important;

}


</style>