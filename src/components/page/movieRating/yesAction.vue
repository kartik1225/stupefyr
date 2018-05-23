<template>

		<v-slide-x-reverse-transition>
			<v-container grid-list-sm v-show='!feed.yes'>
				<v-layout row-sm column child-flex-sm wrap>
				<v-flex v-bind="{ [`${size}`]: true }" md6 sm6 xs12>
					<v-card class='grey darken-3' height='320px'> 
						<v-container>
						<v-slide-x-reverse-transition>
							<div v-show='feed.rate'>

							<p class="title text-xs-left white--text"> how much do you like this movie?</p>
							<br>

							<v-layout justify-center>
							<star-rating v-bind:increment="0.1" 
							             v-bind:max-rating="5" 
							             inactive-color="#000" 
							             active-color="#f00" 
							             v-bind:star-size="30"
							             :padding='8'
							             :show-rating='false'>
							</star-rating>
							</v-layout>
							<h2 class="text-xs-center white--text">4.2</h2>

							<p class="text-xs-center caption white--text" >recomend to other?</p>

						<v-layout>

						<v-btn flat outline class='white--text' >
							yes
						</v-btn>
						<v-spacer></v-spacer>
						<v-btn flat outline  class='white--text' @click='feed.rate = false'>
							nope
						</v-btn>
						</v-layout>
						</div>
						</v-slide-x-reverse-transition>


						<!-- after action -->
						<v-slide-x-reverse-transition>
							<div v-show='!feed.rate'>
								<v-container>
								<p class="white--text display-1 text-xs-center">thank you for your help ✌️</p>
								</v-container>
							</div>

						</v-slide-x-reverse-transition>
						</v-container>
					</v-card>
				</v-flex>

				<v-flex v-bind="{ [`${size}`]: true }" md6 sm6 xs12>
					<v-card class='lime accent-2' height='100%'> 
						<v-container>
						<br>
							<p class=" title">talk with other fans of this movie!</p>
							<br>
							<v-layout justify-center>
							<v-icon class='text-xs-center' style='font-size:75px;'>chat</v-icon>
							</v-layout>

							<br><br>
							<v-card-actions>
							<v-spacer></v-spacer><v-btn outline> go to the page </v-btn><v-spacer></v-spacer>
							</v-card-actions>
						</v-container>
					</v-card>
				</v-flex>

				<v-flex v-bind="{ [`${size}`]: true }" md6 sm6 xs12>
					<v-card class='deep-orange title' height='100%'> 
						<v-container>

							<p class="white--text">what is the best part of this movie?</p>

							 <v-text-field
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

				<v-flex v-bind="{ [`${size}`]: true }" md6 sm6 xs12>
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
				size:'lg3'
			}
		},
		mounted(){
			this.size = this.feed.size
		}
	}
</script>