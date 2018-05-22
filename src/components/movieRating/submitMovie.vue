<template>
<div >
	<v-card v-show='$vuetify.breakpoint.width > 600' class='transparent' style='height:164px;'>
		
	</v-card>

	<div :style="$vuetify.breakpoint.width > 600?`margin-top:-52px;`:` `">
		<v-layout justify-center>
			<v-flex xs12 sm10 md8>

				<v-card class='teal'>
					<v-container>
					<v-layout justify-center>
						<span class='title white--text'>Create a movie Rating page</span>
					</v-layout>
					</v-container>
				</v-card>

				<!-- title input -->
				<v-card>

						<p :class="$vuetify.breakpoint.width > 600?`subheading text-xs-right grey--text`:`caption text-xs-right grey--text`">Every field is required! &nbsp</p>

					<v-container style='margin-top:-40px;'>
				        <div :class='$vuetify.breakpoint.width > 600?`title`:`title-sm`'>
							<v-text-field
							 multi-line
							 hide-details
							 v-model='title'
							 placeholder='What is Name of a movie?'
							 :loading='title_loading'
							></v-text-field>
						</div>
					</v-container>

					<p v-show='manual' class="text-xs-right" style='matgin:auto; margin-right:15px;'><a class='caption' @click='(manual = false,query(title))'>click to enable auto suggestions</a></p>


					<!-- dropdown card -->

					<div v-show='qbox_show'>
					<div v-if='tmdb !== []'>
					<v-container  :style='$vuetify.breakpoint.width > 600?`margin-top:-33px;`:`margin-top:-49px;`' >



						<div style="height:500px: overflow:auto;" class='elevation-5'>

								<v-btn large flat block @click='manually'>write manually</v-btn>
								<v-divider></v-divider>
						<template v-for='m in tmdb' >

							<v-container grid-list-xs>

							<div :ref='m.id' v-ripple role='button'>
								<v-layout @click='selectedMovie(m)'>
								<div :style="`width:70px`">
									<img style="width:70px; height:auto" :src='m.poster_path?`https://image.tmdb.org/t/p/w92${m.poster_path}`:`/static/default_poster.jpg`'>
								</div>
									{{$vb(m.poster_path?`https://image.tmdb.org/t/p/w92/${m.poster_path}`:null)}}
									<div>
									<v-container grid-list-xs>
										<span class="title">{{m.name || m.title}}</span>
									</v-container>
									<v-container grid-list-xs>
										<span class="body-1">{{m.release_date || m.first_air_date}}</span>
									</v-container>




											 <v-chip small color="grey" outline text-color="black">

											       <v-icon left >{{m.media_type === `movie`?`movie`:`tv`}}</v-icon> {{m.media_type === `movie`?`movie`:`tv series`}}

											</v-chip>

									</div>
								</v-layout>
							<v-divider style='margin-top:-6px'></v-divider>
							</div>

					</v-container>
					</template>
					</div>


					</v-container>	
					</div>
					</div>

				</v-card>


				<v-divider></v-divider>
				<!-- porgerss and setatus box -->
				<v-card v-show='poster_loading' class='grey lighten-4'>
					<v-divider></v-divider>
						<v-container>

							<v-container>
								<p class="title grey--text">poster and castings are loading from server ...</p>
								<p class="title grey--text body-1">this may take some time (about ~ 3 - 4 minutes)</p>

							</v-container>


							<v-layout>
								
								<v-icon :class='`${title !== ``?`green`:`red`}--text`' style='margin-top:-16px;font-size:20px;'>{{title !== ''?`done`:`error`}}</v-icon>&nbsp
								<p class="body-1">{{title !== ''?`title added`:`you need to provide title`}}</p> 
							</v-layout>

							<v-layout>
								
								<v-icon v-if='!poster_loading' :class='`${posterId !== ``?`green`:`red`}--text`' style='margin-top:-16px;font-size:20px;'>{{posterId !== ''?`done`:`error`}}</v-icon>
								<v-progress-circular v-if='poster_loading' :size='20' indeterminate color="primary"></v-progress-circular>&nbsp
								<p>
									<span class="body-1" v-show='!poster_loading'>{{posterId !== ''?`poster uploded`:`you need to upload movie poster`}}</span>
									<span class="body-1" v-show='poster_loading'>poster is uploading from server</span> 
								</p>
							</v-layout>

							<v-layout>
								
								<v-icon :class='`${description !== ``?`green`:`red`}--text`' style='margin-top:-16px;font-size:20px;'>{{description !== ''?`done`:`error`}}</v-icon>&nbsp
								<p class="body-1">{{description !== ''?`short intro updated`:`you need to provide short description`}}</p> 
							</v-layout>

							<v-layout>
								
								<v-icon :class='`${selected_media !== null?`green`:`red`}--text`' style='margin-top:-16px;font-size:20px;'>{{description !== null?`done`:`error`}}</v-icon>&nbsp
								<p class="body-1">{{selected_media !== null?`media type is selected`:`you need to provide media type`}}</p> 
							</v-layout>


							<v-layout>

								<v-icon v-if='!casting_loading' :class='`${castings.length > 1?`green`:`red`}--text`' style='margin-top:-16px;font-size:20px;'>{{castings.length > 1?`done`:`error`}}</v-icon>
								 <v-progress-circular v-if='casting_loading' :size='20' indeterminate color="primary"></v-progress-circular>&nbsp
								<p>

								<span v-if='!casting_loading' class='body-1'>{{castings.length < 1?`Add miimum 2 castings/Actors from this movie.`:`${castings.length}&nbsp castings added`}}</span>
								<span v-if='casting_loading' class="body-1 ">{{ cast_len - castings.length }}&nbsp more castings are loading from server...</span>

								</p>
							</v-layout>

							<v-layout>
								
								<v-icon :class='`${chips.length > 0 ?`green`:`red`}--text`' style='margin-top:-16px;font-size:20px;'>{{chips.length > 0 ?`done`:`error`}}</v-icon>&nbsp
								<p class="body-1">{{chips.length > 0 ? `${chips.length}&nbsp genres are added.` :  `Add atleast 1 genre based on movie type`}}</p> &nbsp
							</v-layout>

						</v-container>
				</v-card>

	

				<v-divider></v-divider>

				<!-- poster upload btn -->

				<v-progress-linear v-show='poster_loading' style='margin:0' :height='3' v-bind:indeterminate="true"></v-progress-linear>	


				<v-card v-show='!poster_loading' style="height:200px; width:100%;" role='button' v-if='posterId === ``'>

					<!--evet bus to movieRating/posterUpload -->
					<div  style="height:100%;" v-ripple @click='$bus.$emit("posterPop",true )'>
						<div class="v-middle" >
							<p class="title grey--text text-xs-center">upload a movie poster (portrait)</p>
							<v-layout justify-center>
								<v-icon>add_a_photo</v-icon>
							</v-layout>
						</div>
					</div>
			
				</v-card>



				<!-- poster upload -->
				<posterUpload></posterUpload>

				<!-- poster display	 -->
				<div style="position:relative;" v-if='posterId !== ``'>
					<div style="position:absolute; right:0">
						<v-btn @click='$bus.$emit("posterPop",true )'>
							change poster &nbsp<v-icon>edit</v-icon>
						</v-btn>
					</div>

					<div style='line-height:0'>
						<img :src='`${$store.state.server}picture/${this.posterId}`' style="width:100%; height:auto; " >
					</div>
				</div>

				<v-divider></v-divider>



				<!-- media type input -->
				<v-card>
					
					<v-container>
						<span class='subheading'>{{selected_media === null?`select media type`:`Media type`}}</span><br>
						<span class='body-1 grey--text'>{{selected_media === null?`select type by clicking on the one of button`:`${selected_media} is selected`}}</span>
					</v-container>
					
					<v-layout>
						&nbsp<v-btn block :class='selected_media === `tv`?`black white--text`:`grey`' @click='selectMedia(`tv`)'>tv &nbsp <v-icon>tv</v-icon></v-btn> &nbsp
						<v-btn block :class='selected_media === `movie`?`black white--text`:`grey`' @click='selectMedia(`movie`)'>movie &nbsp <v-icon>movie</v-icon></v-btn>
						&nbsp
					</v-layout>
				</v-card>

				<v-divider></v-divider>


				<!-- short intro about movie -->
				<v-card>
					<div :class='$vuetify.breakpoint.width > 600?`descript`:`descript-sm`'>
					<v-container class="quote-card teal lighten-2" >
						<v-text-field 
			                 placeholder="Write here short description about this Movie..."
			                 counter
			                 max="120"
			                 full-width
			                 multi-line
			                 single-line
			                 v-model='description'
						></v-text-field>
					</v-container>
					</div>
				</v-card>

					<v-divider></v-divider>


				<!-- add casting card -->
				<v-card>
				<v-progress-linear v-show='casting_loading' style='margin:0' :height='3' v-bind:indeterminate="true"></v-progress-linear>

					<v-container>
						<span class='subheading'>{{castings.length < 1?`Add miimum 2 castings/Actors from this movie.`:`Castings`}}</span>
					</v-container>

					<v-container v-show='casting_loading'>
						<span class="subheading grey--text">{{ cast_len - castings.length }}&nbsp more castings are loading from server...</span>

						<v-btn error @click='(casting_loading = false,submit_loading=false)' flat >stop</v-btn>
					</v-container>
					<!-- add cast  -->
					<addCast></addCast>

					<!-- existing casting loop -->
					<v-layout wrap >

						<template v-for='(cast,i) in castings'>
							<v-slide-x-transition>
								<v-flex xs6 sm4 >
									<v-container style='height:100%;'  v-bind="{ [`${size}`]: true }">
										<v-card style='max-width:250px;' hover>
											<div class="grey lighten-4" v-ripple :style="`position:relative; line-height:0; overflow:hidden; ${$vuetify.breakpoint.width > 600?`height:250px;`:`height:200px;`}`" >

												<div style="position:absolute; right:0;">
													<v-btn @click='castings.splice(i,1)' icon small class='white'>
														<v-icon>clear</v-icon>
													</v-btn>
												</div>
												<img style="width:100%;" :src="`${$store.state.server}picture/${cast.profileImage}`">
											</div>


												<v-divider></v-divider>
												<v-container grid-list-lg style="position:relative;">
												<br>
													<v-btn
													  style='z-index:2'
										              color="purple"
										              dark
										              absolute
										              top
										              right
										              small
										              fab>
										              <v-icon>thumb_up</v-icon>
										          </v-btn>
												<div>
													<p class="body-2" style="margin-top:-16px">{{cast.character}}</p>
													<p class="body-1 grey--text" style="margin-top:-16px">{{cast.name}}</p>
												</div>
												</v-container>

										</v-card>
									</v-container>
								</v-flex>
							</v-slide-x-transition>
						</template>

						<!-- add casting btn -->

							<v-flex xs6 sm4 style='height:100%;'>
								<v-container  v-bind="{ [`${size}`]: true }">
								<v-card style='max-width:250px;'  hover @click.native.stop="$bus.$emit('addCastPop',true)">
									<div class="grey lighten-4 " v-ripple :style="`position:relative;  ${$vuetify.breakpoint.width > 600?`height:250px;`:`height:200px;`} line-height:0;`" >
										<v-container class='v-middle'>
										<img src="/static/Addicon.png" style="width:100%">
										</v-container>
									</div>
										<v-divider></v-divider>
										<v-container grid-list-lg style="position:relative;">
										<br>
										<div>
											<p class="body-2" style="margin-top:-16px">add casting</p>
											<p class="body-1 grey--text" style="margin-top:-16px">click on plus</p>
										</div>
										</v-container>
								</v-card>
								</v-container>
							</v-flex>

					</v-layout>
				</v-card>


				<v-card>
					<v-select
					    label="Movie genre? e.g. ~ commedy"
					    chips
					    tags
					    solo
					    prepend-icon="filter_list"
					    clearable
					    v-model="chips"
					  >
					    <template slot="selection" slot-scope="data">
					      <v-chip
					        close
					        @input="remove(data.item)"
					        :selected="data.selected"
					      >
					        <strong>{{ data.item }}</strong> &nbsp
					        <span>(genre)</span>
					      </v-chip>
					    </template>

					  </v-select>
				</v-card>


				<!-- porgerss and setatus box -->
				<v-card  class='grey lighten-5'>
					<v-divider></v-divider>
						<v-container>

							<v-container>
								<p class="title grey--text">progress and status</p>
							</v-container>


							<v-layout>
								
								<v-icon :class='`${title !== ``?`green`:`red`}--text`' style='margin-top:-16px;font-size:20px;'>{{title !== ''?`done`:`error`}}</v-icon>&nbsp
								<p class="body-1">{{title !== ''?`title added`:`you need to provide title`}}</p> 
							</v-layout>

							<v-layout>
								
								<v-icon v-if='!poster_loading' :class='`${posterId !== ``?`green`:`red`}--text`' style='margin-top:-16px;font-size:20px;'>{{posterId !== ''?`done`:`error`}}</v-icon>
								<v-progress-circular v-if='poster_loading' :size='20' indeterminate color="primary"></v-progress-circular>&nbsp
								<p>
									<span class="body-1" v-show='!poster_loading'>{{posterId !== ''?`poster uploded`:`you need to upload movie poster`}}</span>
									<span class="body-1" v-show='poster_loading'>poster is uploading from server</span> 
								</p>
							</v-layout>

							<v-layout>
								
								<v-icon :class='`${description !== ``?`green`:`red`}--text`' style='margin-top:-16px;font-size:20px;'>{{description !== ''?`done`:`error`}}</v-icon>&nbsp
								<p class="body-1">{{description !== ''?`short intro updated`:`you need to provide short description`}}</p> 
							</v-layout>

							<v-layout>
								
								<v-icon :class='`${selected_media !== null?`green`:`red`}--text`' style='margin-top:-16px;font-size:20px;'>{{selected_media !== null?`done`:`error`}}</v-icon>&nbsp
								<p class="body-1">{{selected_media !== null?`media type is selected`:`you need to provide media type`}}</p> 
							</v-layout>


							<v-layout>

								<v-icon v-if='!casting_loading' :class='`${castings.length > 1?`green`:`red`}--text`' style='margin-top:-16px;font-size:20px;'>{{castings.length > 1?`done`:`error`}}</v-icon>
								 <v-progress-circular v-if='casting_loading' :size='20' indeterminate color="primary"></v-progress-circular>&nbsp
								<p>

								<span v-if='!casting_loading' class='body-1'>{{castings.length < 1?`Add miimum 2 castings/Actors from this movie.`:`${castings.length}&nbsp castings added (minimum 2 required)`}}</span>
								<span v-if='casting_loading' class="body-1 ">{{ cast_len - castings.length }}&nbsp more castings are loading from server...</span>

								</p>
							</v-layout>

							<v-layout>
								
								<v-icon :class='`${chips.length > 0 ?`green`:`red`}--text`' style='margin-top:-16px;font-size:20px;'>{{chips.length > 0 ?`done`:`error`}}</v-icon>&nbsp
								<p class="body-1">{{chips.length > 0 ? `${chips.length}&nbsp genres are added.` :  `Add atleast 1 genre based on movie type`}}</p> &nbsp
							</v-layout>

						</v-container>
				</v-card>



				

				<v-btn block class='teal white--text' :loading='submit_loading' :disabled='!submit_disabled' @click='submit'> submit</v-btn>
			</v-flex>
		</v-layout>

		<v-dialog v-model='prePop' max-width='500px'>
			<v-card>
					<div style="position:absolute;right:0;">
						<v-btn icon dark @click='prePop = false'>
							<v-icon>clear</v-icon>
						</v-btn>
					</div>
				<div v-if='preData.movie'>
					<v-container class='red elevation-1' >
						<v-icon class='white--text' style='margin-top:-7px;'>warning</v-icon>&nbsp
						<span class="white--text title">Warning</span>

					</v-container>
					<v-container >

						<div>

							<p class="subheading red--text" > This <strong>{{preData.movie.media_type === `movie`?`movie`:`tv series`}}</strong> is alredy submited</p>
							<v-layout>
							<div style="width:100px;">
							<img  :src='`${$store.state.server}picture/${preData.movie.poster}`' style="width:100%; 
							height:auto; " >
							</div>

							<div style="margin-left:5px;width:calc(100% - 100px);">
								<p class="body-1" style="margin:auto"><strong>Title:</strong>{{preData.movie.title}}</p>
								<p class='body-1' style="margin:auto"><strong>Relese Date:</strong>{{preData.movie.release_date}}</p>

								<p style="margin:auto"><strong>Rating:</strong> {{preData.movie.avrRating}}</p>
								 <v-chip small color="grey" outline text-color="black">

								       <v-icon left >{{preData.movie.media_type === `movie`?`movie`:`tv`}}</v-icon> {{preData.movie.media_type === `movie`?`movie`:`tv series`}}
								</v-chip>
								<br>

								<div style="margin-left:-12px;">
									<v-btn flat small>	
										rating page &nbsp<v-icon style='font-size:18px;'>open_in_new</v-icon>
									</v-btn>
								</div>
							</div>
							</v-layout>
						</div>

						<v-divider></v-divider>

						<div>
							<p style="margin:auto" class="subheading">If this is another movie or tv seriese then, <a @click='createNew'>create new</a>.</p>
						</div>
					</v-container>
			</div>

			<div v-show='!preData.movie'>
				<v-container class='teal' >
					<span class='white--text subheading'> checking this movie / tv seriese exist on database or not. </span>

				</v-container>
				<v-container>
					<v-layout justify-center>
						<v-progress-circular indeterminate :size="50" color="primary" v-show='preData.load'></v-progress-circular>
					</v-layout>
					<br>
					<p class="subheading grey--text text-xs-center">this may take around ~1 munite.</p>
				</v-container>
			</div>

			</v-card>
		</v-dialog>
	</div>
</div>
</template>

<script>
import vue2Dropzone from 'vue2-dropzone'
import 'vue2-dropzone/dist/vue2Dropzone.css'
import addCast from './addCasting.vue'
import posterUpload from './posterUpload.vue'
import axios from 'axios'
import genres from './genres.json'

export default {
	components:{
		vueDropzone: vue2Dropzone,
		addCast,
		posterUpload
	},
	data(){
		return{
			// title
			title:'sherlock',
			title_loading:false,
			// discription
			description:'',
			// castings
			castings:[],
			cast_len:0,
			casting_loading:false,
			// genre
			chips: [],
			dropzoneOptions: {
			         url: 'https://httpbin.org/post',
			         thumbnailWidth: 150,
			         headers: { "My-Awesome-Header": "header value" },
			         dictDefaultMessage:'Upload a Movie Poster here'
			},
			size:'grid-list-md',
			// poster 
			posterId:'',
			poster_loading:false,
			//query
			qbox_show:false,
			tmdb:[],
			//media type
			selected_media:null,
			release_date:null,
			createdWith:'user_created',
			tmdbId:null,
			submit_disabled:false,
			//prepop stuff
			prePop:false,
			preData:{
				movie:null,
				load:false
			},
			// manually
			manual:false


		}
	},
	watch:{
		'$vuetify.breakpoint.width':function(i){

			i < 600? this.size = `grid-list-xs` : this.size = `grid-list-md`

		},
		title(i){


			this.errorSnac();
			if(this.$vuetify.breakpoint.width > 600){
				this.$txtRe(document.querySelector('.title textarea'))
			}else{

			this.$txtRe(document.querySelector('.title-sm textarea'))
			}

			this.query(i);
		},
		description(i){
			this.errorSnac();
			if(this.$vuetify.breakpoint.width > 600){
				this.$txtRe(document.querySelector('.descript textarea'))
			}else{

			this.$txtRe(document.querySelector('.descript-sm textarea'))
			}
		},
		castings(i){
			// loading handler  0 >= 0
			
			console.log(this.cast_len , this.castings.length);
			this.errorSnac();
		},
		posterId(i){
			this.errorSnac();
		},
		chips(i){
			this.errorSnac();
		},
		selected_media(i){
			this.errorSnac();
			console.log(i);
		}
	},
	methods:{
		remove(item) {
	        this.chips.splice(this.chips.indexOf(item), 1)
	        this.chips = [...this.chips]
      	},
      	query(i){
      			if(!this.manual){
	      			this.tmdb = [];
	      			this.title_loading = true;
	      			this.qbox_show = true;
		      		this.$axios.get(`https://api.themoviedb.org/3/search/multi?api_key=${this.$store.state.tmdb}&language=en-US&query=${i}&page=1&include_adult=false`).then(r=>{

		      			console.log(r.data.results);
		      			this.tmdb = r.data.results;

		      			this.title_loading = false;
		      		}).catch(e=>{
		      			console.log(e);
		      		})
      			}
      	},
      	posterImageChoose(){
      		this.posterRemoveShow = true;
	      	let hasImage = this.posterCanvas.hasImage();

	      	setTimeout(()=>{
	      		hasImage?this.poster_disabled = true: this.poster_disabled = false;
	      	},300)
	      	

      	},
      	posterRemove(){
      		this.posterCanvas.remove();
      		this.posterRemoveShow = false;
      		this.posterId = null;
      		this.poster_disabled = true;
      	},
      	posterCancel(){
      		this.posterRemove();
      		this.posterCanvasDialog = false;
      		this.posterWarning = false;
      	},
      	selectMedia(i){
      		this.selected_media = i;
      	},
      	selectedMovie(movie){
      		this.prePop = true;
      		this.preData.movie = null;
      		this.preData.load = true;

      		this.$axios.get(`${this.$store.state.server}movie/q?comp=${movie.name || movie.title}`,this.$store.getters.auth).then(r=>{
      			console.log(r.data);
      			this.preData.load = false;
      			if(!r.data.success){
	      			this.prePop = true;
	      			this.preData.movie = r.data;
      			}else{
	      			this.formatData(movie);
	      			this.preData.movie=null;
	      			this.prePop = false;
      			}
      		}).catch(e=>{
      			console.log(e)
      		})

      	},
      	formatData(movie){
      		this.title = '';
      		this.posterId = '';
      		this.chips = [];
      		this.castings = [];
      		this.discription = '';
      		this.submit_loading = true;
      		this.casting_loading = true
      		this.poster_loading = true;
      		this.selected_media = null;
      		this.release_date = null;
      		this.backDrop = null;

      		setTimeout(()=>{

      		this.qbox_show = false;
      		},300)

      		this.$bus.$emit("posterPop",movie);


      		// gettig castings
      		if(movie.media_type === 'movie'){
      			this.$axios.get(`https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=${this.$store.state.tmdb}`).then(r=>{

      				console.log(r.data)
      				// loading handler 
      				this.cast_len = r.data.cast.filter(d => d.profile_path !== null).length
      				// upload casting to server
      				
      				this.$bus.$emit('addCastPop',r.data);
      			}).catch(e=>{
      				console.log(e);
      			})
      		}else{
      			this.$axios.get(`https://api.themoviedb.org/3/tv/${movie.id}/credits?api_key=${this.$store.state.tmdb}`).then(r=>{

      				console.log(r.data)
      				// loading handler
      				this.cast_len = r.data.cast.filter(d => d.profile_path !== null).length;

      				// upload casting to server
      				this.$bus.$emit('addCastPop',r.data)
      			}).catch(e=>{
      				console.log(e);
      			})
      		}	

      		this.tmdbId = movie.id;
      		this.release_date = movie.release_date || movie.first_air_date;
      		this.description = movie.overview;
      		this.title = movie.name || movie.title;
      		this.selected_media = movie.media_type;
      		// upload poster to our server

      		movie.genre_ids.map(d=>{
      			genres.map(g=>{
      				d === g.id?this.chips.unshift(g.name):null
      			})
      		})
      		// genres
      		genres.map(d=>{
      			d.id === movie.genre_ids
      		})
      	},
      	manually(){
      		this.qbox_show = false;
      		this.manual = true;
	     },
      	createNew(){
      		this.prePop = false;
      		this.manually();
      	},
      	errorSnac(){
      		const data = {
      			title:this.title,
      			poster:this.posterId,
      			intro:this.description,
      			castings:this.castings,
      			genre:this.chips
      		}



			let exicute = this.title !== '' &&this.posterId !== null &&this.description !== '' &&this.castings.length >= 2 &&this.chips.length !== 0 && this.selected_media!== null;


			this.submit_disabled = exicute;


			let load = this.casting_loading === false && this.poster_loading === false && this.title_loading === false;

			this.submit_loading = !load;
			// for final submit
			if(exicute){
				return true
			}else {
				return false
			}
      	},

      	submit(){

      		if(this.errorSnac()){
	      		const data = {
	      			title:this.title,
	      			poster:this.posterId,
	      			intro:this.description,
	      			castings:this.castings,
	      			genre:this.chips,
	      			pageCreater:this.$store.getters.id,
	      			media_type:this.selected_media,
	      			release_date:this.release_date,
	      			tmdbId:this.tmdbId,
      			}

      		// axios
      		this.$axios.post(`${this.$store.state.server}movie/submit`,data,this.$store.getters.auth).then(r=>{

      			if(r.data.error){
      				this.$store.commit('sn',{context:'error',snac:r.data.error});
      			}else {
      				console.log(r.data);
      				this.$router.push(`/movie/${r.data.newMovie._id}`)
      			}

      		}).catch(e=>{
      			console.log(e);
      		})
	

      		}else {
      			this.$store.commit('sn',{context:'error',snac:'Every field is required to submit a page...'});
      		}

      	}
	},
	mounted(){
		this.poster_disabled = true;

		if(this.$route.query.title && this.$route.query.id){
			this.title = this.$route.query.title;

			console.log(this.$route.query.title ,this.$route.query.id)

			if(!this.manual){
	      			this.tmdb = [];
	      			this.title_loading = true;
	      			this.qbox_show = true;
		      		this.$axios.get(`https://api.themoviedb.org/3/search/multi?api_key=${this.$store.state.tmdb}&language=en-US&query=${this.title}&page=1&include_adult=false`).then(r=>{

		      			r.data.results.map(d=>{
		      				d.id === parseInt(this.$route.query.id)?this.selectedMovie(d):null;

		      				console.log(d.id === this.$route.query.id);
		      			})

		      		}).catch(e=>{
		      			console.log(e);
		      		})
      			}

		}


		this.$bus.$on('cast_added',r=>{
			console.log('from mounted',r);

			this.castings.push(r.data);

			this.casting_loading = this.cast_len -1 > this.castings.length;


		});

		this.$bus.$on('poster_updated',r=>{
			console.log(r);
			this.poster_loading = false;
			this.posterId = r;
		});

	}
}
</script>

<style>

.title textarea{
	font-size: 34px !important;
	overflow:hidden;
	min-height: 64px;
	line-height: 135%;
	height: 51px;
}

.title-sm textarea{
	font-size: 20px !important;
	overflow:hidden;
	min-height: 38px;
	line-height: 135%;
	height: 30px;
}

.descript textarea {
	color: #fff !important;
	font-size: 20px !important;
	overflow:hidden;
	min-height: 38px;
	line-height: 135%;
	height: 30px;
}

.descript-sm textarea{
	color: #fff !important;
	font-size: 20px !important;
	overflow:hidden;
	min-height: 64px;
	line-height: 135%;
	height: 30px;
}
	
.casting :hover{
	background-color: #f5f5f5;
}

.v-middle{
  position: relative;
  top: 50%;
  transform: translateY(-50%);
}



/* quote */
.text-center {
  text-align: center;
}
.quote-card {
  background: #fff;
  color: #222;
  padding: 20px;
  padding-left: 50px;
  box-sizing: border-box;
  box-shadow: 0 2px 4px rgba(34, 34, 34, 0.12);
  position: relative;
  overflow: hidden;
  min-height: 120px;
}
.quote-card p {
  font-size: 22px;
  line-height: 1.5;
  margin: 0;
  max-width: 80%;
}
.quote-card cite {
  font-size: 16px;
  margin-top: 10px;
  display: block;
  font-weight: 200;
  opacity: 0.8;
}
.quote-card:before {
  font-family: Georgia, serif;
  content: "“";
  position: absolute;
  top: 10px;
  left: 10px;
  font-size: 5em;
  color: rgba(238, 238, 238, 0.8);
  font-weight: normal;
}
.quote-card:after {
  font-family: Georgia, serif;
  content: "”";
  position: absolute;
  bottom: -110px;
  line-height: 100px;
  right: -32px;
  font-size: 25em;
  color: rgba(238, 238, 238, 0.8);
  font-weight: normal;
}
@media (max-width: 640px) {
  .quote-card:after {
    font-size: 22em;
    right: -25px;
  }
}
</style>