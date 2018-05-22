<template>
	<v-flex offset-md2  md8>

	<!-- rating card -->
		<v-card class='sidebar light-green' >
		<v-layout align-start>

		<!-- movie poster image -->
			<img src='/static/poster.jpg' style="height:100%">

			<!-- side card from the image -->
				<v-card style='width:100%;' height='450px' >
						<v-container>
							<h1 class="text-xs-center">4.2</h1>
							<v-layout justify-center>

							<!-- star rating indicater -->
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

							<!-- pepole's recomndeation of this movie -->
							<v-layout justify-center>
									<h5 class="text-xs-center" ><strong>42</strong> pepole recomend to watch this movie </h5>
							</v-layout>

							<!-- movie ganra -->
							<v-layout justify-center>
									 <v-chip outline class="red red--text">Action</v-chip> 
									 <v-chip outline class="red red--text">Comedy</v-chip> 
									 <v-chip outline class="red red--text">Horror</v-chip>
							</v-layout>

							<!-- rest of things -->
							</v-container>

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
		</v-layout>
		</v-card>

		<br>


	</v-flex>
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