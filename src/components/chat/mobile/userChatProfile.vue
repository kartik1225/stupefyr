<template>
	<v-card class='elevation-0'>
		<v-container>
			<v-layout justify-center>

			<!-- user profole image -->
				<img src="/static/image.jpg" width="100%" class="sideImg elevation-5"  />
			</v-layout>
			<br>
			<p class="title text-xs-center">kartik</p>
			<p class="caption text-xs-center">online</p>
			<v-layout justify-center>

			<!-- go to user's profile -->
			<v-btn flat>
				go to kartik's profile 
			</v-btn>
			</v-layout>
			<br>

			<!-- all other media stuff goes here -->
			<p class="text-xs-center">media</p>
		</v-container>
	</v-card>
</template>

<script>
	
</script>

<style>
.sideImg{
	background-repeat: no-repeat !important;
	background-position: 50% !important;
	border-radius: 50% !important;
	width: 170px !important;
	height: 170px !important;

}
	
</style>