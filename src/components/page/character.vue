<template>
<div>
<v-layout row-sm column child-flex-sm>
<v-flex xs12 sm6 md6>
	    <v-card hover>
	    <v-container fluid>
	    <v-layout>

	    <!-- profile image -->
	      <img src="/static/image.jpg"  class="profile" ><br>
	      <v-container>

	    <!-- character real name -->
	      <p class="title" style="">awesome name</p>

	      <!-- in movie name -->
	      <p><strong>As:</strong> movie name </p>

	      <v-flex xs5>
		      <v-layout>

		      <!-- up votes -->
		      	<h5 style=" margin-top:auto; margin-bottom:auto;"> 43  </h5>
		      	<v-icon class='light-green--text' style=''>arrow_drop_up</v-icon>
		      <v-spacer></v-spacer>

		      <!-- down votes -->
		      	<h5 style=" margin-top:auto; margin-bottom:auto;"> 3  </h5>
		      	<v-icon class='red--text'>arrow_drop_down</v-icon>
		      </v-layout>
	      </v-flex>

	      </v-container>
	    </v-layout>
	    </v-container>

	    <!-- we have also ability to hide if user have not seen the movie yet -->
	    <div v-show='true'>
	    <v-divider></v-divider>

<!-- up vote and down vote creater -->
	<v-flex xs7>
	    <v-card-actions>
	      <v-btn icon>
	      	<v-icon>thumb_up</v-icon>
	      </v-btn>
	      <v-spacer></v-spacer>
	      	your vote?
	      	<v-spacer></v-spacer>
	      <v-btn icon>
	      	<v-icon>thumb_down</v-icon>
	      </v-btn>
	    </v-card-actions>
	</v-flex>

	</div>
	</v-card>
</v-flex>

<v-flex xs12 sm6 md6>

 <v-card hover>
	    <v-container fluid>
	    <v-layout>

	    <!-- profile image -->
	      <img src="/static/image.jpg"  class="profile" ><br>
	      <v-container>

	    <!-- character real name -->
	      <p class="title" style="">awesome name</p>

	      <!-- in movie name -->
	      <p><strong>As:</strong> movie name </p>

	      <v-flex xs5>
		      <v-layout>

		      <!-- up votes -->
		      	<h5 style=" margin-top:auto; margin-bottom:auto;"> 43  </h5>
		      	<v-icon class='light-green--text' style=''>arrow_drop_up</v-icon>
		      <v-spacer></v-spacer>

		      <!-- down votes -->
		      	<h5 style=" margin-top:auto; margin-bottom:auto;"> 3  </h5>
		      	<v-icon class='red--text'>arrow_drop_down</v-icon>
		      </v-layout>
	      </v-flex>

	      </v-container>
	    </v-layout>
	    </v-container>

	    <!-- we have also ability to hide if user have not seen the movie yet -->
	    <div v-show='true'>
	    <v-divider></v-divider>

<!-- up vote and down vote creater -->
	<v-flex xs7>
	    <v-card-actions>
	      <v-btn icon>
	      	<v-icon>thumb_up</v-icon>
	      </v-btn>
	      <v-spacer></v-spacer>
	      	your vote?
	      	<v-spacer></v-spacer>
	      <v-btn icon>
	      	<v-icon>thumb_down</v-icon>
	      </v-btn>
	    </v-card-actions>
	</v-flex>

	</div>
	</v-card>

</v-flex>
</v-layout>
</div>
</template>