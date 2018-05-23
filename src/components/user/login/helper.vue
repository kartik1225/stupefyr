<template>
	<div>
		<v-dialog v-model='activetor'>

			<v-card>
				thois
			</v-card>
		</v-dialog>
	</div>
</template>

<script>
	export default{
		props:['activetor'],
		data(){
			return{

			}
		},
		created(){
			console.log(this.activetor)
		}
	}
</script>

<style>
	
</style>