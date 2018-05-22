<template>
	<div>
		<!-- header -->
		<v-card height='235px' class='grey'>
			<br>
			<v-container>
				<p :class='`${$vuetify.breakpoint.width > 600?`display-1`:`headline`} white--text text-xs-center`'>Find and <strong>Rate</strong> the <strong>movie</strong></p>
			</v-container>
			<br>
			<v-layout justify-center>
				<v-flex sm8 xs11>
					<v-card>
						<v-text-field
						               label="find a movie or tv shows."
						               single-line
						               full-width
						               hide-details
						               append-icon='search'
						               v-model='query'
						               :loading='qLoading'
						               @keyup.up='()=>{querySelect(`up`)}'
						               @keyup.down='()=>{querySelect(`down`)}'
						               >
						 </v-text-field>
					</v-card>
				<v-slide-y-transition>	
					<v-card style='z-index:1;'v-show='qBox' class='grey lighten-5 elevation-5' >
						<v-container grid-list-xs>
						<template v-for='m in qResults'>
							<v-divider></v-divider>

								<div v-ripple role='button' @click='selected(m)' >
									<v-layout class="HOVER">
										<div style='padding:5px;'>
											<p style="margin:auto;" class="subheading"><strong>{{m.title || m.name}}</strong></p>
										</div>

									</v-layout>
								</div>

							<v-divider></v-divider>
						</template>
						</v-container>
					</v-card>
				</v-slide-y-transition>
				</v-flex>
			</v-layout>
		</v-card>

		<br>
		<v-slide-y-transition>
			<v-layout justify-center v-show='showResults'>
				<v-flex sm10>
				<v-card>
				<div style='width:100%; padding:15px; border-radius:2px; elevation-2' class='blue-grey darken-1'>
					<v-layout>

						<p class="subheading white--text" style="margin:auto;"><strong>Search</strong> Results</p>
						<v-icon class='white--text'>subtitles</v-icon>

					</v-layout>
				</div>
				<v-card>

					<v-container v-show='foundResults.length === 0'>
						<p class="title text-xs-center grey--text">No results are found!</p>
						<p class="title text-xs-center grey--text">But wait, You can submit movie or tv show</p>
						<v-layout justify-center>
							<v-btn flat>create new</v-btn>
						</v-layout>
					</v-container>

					<v-container v-show='resultLoading'>
						<v-layout justify-center>
								<v-progress-circular indeterminate :size="50" color="grey"></v-progress-circular>
						</v-layout>
						<br>
						<p class="title grey--text text-xs-center">Getting results...</p>
					</v-container>
					<v-layout wrap v-show='!resultLoading'>
							<template v-for='m in foundResults'>
								<v-flex xs6 sm4 md3>
									<v-container grid-list-xs style='height:100%' >
										<div class='grey darken-3' style='height:100%;border-radius:2px;' role='button' @click='chosen(m)'>
											<img style="width:100%;" :src='m.poster?`${$store.state.server}picture/${m.poster}`: `/static/default_poster.jpg`'>
											<div>
												<v-container>
													<p style='margin:auto;' class="body-2 white--text" >{{m.title}}</p>
												</v-container>
											</div>
										</div>
									</v-container>
								</v-flex>
							</template>
					</v-layout>
				</v-card>
				</v-card>
				</v-flex>
			</v-layout>
		</v-slide-y-transition>

		<v-layout justify-center v-show='!showResults' >
		 
		<v-flex md10 xs12>
		<div style='width:100%; padding:15px; border-radius:2px; elevation-2' class='blue-grey darken-1'>
			<v-layout>
				<p class="subheading white--text" style="margin:auto;">Recent <strong>Movies</strong></p>
				<v-icon class='white--text'>movie</v-icon>
			</v-layout>
		</div>
		<hrScroll>
			<template v-for='m in crMovies'>
					<v-container grid-list-xs  style='height:100%; margin-top:0px;' >
						<div class='grey darken-3 elevation-2 ' style='height:100%;border-radius: 2px;'role='button' @click='chosen(m)' >
							<img style="width:185px; height:278px;" :src='m.poster_path?`https://image.tmdb.org/t/p/w300${m.poster_path}`: `/static/default_poster.jpg`'>
									<div class='white--text body-2; ' style='text-overflow: ellipsis;white-space: nowrap;width: 185px;overflow: hidden; padding:10px;'>
									{{m.title}}
									<p style='margin:auto;' class="body-1 white--text" >({{m.release_date}})</p>
									</div>
						</div>
					</v-container>
			</template>
		</hrScroll>

		<br>



		<div style='width:100%; padding:15px; border-radius:2px; elevation-2' class='blue-grey darken-1'>
			<v-layout>

				<p class="subheading white--text" style="margin:auto;">Recent <strong>Tv Shows</strong></p>
				<v-icon class='white--text'>tv</v-icon>

			</v-layout>
		</div>
		<hrScroll>
			<template v-for='m in crTv'>
					<v-container grid-list-xs  style='height:100%; margin-top:0px;' class='blue-grey lighten-5' >
						<div class='grey darken-3 elevation-2 ' style='height:100%;border-radius: 2px;' role='button' @click='chosen(m)'>
							<img style="width:185px; height:278px;" :src='m.poster_path?`https://image.tmdb.org/t/p/w300${m.poster_path}`: `/static/default_poster.jpg`'>
									<div class='white--text body-2; ' style='text-overflow: ellipsis;white-space: nowrap;width: 185px;overflow: hidden; padding:10px;'>
									{{m.name}}
									</div>
						</div>
					</v-container>
			</template>
		</hrScroll>

		<br>


			<v-card>
				<div style='width:100%; padding:15px; border-radius:2px; elevation-2' class='blue-grey darken-1'>
					<v-layout>

						<p class="subheading white--text" style="margin:auto;"><strong>Top</strong> Rated </p>
						<v-icon class='white--text'>trending_up</v-icon>

					</v-layout>
				</div>



					<v-card>
						<v-layout wrap>
								<template v-for='m in crTv'>
									<v-flex xs6 sm4 md3>
										<v-container grid-list-xs style='height:100%' >
											<div class='grey darken-3' style='height:100%;border-radius:2px;'>
												<img style="width:100%;" :src='m.poster_path?`https://image.tmdb.org/t/p/w300${m.poster_path}`: `/static/default_poster.jpg`'>
												<div>

													<v-container>
														<p style='margin:auto;' class="body-2 white--text" >{{m.name}}</p>
													</v-container>
												</div>
											</div>
										</v-container>
									</v-flex>
								</template>
						</v-layout>
					</v-card>



			</v-card>



	</v-flex>
	</v-layout>

	<v-dialog v-model='notFoundPop' max-width='400px'>
		<v-card>
			<div style="position:absolute; right:0;">
				<v-btn icon dark @click='notFoundPop = false'>
					<v-icon>clear</v-icon>
				</v-btn>
			</div>
			<div v-if='nfLoading && crData === null'>
				<v-container class='grey darken-3'>
					<span class="title white--text ">serching...</span>
				</v-container>
				<v-container>
					<v-layout justify-center>

					<v-progress-circular indeterminate :size="50" color="grey"></v-progress-circular>
					</v-layout>

					<br>
					<p class="body-2 text-xs-center grey--text">Wait untill its loading.</p>
					<v-layout justify-center>

					</v-layout>
				</v-container>
			</div>
			<div v-if='!nfLoading && crData !== null'>
				<v-container class='grey darken-3'>
					<span class="title white--text ">Rating Page not Found</span>
				</v-container>
				<v-container>
					<p class="subheading  text-xs-center">Create a rating page for <strong>{{crData.name || crData.title}}</strong>.</p>
					<p class="body-2 text-xs-center ">this is almost one click process.</p>
					<v-layout justify-center>
					<v-btn block class='grey' dark @click='$router.push(`/movie/submit?title=${crData.title || crData.name}&id=${crData.id}`)'>create raing page</v-btn>
					</v-layout>
				</v-container>
			</div>
		</v-card>
	</v-dialog>


	</div>	
</template>

<script>
const hrScroll = ()=> import('../../../cc/hrScroll');
	export default{
		components:{
			hrScroll
		},
		data(){
			return{
				crMovies:[],
				crTv:[],
				menu:false,

				// query
				qResults:[],
				query:'',
				qBox:false,
				qLoading:false,
				foundResults:[],
				showResults:false,
				resultLoading:false,
				notFoundPop:false,
				nfLoading:false,
				crData:null
			}
		},
		watch:{
			query(i){
				this.qBox = i !== '';
				this.q(i);
			}
		},
		methods:{
			q(i){
				this.qLoading = true;
				this.qResults = [];
				this.$axios.get(`https://api.themoviedb.org/3/search/multi?api_key=${this.$store.state.tmdb}&language=en-US&query=${i}&page=1&include_adult=false`).then(r=>{
					this.qLoading = false;
					console.log(r.data);
					this.qResults = r.data.results;
				}).catch(e=>{
					this.qLoading = false;
					console.log(e);
				})
			},
			selected(m){
				this.showResults = true;
				this.resultLoading = true;
				this.qBox = false;
				this.$axios.get(`${this.$store.state.server}movie/q?ms=${m.name || m.title}`,this.$store.getters.auth).then(r=>{
					this.resultLoading = false;
					console.log(r.data);

					this.foundResults = r.data;
				}).catch(e=>{
					console.log(e);
				})
			},
			chosen(m){
				this.nfLoading = true;
				this.notFoundPop = true;
				this.crData = m
				console.log(m)
				const id = m._id?`id=${m._id}`:`tmdb=${m.id}`
				this.$axios.get(`${this.$store.state.server}movie/find?${id}`,this.$store.getters.auth).then(r=>{

					if(!r.data.error){
						this.$router.push(`/movie/${r.data._id}`);	
						this.nfLoading = false;
					}else{
						this.notFoundPop = true;
						this.nfLoading = false;
					}
					console.log(r.data);
				}).catch(e=>{
					console.log(e);
				})	
			},
			querySelect(type){
				console.log(type)
			}
		},
		created(){
			this.$axios.get(`https://api.themoviedb.org/3/movie/now_playing?api_key=${this.$store.state.tmdb}&language=en-US&page=1&region=IN`).then(r=>{
				this.crMovies = r.data.results;

			}).catch(e=>{
				console.log(e);
			})

			this.$axios.get(`https://api.themoviedb.org/3/tv/on_the_air?api_key=${this.$store.state.tmdb}&language=en-US`).then(r=>{
				this.crTv = r.data.results;
				console.log(r.data)
			}).catch(e=>{
				console.log(e);
			})

		}
	}
</script>

<style >

.HOVER {
	background:#FAFAFA;
}

.HOVER:hover{
	background: #EEEEEE;
}	
</style>