<!-- to active this emit 'mp_pop' -->

<template>
	<div>
		<v-dialog persistent v-model='pop' :fullscreen='$vuetify.breakpoint.width < 600' max-width='450px' :transition='$vuetify.breakpoint.width < 600?"dialog-bottom-transition":"scale-transition"' >
			<v-card>
				<!-- toolbar  -->

				<v-toolbar dark class='deep-purple' v-show='$vuetify.breakpoint.width < 600'>
					<v-toolbar-title>Write a review or best part </v-toolbar-title>
					<v-spacer></v-spacer>
					<v-btn icon @click='pop = false'><v-icon>clear</v-icon></v-btn>
				</v-toolbar>

				<v-layout justify-center>
					<div style="width:100%;">
						<div>

							<!-- swich mode -->
							<v-layout class='grey lighten-4' >

								<div :class="type.best_part?`white`:null" style='width:calc(100% - 2px);' >
									<v-btn :class='type.best_part?`deep-purple--text`:`grey--text`' small flat block @click='select(`best_part`)'>best part</v-btn>
									<v-divider v-show='!type.best_part'></v-divider>
								</div>

								<div class="vr"></div>

								<div style='width:100%;' :class="type.review?`white`:null">
								<v-btn flat small block :class='type.review?`deep-purple--text`:`grey--text`' @click='select(`review`)'>review</v-btn>
								<v-divider v-show='!type.review'></v-divider>
								</div>

							</v-layout>

						  <v-container grid-list-lg>
						  <v-layout >

						  <!-- user avatar image -->
						    
						    <v-avatar                 
						      size="36px"
						      class="grey lighten-4"
						    >
						       <img src='/static/default-profile.png'/>
						    </v-avatar>

						    <v-layout style='margin-left: 0px;margin-top: 8px;'>
						    <!-- user name -->
						    <p class="subheading" style="margin-top:auto; margin-bottom:auto; margin-left:5px;">kartik</p>
						    <v-icon style='font-size:14px;'>play_arrow</v-icon>

						    <!-- user post priority -->
						    <p class="caption" style="margin-top:auto; margin-bottom:auto; margin-left:2px;">Sherlock</p>
						    <v-icon style='margin-left:2px; font-size:6px;'>fiber_manual_record</v-icon>

						    <p class="caption" style="margin-top:auto; margin-bottom:auto; margin-left:2px;">{{type.best_part? `best plot`:`review`}}</p>
						    <v-icon style='margin-left:2px; font-size:13px;'>{{type.best_part? `format_quote`:`movie`}}</v-icon>

						    </v-layout>

						  </v-layout>
						</v-container>

							<v-container>
								<div class='txt'>
									<v-text-field
							             :label="`write a ${type.best_part?`best part`:`review`} here ...`"
							             v-model="txt"
							             counter
							             max="120"
							             full-width
							             multi-line
							             single-line
									></v-text-field>
								</div>	


							</v-container>
						</div>	


						<!-- post and cancel btns -->
						<div style="width:100%; position:absolute; left:0;  bottom:0px;">
							<v-divider  style='right:0; left:0px;'></v-divider>

							<v-layout>
								<v-spacer></v-spacer>
								<v-btn flat error @click='pop = false'> cancel</v-btn>
								<v-btn flat :disabled='post_desabled' @click='post'>post</v-btn>
							</v-layout>
						</div>

					</div>
				</v-layout>
			</v-card>
		</v-dialog>	
	</div>
</template>

<script>
	export default {
		props:['movie'],
		data(){
			return{
				txt:'',
				pop:false,
				// swich
				type:{
					best_part:false,
					review:false
				},
				post_desabled:true
			}
		},
		watch:{
			txt(i){
				this.validate();
			},
			'$vuetify.breakpoint.width':function(i){
				this.responsive();
			}
		},
		methods:{
			select(mode){
				this.type.best_part = mode === 'best_part' 
				this.type.review = mode === 'review' 
			},
			responsive(){
					let el = document.querySelector('.txt textarea');
					// responsive height

					if(this.$vuetify.breakpoint.width < 600){

				   		el.style.height = `${this.$vuetify.breakpoint.height - 56 - 48 - 52 - 48 - 41 - 32}px`
				   		
					}else{

						el.style.height = `${150}px`

					}
			},
			validate(){
				this.post_desabled = this.txt === ''
			},
			post(){

				const type = this.type.best_part === true?`best_part`:`review`


				let data = {
					user:this.$store.getters.id,
					content:this.txt,
					type,
					movieId:this.movie._id || this.movie
				}

				this.$axios.post(`${this.$store.state.server}movie/newpost`,data,this.$store.getters.auth).then(r=>{
					console.log(r.data);

					this.$bus.$emit(`mp_created`,r.data);
					this.pop = false;
					this.txt = '';
					this.post_desabled = true;

				}).catch(e=>{
					console.log(e);
				});
			}
		},
		mounted(){
			// console.log(this.movie)
			// setting defaults
			this.responsive();
			this.type.review = true;


			this.$bus.$on(`mp_pop`,r=>{
				this.pop = true;
				if(r === 'best_part'){
					this.type.best_part = true;
					this.type.review = false;
				}else{
					this.type.review = true;
					this.type.best_part = false;
				}
		
			})
		}
	}
	
</script>

<style >
	.vr {
	    width:1px;
	    background-color:#e0e0e0;
	}


</style>