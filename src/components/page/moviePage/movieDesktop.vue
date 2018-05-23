<template>

	<div class="hidden-sm-and-down">
		<div class="of " style="height:100%">
			<v-card class='amber elevation-2' min-height='100%' >
			<img src="/static/poster.jpg" style="width:100%">
			
			<v-container>
			<v-layout>
			<v-flex xs10>
			<p class="display-1">this is a movie title </p>
			</v-flex>

			<v-flex xs2>
			<v-btn icon>
				<v-icon>more_vert</v-icon>
			</v-btn> 
			</v-flex>
			</v-layout>

			<p class="subheading "><v-icon >timeline</v-icon>42k fans</p>
			<br>
			<v-btn outline class='white--black'>join to fan club</v-btn>


			<v-card-actions>
			<v-btn icon>
				<v-icon>share</v-icon>
			</v-btn>
			</v-card-actions>
			</v-container>
			</v-card>
		</div>

	<!-- main content -->

	<div class=" main">
	<v-layout justify-center>
	<v-flex xs7>
			<br>
			<postCreater></postCreater>
			<br>
			<v-card class='deep-orange' v-show='feed.feedbox'>
				
			<div>
					<v-container >
					<p class="white--text test-xs-center title">have you seen this movie yet?</p>
					<v-layout>
							<v-btn outline block class='white--text' @click='feed.yes = false, feed.feedbox = false'>
							yes
							</v-btn>

							<v-btn outline block class='white--text' @click='feed.no = false, feed.feedbox = false'>
							no
							</v-btn>
					</v-layout>
					</v-container>
			</div>
			</v-card>
			<!-- if yes -->
			<div>
				<yesAction :feed='feed'></yesAction>
				<noAction :feed='feed'></noAction>
			</div>

			<br>

			<post></post>

	</v-flex>
	</v-layout>
	</div>

	</div>

</template>

<script>

const post = ()=> import('../../post/post')
const postCreater = ()=> import('../../post/postCreater')
const yesAction = ()=> import('../movieRating/yesAction')
const noAction = ()=> import('../movieRating/noAction')

export default{

	components:{
		post,
		postCreater,
		yesAction,
		noAction
	},
	props:['feed'],
	data(){
		return{
			  
		}
	}
}

</script>

<style scoped>
	.of{
		overflow-y: auto;
		overflow-x: hidden;
		max-height: calc(100% - 64px);
		flex-direction: column;
		position: fixed;
		display: flex;
		width: 330px;
	}

	.main{
		position: relative;
		display: flex;
		left: 0;
		margin-left: calc(25% + 0px);
	}
</style>