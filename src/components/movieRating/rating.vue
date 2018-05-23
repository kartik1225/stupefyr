<template>

	<div>
		<br>
		<v-layout justify-center>
			<v-flex xs12 sm10>
				<v-layout :column='$vuetify.breakpoint.width < 800' :style='$vuetify.breakpoint.width < 800?`height:auto`:`height:500px`'>

						<!-- poster -->

							<img :style="$vuetify.breakpoint.width < 800?`width:100%;`:`height:100%;` " :src='`${$store.state.server}picture/${movie.poster}`'>

					<!-- raiting and more -->
					<div class='elevation-1 white ' style="width:100%; position:relative;">

					<div style="position:absolute; right:0;">
					<v-menu >
					     <v-btn   slot="activator" icon><v-icon>more_vert</v-icon></v-btn>
					     <v-list v-ripple role='button'>
					       <v-list-tile>
					        <v-list-tile-content>
								edit 
					        </v-list-tile-content>
					       </v-list-tile>
					     </v-list>
					   </v-menu>
					 </div>

					<v-container :class='$vuetify.breakpoint.width < 800?``:`v-middle`'>
						<!-- title -->
						<p class="display-1 text-xs-center">{{movie.title}}</p>

						<p class='text-xs-center display-1'>{{movie.avrRating}}</p>


						<!-- star rating indicater -->
						<v-layout justify-center>
						<star-rating v-bind:increment="0.1" 
						             v-bind:max-rating="5" 
						             inactive-color="#000" 
						             active-color="#f00" 
						             v-bind:star-size="40"
						             :padding='10'
						             :show-rating='false'
						             :read-only='true'
						             :rating='movie.avrRating'	
						             >
						</star-rating>
						</v-layout>

						<p class="text-xs-center" ><a @click='$bus.$emit(`raingCardPop`,true)'>{{movie.userRating === null?`( rate this )`:`( edit your rating )`}}</a></p>


						<!-- movie genres -->
						<v-layout justify-center wrap>
							<template v-for='gn in movie.genre'>
							<v-chip outline class='black--text'>{{gn}}</v-chip>
							</template>
						</v-layout>

						<v-layout justify-center>
						<v-btn large flat>become a fan &nbsp<v-icon>favorite</v-icon></v-btn>
						</v-layout>

					</v-container>
					</div>

				</v-layout>

					<br>

					<div>
						<v-card class='stripe white--text'>
							<v-container grid-list-md>
								<span class="title">Story overview</span>
								<v-icon class='white--text'>format_quote</v-icon>
							</v-container>
						</v-card>
						<v-card>
							
						</v-card>

						<v-card class='deep-purple lighten-4'>
							<v-container grid-list-md>

									<p class="subheading">{{movie.intro}}</p>

							</v-container>
						</v-card>
					</div>
					<br>



				<div class="white elevation-1" style="width:100%; margin-top:2px;">

					<!-- user feed back card yes/no -->
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


						<ratingCard :movie='movie'></ratingCard>


						<yesAction :feed='feed'></yesAction>
						<noAction :feed='feed'></noAction>


				</div>



			</v-flex>
		</v-layout>
	</div>

</template>

<script>

const StarRating = ()=> import('vue-star-rating')
const  yesAction =()=>  import('./yesAction')
const  noAction =()=>  import('./noAction')
import ratingCard from './ratingCard.vue'

export default {
	components:{
		StarRating,
		yesAction,
		noAction,
		ratingCard
	},
	props:['movie'],
	data(){
		return{	
			setRating:0,
			feed:{
				feedbox:true,
				rate:true,
				yes:true,
				no:true,
				size:'md4 sm6 xs12'
			},
		}
	},
	watch:{

	},
	methods:{

	},
	created(){


	}
}
</script>

<style scoped>

.v-middle{
  position: relative;
  top: 50%;
  transform: translateY(-50%);
}

.stripe{
	background: repeating-linear-gradient(
	  45deg,
	  #4527A0,
	  #4527A0 10px,
	  #5E35B1 10px,
	  #5E35B1 20px
	);
}


</style>