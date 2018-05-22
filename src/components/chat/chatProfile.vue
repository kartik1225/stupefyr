
<template>

	<v-slide-x-transition>
<v-flex lg4 class='white elevation-1' :style='$vuetify.breakpoint.width < 600? `height:calc(${$vuetify.breakpoint.height}px - 56px)`:"height:76vh"' style='overflow:auto' >

		<v-container>
		<!-- profile image of user bigger one -->
		<v-layout justify-center>
			<v-avatar size='200px'>
				<img src="/static/image.jpg" width="100%" class="sideImg" role='button' @click='fullProfileImage' />
			</v-avatar>
		</v-layout>
			<br>
			<br>
			<p class="title text-xs-center">daa</p>
			<p class="caption text-xs-center">online</p>

			<!-- go to profile button -->
			<v-layout justify-center >
				<v-btn flat>
					go to kartik's profile 
				</v-btn>
			</v-layout>
			<br>

			<!-- more stuff will goes here -->
			<p class="text-xs-center">media</p>

			<!-- <postPhotos></postPhotos> -->


		</v-container>

</v-flex>

<v-dialog v-model="image" max-width="290">
      <v-card>
        <v-card-title class="headline">Use Google's location service?</v-card-title>
        <v-card-text>Let Google help apps determine location. This means sending anonymous location data to Google, even when no apps are running.</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" flat="flat" @click.native="dialog = false">Disagree</v-btn>
          <v-btn color="green darken-1" flat="flat" @click.native="dialog = false">Agree</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</v-slide-x-transition>

</template>

<script>
	export default{
		data(){
			return{
				image:true
			}
		},
		methods:{

		}
	}
</script>

<style>
	
</style>