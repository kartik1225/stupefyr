<template>
	<div>


			<!-- tabs -->
			<v-tabs fixed icons centered  class='deep-purple lighten-4 elevation-2' style='border-radius:3px;'>
			    <v-tabs-bar dark color="transparent" class='deep-purple'>
			      <v-tabs-slider color="white"></v-tabs-slider>
			      <v-tabs-item href="#tab-1" @click='fetch(`getreviews`)'>
			        <v-icon>movie</v-icon>
			        Review
			      </v-tabs-item>
			      <v-tabs-item href="#tab-2" @click='fetch(`getbestparts`)'>
			        <v-icon>format_quote</v-icon>
			        Best part
			      </v-tabs-item>
			    </v-tabs-bar>
			    <v-tabs-items>
			    	<!-- tab 1 -->
			      <v-tabs-content
			        :id="'tab-1'"
			      >
	  			      <v-container v-show='fLoading'>
	  				      <v-layout justify-center>
	  				      	<v-progress-circular indeterminate :size="50" color="white"></v-progress-circular>
	  				      </v-layout>
	  			  	  </v-container>

	  			  	  <v-container>
	  	  	          	<v-layout>
	  	  	          		<v-flex xs12>
	  	  		          		<v-card >
	  	  		          			<v-text-field
	  	  		          			    @click='$bus.$emit(`mp_pop`,`best_part`)'
	  	        			                label="write about best movie plot here..."
	  	        			                single-line
	  	        			                full-width
	  	        			                hide-details
	  	        			                append-icon='edit'
	  	        			            ></v-text-field>
	  	  		          		</v-card>
	  	  	          		</v-flex>
	  	  	          	</v-layout>
	  	  	          </v-container>

	  			  	  	<v-container v-if='review.length === 0'>
	  			  	  		<div>
	  			  	  			<p class='title text-xs-center'> No post found!</p>
	  			  	  			<p class='heading text-xs-center deep-purple--text'> be the first one!</p>
	  			  	  		</div>
	  			  	  	</v-container>


	        		          <v-container :grid-list-xs='$vuetify.breakpoint.width > 600' v-show='!fLoading' v-if='review.length !== 0'>
	        		          	<br>

	        		          	<template v-for='post in review'>
	        		          		
	  	      		          	<bestPlotCard :post='post' ></bestPlotCard>
	  	      		          	<br>
	        		          	</template>


	        		          		<v-btn v-show='review.length === 0' block :dark='review.length >= 10' class='deep-purple' :disabled='review.length < 10' @click='$router.push(`${$route.params.movie}/reviews`)'>
	        		          			{{review.length >= 10?`see all best parts posts.`:`no more posts to load.`}} &nbsp<v-icon style='font-size:18px;'>open_in_new</v-icon>
	        		          		</v-btn>

	        		          </v-container>
			        <!-- tab 2 -->
			      </v-tabs-content>
			      	<v-tabs-content
			        :id="'tab-2'"
			      >
				      <v-container v-show='fLoading'>
					      <v-layout justify-center>
					      	<v-progress-circular indeterminate :size="50" color="white"></v-progress-circular>
					      </v-layout>
				  	  </v-container>


	      		          <v-container v-show='!fLoading' >
	      		          	<v-layout>
	      		          		<v-flex xs12 >
	      			          		<v-card >
	      			          			<v-text-field
	      			          			    @click='$bus.$emit(`mp_pop`,`review`)'
	      	      			                label="write movie review here..."
	      	      			                single-line
	      	      			                full-width
	      	      			                hide-details
	      	      			                append-icon='edit'
	      	      			            ></v-text-field>
	      			          		</v-card>
	      		          		</v-flex>
	      		          	</v-layout>
	      		          	<br>

	      		          	<v-container v-if='best_part.length === 0'>
	      		          		<div>

	      		          			<p class='title text-xs-center'> No post found!</p>
	      		          			<p class='heading text-xs-center deep-purple--text'> be the first one!</p>
	      		          		</div>
	      		          	</v-container>


	      		          	<template v-for='post in best_part' v-if=' best_part.length !== 0'>
	      		          		
		      		          	<bestPlotCard1 :post='post' ></bestPlotCard1>
		      		          	<br>
	      		          	</template>


	      		          	<v-btn v-show='best_part.length === 0' block :dark='best_part.length >= 10' class='deep-purple' :disabled='best_part.length < 10' @click='$router.push(`${$route.params.movie}/best_part`)'>
	      		          		{{best_part.length >= 10?`see all best parts posts.`:`no more posts to load.`}} &nbsp<v-icon style='font-size:18px;'>open_in_new</v-icon>
	      		          	</v-btn>



	      		          </v-container> 


			      </v-tabs-content>

			    </v-tabs-items>
			  </v-tabs>


		<mpCreater :movie='movie'></mpCreater>
	</div>
</template>

<script>

const bestPlotCard1 = ()=> import('./bestPlotCard');
const bestPlotCard = ()=> import('./bestPlotCard');
import mpCreater from './mpCreater'

	export default {
		props:['movie'],
		components:{
			bestPlotCard1,
			bestPlotCard,
			mpCreater
		},
		data(){
			return{
				best_part:[],
				review:[],
				fLoading:false,
				type:'getbestparts'
			}

		},
		methods:{
			fetch(type){

				console.log(type);
				this.fLoading = true;
				this.type = type;
				this.$axios.get(`${this.$store.state.server}movie/${type}/${this.movie._id}`,this.$store.getters.auth).then(r=>{
					this.fLoading = false;
					console.log(r.data);
					if(!r.data.error){
						type === `getbestparts`? this.best_part=r.data : this.review = r.data;

					}
					console.log('one',this.best_part.length)
				}).catch(e=>{
					console.log(e);
				})
			}
		},
		created(){
			this.fetch(`getreviews`);
			
			this.$bus.$on(`mp_created`,r=>{
					console.log('page',r.newPost);
					this.best_part.unshift(r.newPost);

					console.log('two',this.best_part.length);

			})
		}
	}
</script>

<style>

	
</style>