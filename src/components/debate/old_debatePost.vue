u<template>
	<div>
	<v-layout justify-center>
		<v-flex xs10>
		<br>
		<v-card>

		<v-layout>
				<img src="/static/poster.jpg" class="halfimg" />
				<img src="/static/image.jpg" class="halfimg" />
		</v-layout>


		<v-layout justify-center class='pole'>
		<v-flex xs6>

			<v-btn  large block class='amber' @click='voteMaker("this")'>
			{{btn1.score}}
			</v-btn>
		</v-flex>

		<v-flex xs6 >
			<v-btn v-show='btn2.show' large block class='black white--text' @click='voteMaker("that")' >
			{{btn2.score}}
			</v-btn>
		</v-flex>
		</v-layout>
		<v-slide-y-transition>

		</v-slide-y-transition>
		
		<v-card-actions>
		   <!-- like butten -->
		  <v-btn flat   v-tooltip:top="{ html: 'like' }">
		    <v-icon class="orange--text">thumb_up</v-icon>
		  </v-btn>

		  <v-spacer></v-spacer>

		  <!-- comment butten -->
		  <v-btn icon @click.native="show = !show" class="orange--text" v-tooltip:top="{ html: 'comments' }">
		              <v-icon>{{ show ? 'chat_bubble_outline' : 'chat_bubble' }}</v-icon>
		            </v-btn>

		  <v-spacer></v-spacer>

		  <!-- share butten -->
		  <v-btn flat  v-tooltip:top="{ html: 'share post' }">
		   <v-icon class="orange--text">share</v-icon>
		  </v-btn>

		</v-card-actions>
			
		<!-- content visibility -->
		   <div v-show='show'>

		   <!-- comment creation by user -->
		   <v-container fluid>
		   <v-layout row wrap >

		     <!-- comment user profile image -->
		     <v-flex  md1 hidden-sm-and-down>
		       <v-list-tile-avatar>
		         <img src="/static/image.jpg"/>
		       </v-list-tile-avatar>
		     </v-flex>

		     <!-- commet input-box -->
		     <v-flex sm10 md9 >
		               <v-text-field
		                             label="Subject"
		                             placeholder='your thought?'
		                             single-line
		                             full-width
		                             hide-details
		                             ></v-text-field>
		     </v-flex>

		     <!-- comment post buttun -->
		         <v-layout row justify-center >
		         <v-flex xs1>
			         <v-btn class='orange--text' icon>
			           <v-icon>send</v-icon>
			         </v-btn>
		         </v-flex>
		         </v-layout>

		   </v-layout>
		   </v-container>

		   <!-- comment loop -->
		   <postCmt :items='items'></postCmt>

		   </div>

		</v-card>
		</v-flex>
	</v-layout>
	</div>
</template>

<script>
const postCmt = ()=> import('../post/postCmt')
export default{
	components:{
		postCmt
	},
	data(){
		return{
			show:false,
			btn1: {
				show:true,
				score:'this'
			}
			,
			btn2: {
				show:true,
				score:'that'
			},
			showLikes:false,
			items: [
			   {
			     title: 'edit',
			     icon: 'edit'
			   },
			   {
			     title: 'delete',
			     icon: 'delete'
			   }
			 ]

		}
	},
	methods:{
		voteMaker(i){
 			i === 'this' ? (this.btn1.score = 1 , this.btn2.score = 0 + ' pepole voted to this')  : (this.btn2.score = 1 ,this.btn1.score = 0 + ' pepole voted to that')
		}
	}
}
	
</script>

<style>
.halfimg{
	width: 50%;
	max-height: 100%;
}

.pole{
	margin-top: -55px;

}
	
</style>