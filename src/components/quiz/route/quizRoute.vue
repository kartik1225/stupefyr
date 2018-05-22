<template>
	<div>
		<v-card height='235px' class='deep-orange'>


			<v-container>
				<p style="margin:auto" :class='`${$vuetify.breakpoint.width > 600?`display-1`:`headline`} white--text text-xs-center`'>Play <strong>quiz</strong> and get <strong>points</strong>.</p>
			</v-container>

			<v-layout justify-center>
				<v-btn outline class='white--text' @click='$router.push(`/quiz/new/1`)'>create new quiz</v-btn>
			</v-layout>
			<br>
			<v-layout justify-center>
				<v-flex sm8 xs11>
					<v-card>
						<v-text-field
						               label="find a Quiz."
						               single-line
						               full-width
						               hide-details
						               append-icon='search'
						               v-model='query'
						               :loading='qLoading'
						               >
						 </v-text-field>
					</v-card>
		<!-- 		<v-slide-y-transition>	
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
				</v-slide-y-transition> -->
				</v-flex>
			</v-layout>


		</v-card>

		<div>

			<div>
					<hrScroll>
				<v-layout justify-center >
						<template v-for='f in filters' >
						<v-btn @click='filterFunc(f)' style='width:200px' round :class='`${f.name !== selectedFilter.name?`grey darken-2`:`red `} white--text`' >{{f.name}} <v-icon right style='font-size:18px;'>{{f.name === selectedFilter.name?'done':f.icon}}</v-icon></v-btn>
							
						</template>

				</v-layout>
					</hrScroll>
			</div>	


			<div style="padding:2px;" >
				<v-card>
					<div style="padding:16px;"  class="grey darken-2 elevation"> 
						<span class="subheading white--text">this will be the <strong>header</strong></span>

					</div>

					<div v-if='noResult'>

						<v-container>
						<p class="title text-xs-center">No Quiz Found</p>
						</v-container>

					</div>



					<div v-if='!noResult'>
					<div>
						<v-container v-show='loading'>
							<v-layout justify-center>
								<v-progress-circular :size='50'  indeterminate color="grey"></v-progress-circular>
							</v-layout>

							<v-container>
								<p class="title grey--text text-xs-center">Getting Quiz...</p>
							</v-container>
						</v-container>

					</div>

					<v-layout wrap>
						<template v-for='qz in quizes'>
							<v-flex md4 sm6>
								<v-container grid-list-xs>
									<div>
										<quizCard :qz='qz'></quizCard>
									</div>
								</v-container>
							</v-flex>
						</template>
					</v-layout>

					</div>

				</v-card>
			</div>
		</div>


	</div>
</template>

<script>
import moment from 'moment' 
import quizCard from '../quizCard.vue'
import hrScroll from '../../../cc/hrScroll.vue'
	export default{
		components:{
			quizCard,
			hrScroll
		},
		data(){
			return{
				quizes:[],
				filters:[{name:'popular',icon:'flash_on'},
						 {name:'newest',icon:'fiber_new'},
						 {name:'expired',icon:'drafts'},
						 {name:'upcoming',icon:'cloud_download'}
						],
				selectedFilter:{name:'popular',icon:'flash_on'},
				loading:false,
				qBox:false,
				qResults:null,
				query:'',
				qLoading:false,
				noResult:false
			}
		},
		watch:{
			query(i){
				this.qBox = i !== '';

				if(this.qBox){
				this.q(i);
				}else{
					this.qLoading = false;
				}
			}
		},
		methods:{
			q(i){
				this.qLoading = true;
				this.loading = true;
				this.qResults = [];
				this.quizes = [];
				this.$axios.get(`${this.$store.state.server}quiz/q?q=${this.query}`,this.$store.getters.auth).then(r=>{
					this.qLoading = false;
					this.loading = false;

					if(r.data.error){
						this.noResult = true;
					}else{
						this.noResult = false;
						this.quizes = r.data;
					}

					console.log(r.data);
					this.qResults = r.data.results;
				}).catch(e=>{
					this.qLoading = false;
					console.log(e);
				})
			},
			fetch(){

				this.loading = true;
				this.noResult = false;
				this.$axios.get(`${this.$store.state.server}quiz/getall/${this.$store.getters.id}+${this.selectedFilter.name}`,this.$store.getters.auth).then(r=>{
					console.log(r.data);

					this.loading = false;

					this.quizes = r.data;
				}).catch(e=>{
					console.log(e);
				})
			},
			timeCounter(){

				setInterval(function(){
					 let duration = moment.duration(1000, 'milliseconds');

					 console.log(duration);

				}, 1000);

			},
			filterFunc(f){
				this.quizes = [];
				console.log(f);
				this.selectedFilter = f;
				this.fetch();
			}
		},
		created(){

			this.fetch();
		}
	}
</script>

<style>


</style>