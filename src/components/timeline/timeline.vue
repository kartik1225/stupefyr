<template>
<div>
<v-layout justify-center>
	<v-flex md6 lg5 >
		<br>
		<postCreater style='z-index:2' class='postCreater'></postCreater>
	
		<post style='z-index:-1' :posts='posts' path='user/feed/' :loaded='loaded' :noPost='noPost'></post>

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

		// this.posts = [];

		// axios.get(`${this.$store.state.server}user/post/${this.$store.getters.id}`,this.$store.getters.auth).then(r=> {
		// 	r.data.map(d=>{
		// 		d.likes.map(l=>{
		// 			// console.log(l)
		// 			l.user === this.$store.getters.id?(d.liked = true,console.log(l)) : console.log('not liked')
		// 		})
		// 	})
		// 	this.posts = r.data;
		// 	console.log(this.posts)
		// }).catch(e=>{
		// 	console.log(e)
		// })
		// bus.$on('postfeed',d => {

		// 	this.noPost = false;
		// 	if( d.start < 0 ){
		// 		d.start = 0
		// 	}else{

		//     d.start -= 10;
		// 	}

		// 	const start = d.start < 0 ? 0 : d.start + this.posts.length;
		//     console.log(d , this.posts.length)
		//     axios.get(`${this.$store.state.server}user/feed/${this.$store.getters.id}/${start}`,this.$store.getters.auth).then(r => {
		//     	// alert('nu;ll')
		//     if(r.data.error){
		//     	this.noPost = true;
		//     }else if(r.data){
		//     	this.loaded = true;
		//     	this.posts = this.posts.concat(r.data);
		//         r.data.map(data=>{

		//         		// this.posts.push(data);
		//         		data.likes.map(l=>{
		//         		  l.user === this.$store.getters.id?(data.liked = true,console.log(l)) : console.log('not liked')
		//         		})


		//         })
		//       }else{
		//         this.noPost = true;
		//       }
		//       }).catch(e =>{
		//         console.log(e);
		//       })

		// })
	}

	
}

</script>

<style>
.postCreater{
	z-index:3;
}
</style>