<template>
	  <!-- ................................................ comment loop can be start here .......................................... -->
	  	<!-- comment lopp -->
	          <!-- user commemnt display -->
	            <v-container fluid>
	  	<template v-for='cmt in cmts'>
	            <v-layout row>

	            <!-- commnet user image profile -->
	            <v-flex xs2 md1 fill-height>
	              <v-list-tile-avatar>
	                     <img :src="cmt.userImg"/>
	                   </v-list-tile-avatar>
	            </v-flex>

	            <!-- post content wrap -->
	            <v-flex xs10 md11>
	              <v-layout row>

	              <!-- comment user post  -->
	              <v-flex xs8>
	                <p class="subheading text-xs-left">{{cmt.userName}}</p>
	              </v-flex>

	              <!-- commet user created time -->
	               <v-flex xs4>
	                <p class="caption orange--text text-xs-right">{{cmt.createdAt}}</p>
	              </v-flex>

	              </v-layout>

	              <!-- comment user's comment -->
	              <p class="caption">{{cmt.says}}</p>

	              <!-- comment actions -->
	              <v-flex xs6 sm6 md3>
	              <v-layout justify-space-between >
	               <p class="caption orange--text">like</p><p class="caption orange--text">replay</p><p class="caption orange--text">share</p>
	              </v-layout>
	              </v-flex>
	              </v-flex>

	              <!-- comment edit opctions -->
	              <v-flex xs0>
	                <v-menu bottom left>
	                 <v-btn icon slot="activator" light>
	                   <v-icon class='orange--text'>more_vert</v-icon>
	                 </v-btn>
	                 <v-list>
	                   <v-list-tile v-for="item in items" :key="item.title">
	                     <v-list-tile-title>{{ item.title }}</v-list-tile-title>
	                   </v-list-tile>
	                 </v-list>
	               </v-menu>
	              </v-flex>

	            </v-layout>
	</template>
	            </v-container>
	<!-- ................................................. comment loop will ends here ...................................................... -->
</template>

<script>
	export default{
		props:['items'],
		data(){
			return{
				cmts:[{
						userImg:'/public/image.jpg',
						userName:'kartik',
						createdAt:'1 hr ago',
						says:'Create an account or login. Connect with friends, family and other people you know. Share photos and videos, send messages and get updates.'
				
					},
					{
						userImg:'/public/image.jpg',
						userName:'kartik',
						createdAt:'1 hr ago',
						says:'Create an account or login. Connect with friends, family and other people you know. Share photos and videos, send messages and get updates.'
					}]
			}
		}
	}
	
</script>

<style>
	
</style>