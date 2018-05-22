<template>
	<div>			
			<!-- tabs -->
			<v-tabs fixed icons centered  class='elevation-0' style='border-radius:3px; height:100%;' v-model='aTab'>
			    <v-tabs-bar light color="transparent" >
			      <v-tabs-slider color="grey"></v-tabs-slider>
			      <v-tabs-item href="#tab-1" @click='($router.push(`reviews`),infiniteHandler($event))'>
			        <v-icon>movie</v-icon>
			        Review
			      </v-tabs-item>

			      <!-- infiniteHandler($event,`getreviews`) -->

			      <v-tabs-item href="#tab-2" @click='($router.push(`best_part`),infiniteHandler($event))'>
			        <v-icon>format_quote</v-icon>
			        Best part
			      </v-tabs-item>

			      <!-- infiniteHandler($event,`getbestparts`) -->
			    </v-tabs-bar>
			    <v-layout justify-center>

					    <v-flex sm10  style='position:relative'>

					    	<div style="display:flex; justify-content:flex-end;">	 
					    	<v-menu offset-y>
					    	  <v-btn color="black" dark slot="activator" flat >sort by {{sort.title}} &nbsp <v-icon>filter_list</v-icon></v-btn>

					    	  <v-list>
					    	    <v-list-tile v-for="item in filters" :key="item.title" @click="sortd(item)">
					    	      <v-list-tile-title>{{ item.title }}</v-list-tile-title>
					    	    </v-list-tile>
					    	  </v-list>
					    	</v-menu>
					    	</div>	


						</v-flex>

			  	</v-layout>


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

	  			  	  	<v-container v-if='review.length === 0'>
	  			  	  		<div>

	  			  	  			<p class='title text-xs-center'> No post found!</p>
	  			  	  			<p class='heading text-xs-center deep-purple--text'> be the first one!</p>
	  			  	  		</div>
	  			  	  	</v-container>

	  			  	  		
	        		          <v-container :grid-list-xs='$vuetify.breakpoint.width < 600' v-show='!fLoading' v-if='review.length !== 0'>
	        		          	<v-layout>
	        		          		<v-flex xs12>
	        			          		<v-card >
	        			          			<v-text-field
	        			          			    @click='$bus.$emit(`mp_pop`,`review`)'
	        	      			                label="write about best movie plot here..."
	        	      			                single-line
	        	      			                full-width
	        	      			                hide-details
	        	      			                append-icon='edit'
	        	      			            ></v-text-field>
	        			          		</v-card>
	        		          		</v-flex>
	        		          	</v-layout>
	        		          	<br>

	        		          	<template v-for='post in review'>
	        		          		
	  	      		          	<bestPlotCard :post='post' ></bestPlotCard>
	  	      		          	<br>
	        		          	</template>
	        		          </v-container> 

	        		          <infinite-loading  ref="infiniteLoading1" @infinite="infiniteHandler"></infinite-loading>

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
	      			          			    @click='$bus.$emit(`mp_pop`,`best_part`)'
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

	      		          	<infinite-loading  ref="infiniteLoading" :distance='distance' @infinite="infiniteHandler">
	      		          	</infinite-loading>

	      		          </v-container> 
			      </v-tabs-content>

			    </v-tabs-items>
			  </v-tabs>


		<mpCreater :movie='movie'></mpCreater>
	</div>
</template>

<script>

const bestPlotCard1 = ()=> import('../bestPlotCard');
const bestPlotCard = ()=> import('../bestPlotCard');
import mpCreater from '../mpCreater'
import InfiniteLoading from 'vue-infinite-loading';
import inf from 'vue-infinite-loading';

	export default {
		components:{
			bestPlotCard1,
			bestPlotCard,
			mpCreater,
			InfiniteLoading,
			inf
		},
		data(){
			return{
				best_part:[],
				review:[],
				fLoading:false,
				type:'getreviews',
				movie:this.$route.params.movie,
				// sort
				sort:{title:'Latest'},
				filters:[{title:'Latest'},
						 {title:'Most Liked'},
						 {title:'Most Replyed'}],
				// infinite loading
				distance:100,
				// tab 
				aTab:null,
				pageType:this.$route.params.pageType
			}

		},
		watch:{
			$route:(i)=>{

				// i.params.pageType === 'best part'?this.infiniteHandler(this.$refs['infiniteLoading'].stateChanger,`getbestparts`):null;
				// console.log(i.params.pageType);
				  this.$refs.infiniteLoading1.$emit('$InfiniteLoading:reset');

				  this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');



			}
		},
		methods:{

			sortd(sort){
				this.sort = sort;
				// this.fLoading = true;
				this.best_part = [];
				this.review = [];
				// console.log(this.$refs['infiniteLoading'].stateChanger)

				this.$nextTick(() => {
					if(this.pageType !== 'best_part'){

					  this.$refs.infiniteLoading1.$emit('$InfiniteLoading:reset');
					}else{
						this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
					}
				});
			},
			infiniteHandler($state,type) {
				// this.fLoading = true;

				let len = this.$route.params.pageType === `best_part`?this.best_part.length:this.review.length;
				this.type = this.$route.params.pageType === 'best_part'?`getbestparts`:`getreviews`
				this.$axios.get(`${this.$store.state.server}movie/${this.type}/${this.movie}+${this.sort.title}+${len}`,this.$store.getters.auth).then(r=>{
					this.distance = 3000;
					this.fLoading = false;
					console.log(r.data);

					if(r.data.error){
						$state.complete();
					}else{
						if(this.type === `getbestparts`) {
							r.data.map(d=>{
								this.best_part.push(d);
							})
							// this.best_part=r.data;
						}else {
							r.data.map(d=>{
								this.review.push(d);
								
							})
							// this.review = r.data;
						}

						setTimeout(()=>{
							$state.loaded();
						},200)

					}


				}).catch(e=>{
					console.log(e);
				})
				


			}
		},
		created(){

			this.$route.params.pageType === 'best_part'?this.aTab = 'tab-2':this.aTab = 'tab-1';

			this.$bus.$on(`mp_created`,r=>{
					console.log('page',r.newPost);
					r.newPost.type === 'best_part'?this.best_part.unshift(r.newPost):this.review.unshift(r.newPost);

			})
		}
	}
</script>

<style>

	
</style>