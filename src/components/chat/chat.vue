<template>
	<div>
		<!-- <allList class='hidden-md-and-up'></allList> -->
		<chatDesktop :list='list'></chatDesktop>
	</div>
</template>

<script>
import axios from 'axios'
const allList = ()=> import('./mobile/allList')
const chatDesktop = ()=> import('./chatDesktop')

	
	export default{
		components:{
			allList,
			chatDesktop
		},
		data(){
			return{
				list:null
			}
		},
		mounted(){
			axios.get(`${this.$store.state.server}chat/all/${this.$store.getters.id}`,this.$store.getters.auth).then(r=>{
				console.log(r.data);
				this.list = r.data;
			}).catch(e => {
				console.log(e);
			})
		}
	}
</script>

<style>
	
</style>