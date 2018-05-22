<template>

		<v-slide-x-reverse-transition>

			<v-container grid-list-sm v-show='!feed.yes'>
				<v-layout row wrap>
				<v-flex v-bind="{ [`${size}`]: true }" >
					<v-card class='grey darken-3' height='100%'> 
						<v-container class='v-middle'>

								<div v-show='!rated' >
									
									<p class="title white--text "> How much do you like this movie?</p>

									<br>
									<v-layout justify-center>
										 <v-btn @click='$bus.$emit(`raingCardPop`,true)' outline dark>Rate this movie &nbsp<v-icon style='font-size:18px;'>star_half</v-icon></v-btn>
									</v-layout>
								</div>

								<!-- after action -->
								<v-slide-x-reverse-transition>
									<div v-show='rated'>
										<v-container>

										<p class="white--text display-1 text-xs-center">Your vote has been submited</p>

										<v-layout justify-center>
											<v-btn outline dark @click='$bus.$emit(`raingCardPop`,true)' > edit rating &nbsp <v-icon style='font-size:18px'>edit</v-icon></v-btn>
										</v-layout>
										</v-container>
									</div>
								</v-slide-x-reverse-transition>


							</div>
						</v-container>
					</v-card>
				</v-flex>

				<v-flex v-bind="{ [`${size}`]: true }" >
					<v-card class='deep-orange title' height='100%'> 
						<v-container>

							<p class="white--text">what was the best part/plot of the movie movie?</p>

							 <v-text-field
							 		@click='$bus.$emit(`mp_pop`,`best_part`)'
					                name="input-1"
					                label="Label Text"
					                textarea
					                dark
              				 ></v-text-field>
							<v-layout justify-center>
							<v-btn outline class='white--text'> submit</v-btn>
							</v-layout>
						</v-container>
					</v-card>

					<!-- after subbmition diaplay user's post link(button) and sharing options.. -->
				</v-flex>

				<v-flex v-bind="{ [`${size}`]: true }" >
					<v-card height='100%' class='light-green'> 
						<v-container>
							<p class="white--text title">which character is your favourite?</p>
							<br>

							<v-layout justify-center>
							<v-icon style='font-size:85px;'>face</v-icon>
							</v-layout>
							<br>
							<p class="caption white--text">"you can vote for your favourite character"</p>
							<br>
							<v-layout justify-center>
							<v-btn outline class='white--text'>see all from this movie</v-btn>
							</v-layout>

						</v-container>
					</v-card>
					<!-- navigate to the down to castings... or show if we have all ready most popular one! -->
				</v-flex>



				</v-layout>
			</v-container>

		</v-slide-x-reverse-transition>
</template>

<script>

const StarRating = ()=> import('vue-star-rating')


	export default{
		props:['feed'],
		components:{
			StarRating
		},
		data(){
			return{
				size:'',
				rated:false
			}
		},
		mounted(){
			this.size = this.feed.size

			this.$bus.$on(`rated`,r=>{
				this.rated = true;
			})
		}
	}
</script>

<style>
	.v-middle{
	  position: relative;
	  top: 50%;
	  transform: translateY(-50%);
	}

</style>