<template>
	<div>
<!-- need more improvements -->

<!-- for larger devices -->
	<movieDesktop :feed='feed'></movieDesktop>

<!-- responsive for mobile layout -->
	<movieMobile :feed='feed'></movieMobile>



	</div>
</template>


<script>
const movieMobile = () => import('./moviePage/movieMobile')
const movieDesktop = () => import('./moviePage/movieDesktop')
	export default{
		components:{
			movieDesktop,
			movieMobile
		},
		data(){
			return{
				  feed:{
				 	feedbox:true,
				 	rate:true,
				 	yes:true,
				 	no:true,
				 	size:'lg6'

				 }
			}
		}
	}
</script>

<style>

</style>