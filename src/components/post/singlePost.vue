<template>
<div>
<v-layout justify-center>
	<v-flex md6 lg5 >
	
		<post style='z-index:-1' :posts='posts' path='one/' :loaded='loaded' :noPost='noPost'></post>

	</v-flex>
</v-layout>
</div>
</template>

<script type="text/x-template">
	<div>
		
	</div>
</script>

<script>
const post = () => import('../post/post')
const postCreater = () => import('../post/postCreater')	
import axios from 'axios'
import {bus} from '../../main'

export default{
	components:{
		post,
		postCreater
	},
	data(){
		return{
			posts:[],
			noPost:false,
			loaded:false
		}
	},
	created(){

	}

	
}

</script>

<style>
.postCreater{
	z-index:3;
}
</style>