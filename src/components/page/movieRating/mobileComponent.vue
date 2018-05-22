<template>
	<v-layout column>
	<v-flex xs14>
	<v-card>

	<!-- user profile image -->
		<img src='/static/poster.jpg' style="width:100%;" />
	</v-card>
	</v-flex>
	<v-flex xs12>

	<!-- after movie poster card -->
	<v-card>
		<v-card style='width:100%;' >
			<v-container>

			<!-- movie title goes here! "remember this is only for mobeile screens"-->
				<h2 class="text-xs-center">this is a movie title</h2>

				<!-- ratings overall -->
				<h1 class="text-xs-center">4.2</h1>

				<!-- ratings in star  -->
				<v-layout justify-center>
					<star-rating v-bind:increment="0.1" 
					             v-bind:max-rating="5" 
					             inactive-color="#000" 
					             active-color="#f00" 
					             v-bind:star-size="40"
					             :padding='10'
					             :show-rating='false'>
					</star-rating>
				</v-layout>
				<br>

				<!-- user's recomemdations -->
				<v-layout justify-center>
						<h5 class="text-xs-center" ><strong>42</strong> pepole recomend to watch this movie </h5>
				</v-layout>

				<!-- movie genra -->
				<v-layout justify-center>
						 <v-chip outline class="red red--text">Action</v-chip> <v-chip outline class="red red--text">Comedy</v-chip> <v-chip outline class="red red--text">Horror</v-chip>
				</v-layout>
				</v-container>

				<!-- more stuff  -->
				<v-layout justify-center>
							<v-btn outline class='red--text' large> 
							become a fan
							<v-icon class='red--text' large>favorite</v-icon>
							</v-btn>
							</v-layout>

							<br>
				<v-layout justify-center>
					<v-icon>keyboard_arrow_down</v-icon>
				</v-layout>
		      </v-card>
	</v-card>

	

	</v-flex>
	</v-layout>
</template>

<script>
	
import StarRating from 'vue-star-rating'
const character = ()=> import('../character')
const postCmt = ()=> import('../../post/postCmt')
	
	export default{
		props:['items'],
		components:{
			character,
			postCmt,
			StarRating
		},
		data(){
			return{
				show:false
			}
		}
	}


</script>