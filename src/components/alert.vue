<template>
	<div>
		<v-dialog v-model="dialog">
		     <v-card>
		       <slot></slot>
		     </v-card>
		</v-dialog>
	</div>
</template>

<script>
import { bus }from '../main'	
	export default {
		data(){
			return{
				dialog:true
			}
		},
		created(){
			bus.$on('alert',(data)=>{
				console.log(data);
				this.dialog = data;
			})
		}
	}
</script>

<style>
	
</style>