<template>
	
	<v-container grid-list-xs>
<v-layout v-show='!feed.no' row-sm column child-flex-sm wrap>

	<v-flex xs12 sm6 md6 lg3>
		<v-card>
			<v-container>
				<p class="title">little about this movie!</p>
				<p class='subheading'>The Dark Knight of Gotham City begins his war on crime with his first major enemy being the clownishly homicidal Joker.</p>
			</v-container>
		</v-card>
	</v-flex>

	<v-flex xs12 sm6 md6 lg3>
		<v-card height='100%'>
			<v-container>
				<p class="title">Diractor</p>
				<p class='subheading'>Tim Burton</p>
				and maybe some more stuff from api
			</v-container>
		</v-card>
	</v-flex>

	<v-flex xs12 sm6 md6 lg3>
		<v-card height='100%'>
			<v-container>
				<p class="title">please comeback here to give a review later.</p>
				<v-icon>share</v-icon>
			</v-container>
		</v-card>
	</v-flex>

	<v-flex xs12 sm6 md6 lg3>
		<v-card height='100%'>
			<v-container>
				<p class="title">see more</p>
				<v-icon>keyboard_arrow_down</v-icon>
			</v-container>
		</v-card>
	</v-flex>
</v-layout>

	</v-container>
</template>

<script>

export default{
	props:['feed'],
	data(){
		return{

		}
	}
}

</script>