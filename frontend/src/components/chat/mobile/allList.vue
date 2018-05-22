<template>

<!-- 	::readme::

		route-path : " THIS COMPONENT " => chatDisplayMobile.vue => userChatProfile.vue -->


	<div class="white">
		<v-layout>

		<!-- search box -->
			<v-text-field			  
			                  label="search"
			                  single-line
			                  full-width
			                  hide-details
			                ></v-text-field>
			    <v-btn icon class='center'>
			    <v-icon>search</v-icon>
			    </v-btn>
		</v-layout>

		<!-- all user list start from here -->
				<v-list two-line >
		            <v-list-tile avatar href to='/test/chat/kartik'>
			            <v-list-tile-avatar>

			            <!-- user profile image -->
			            	<img src="/static/image.jpg"/>
			            </v-list-tile-avatar>
			            <v-list-tile-content>
				            <v-list-tile-title v-text="'kartik'"></v-list-tile-title>
				            <v-list-tile-sub-title v-html="'start a convation with kartik !'"></v-list-tile-sub-title>
			            </v-list-tile-content>
			            <v-list-tile-action>

			            <!-- show green dot if user is online -->
			            	<v-icon class='green--text' style='font-size:12px;'>brightness_1</v-icon>
			            </v-list-tile-action>
		            </v-list-tile>

		            <!-- divider -->
		            <v-divider></v-divider>

		            <!-- this is just another sample text -->
		            <v-list-tile avatar>
			            <v-list-tile-avatar>
			            	<img src="/static/image.jpg"/>
			            </v-list-tile-avatar>
			            <v-list-tile-content>
				            <v-list-tile-title v-text="'kartik'"></v-list-tile-title>
				            <v-list-tile-sub-title v-html="'start a convation with kartik !'"></v-list-tile-sub-title>
			            </v-list-tile-content>
			            <v-list-tile-action>
			            	<v-icon class='green--text' style='font-size:12px;'>brightness_1</v-icon>
			            </v-list-tile-action>
		          </v-list-tile>
		        </v-list>
	</div>
</template>

<script>
	
</script>

<style>
	
</style>