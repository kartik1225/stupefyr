
<!--return data in event bus 'cast_added' -->
<!-- to pop up addCastPop -->
<template>
<v-dialog v-model='pop' max-width='400px'>

<v-card >


<!-- title bar -->
<v-container style='position:relative' class='deep-purple lighten-1'>
	<v-layout>
		<span class="title white--text">Rate this movie</span>

		<!-- cancel icon -->
		<div style='position:absolute; right:0; margin-top:-10px;'>
			<v-btn dark icon small @click='pop = false'>
				<v-icon>clear</v-icon>
			</v-btn>
		</div>

	</v-layout>
</v-container>

<div>

	  <div>
	    <v-stepper v-model="e1" >
	      <v-stepper-header class='teal accent-2'>
	        <template v-for="(r,n) in steps">
	          <v-stepper-step
	            :key="n+1"
	            :step="n+1"
	            :complete="e1 > n+1"
	            :editable='editable'
	          >
	          </v-stepper-step>
	          <v-divider v-if="n !== steps" :key="n+1"></v-divider>
	        </template>
	      </v-stepper-header>
	      <v-stepper-items>
	      	<v-divider></v-divider>
	        <v-stepper-content
	          :step="n+1"
	          v-for="(r,n) in steps"
	          :key="n+1"
	          style='background-image: linear-gradient(to right, #74ebd5 0%, #9face6 100%);'
	        >

	        	<!-- main content -->
                <v-card class="mb-5"  height="200px" >
                	<div class="v-middle" v-show='!submit'>
                		<v-container grid-list-sm>
                			<!-- title -->
	                		<p class="headline text-xs-center">how is the <strong>{{r.type}}</strong>  of this Movie?</p>

	                			<!-- ratinng -->
	                			<p :class="`display-1 text-xs-center ${r.done?`green--text`:`black--text`}`" >{{r.done?r.rating:r.temp}}</p>	

	       		         	<v-layout justify-center>
	       		         		
	       		         		<!-- edit backwards -->
	       		         		<div style="position:absolute; left:0; margin-top:-7px;" v-if='editable' v-show=' n !== 0 && n+1 <= steps.length'>
		       		         		<v-btn icon @click='e1 = e1 - 1' >
		       		         			<v-icon>keyboard_arrow_left</v-icon>
		       		         		</v-btn>
	       		         		</div>

	       						<star-rating v-bind:increment="0.1" 
	       						             v-bind:max-rating="5" 
	       						             inactive-color="#000" 
	       						             active-color="#f00" 
	       						             :rating='r.rating'
	       						             v-bind:star-size="30"
	       						             :padding='8'
	  							             @rating-selected ="rate => {nextStep(n+1,r,rate)}"
	  							             @current-rating="cr=>{ r.temp = cr }"
	       						             :show-rating='false'>
	       						</star-rating>

	       						<!-- edit forward --> 
	       						<div style="position:absolute; right:0; margin-top:-7px;" v-if='editable' v-show=' n+1 < steps.length'>
		       		         		<v-btn icon @click='e1 = e1 + 1'>
		       		         			<v-icon>keyboard_arrow_right</v-icon>
		       		         		</v-btn>
	       		         		</div>


	       		         		<!-- edit submit -->
	       		         		<div style="position:absolute; right:0; margin-top:-7px;" v-if='editable' v-show='n + 1 === steps.length'>

		       		         		<v-btn icon @click='submitRating'>
	   		         		          	<v-icon>file_upload</v-icon>
	   		         		        </v-btn>

		       		         	</div>

	       		         	</v-layout>
       		         	</v-container>
                	</div>

                	<v-slide-y-transition>
                		<!-- if done raing -->
	                	<div class="v-middle" v-show='submit' >
	                		<v-container grid-list-sm>
		                		<p class="headline text-xs-center">Your <strong>ratings</strong> has been reciverd</p>
		                		<v-layout justify-center>
		                			<v-icon class='display-1 green--text'>done</v-icon>
		                		</v-layout>

		                		<!-- edit btn -->
		                		<v-layout justify-center>
		                			<v-btn flat @click='submit = false'>
		                				<v-icon style='font-size:16px'>edit</v-icon>&nbsp edit 
		                			</v-btn>
		                		</v-layout>

		                	</v-container>
	                	</div>
                	</v-slide-y-transition>
                </v-card>

                <div style="margin-top:-42px;">
                	<v-layout>
                		<v-btn flat @click='cancel'>cancel</v-btn>
                		<v-spacer></v-spacer>
                		<v-btn flat  :disabled='!editable' @click='submitRating' :loading='loading'>done</v-btn>                		
                	</v-layout>
                </div>

	        </v-stepper-content>
	      </v-stepper-items>
	    </v-stepper>
	  </div>


</div>
</v-card>
</v-dialog>
</template>

<script>
import StarRating from 'vue-star-rating';
export default {
	props:['movie'],
	components:{
		StarRating
	},
	data(){
		return{
			e1: 0,
			// cast
			casting_rating:0,

			// direction
			diraction_rating:0,
			// ent
			entertainment_rating:0,
			// story
			story_rating:0,
			steps: [
				{type:'casting selection',rating:0  , done:false ,temp:0 ,step:'casting'},
				{type:'diraction',rating:0  , done:false ,temp:0 ,step:'diraction'},
				{type:'entertainment',rating:0 , done:false ,temp:0 ,step:'entertainment'},
				{type:'story',rating:0 , done:false ,temp:0 ,step:'story'}

				],
			// actions
			editable:false,
			done:false,
			submit:false,
			show:false,
			loading:false,
			// v-dialog
			pop:false
		}
	},
	methods:{
		nextStep (n,r,rate) {
			
			r.done = true;
			r.rating = rate;

			setTimeout(()=>{
				if(n !== this.steps.length){
				  this.e1 = n+1;
				}else{
					this.submitRating();
				}
			},1000)
		     },
		submitRating(){
			this.submit = true;
			this.editable = true;
			this.loading = true;

			let data = {
				rating:{
					casting:this.steps[0].rating,
					dir:this.steps[1].rating,
					ent:this.steps[2].rating,
					story:this.steps[3].rating
				},
				user:this.$store.getters.id,
				movieId:this.movie._id
			}

			this.$axios.post(`${this.$store.state.server}movie/newrate`,data,this.$store.getters.auth).then(r=>{


				if(r.data.error){
					this.$store.commit('sn',{context:'error',snac:r.data.error}) 	
				}else{

					this.$bus.$emit(`rated`,r.data);

					this.$store.commit('sn',{snac:'thank you for the rating.'}) 

				}
				this.loading = false;
				this.pop = false;
			}).catch(e=>{

				this.$store.commit('sn',{snac:'server error.'}) 
				console.log(e);
			})
		},
		cancel(){

			this.steps[0].rating = 0;
			this.steps[1].rating = 0;
			this.steps[2].rating = 0;
			this.steps[3].rating = 0;

			this.editable = false;
			this.submit = false;
			this.pop = false;

		}
		
	},
	created(){
		console.log(this.movie);

		if(this.movie.userRating !== null){

			this.steps[0].rating = this.steps[0].temp = this.movie.userRating.rating.casting;
			this.steps[1].rating = this.steps[1].temp = this.movie.userRating.rating.dir;
			this.steps[2].rating = this.steps[2].temp = this.movie.userRating.rating.ent;
			this.steps[3].rating = this.steps[3].temp = this.movie.userRating.rating.story;

			this.submit = true;
			this.editable = true;

		}
		this.$bus.$on('raingCardPop',r=>{
			this.pop = true;
		})

	}
}
</script>



<style scoped>
	.v-middle{
	  position: relative;
	  top: 50%;
	  transform: translateY(-50%);
	}
</style>