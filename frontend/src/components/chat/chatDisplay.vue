
<template>
	<div>
	<v-flex xs12>
		<v-progress-linear v-show='loading' style='position:relative;' v-bind:indeterminate="true"></v-progress-linear>
	<!-- chat display loop start	 -->
		<template v-show='isNew' v-for='(convo ,index) in Chatdata'>

			<v-layout justify-center v-show='Chatdata.length  === index + 1?Date.parse(Chatdata[index].created):Date.parse(Chatdata[index + 1].created) - Date.parse(Chatdata[index].created) > 7200000?true:false'>
	<v-card style='border-radius:7px; margin-top:4px;'>
		<v-container grid-list-xs>
			<p style="margin: auto;font-size: 12px;"><timeago :since='convo.created' :max-time="86400 * 3"></timeago></p>
		</v-container>
	</v-card>
	</v-layout>


	<!-- faddu code 😅 -->
	<!-- {{Chatdata.length  === index + 1?Date.parse(Chatdata[index].created):Date.parse(Chatdata[index + 1].created) - Date.parse(Chatdata[index].created) > 3600000?true:false }} -->

		<!-- usre's friend's chat aria -->

			<div v-show='!convo.self'>

			<!-- if user have single msg then this will exicute-->
				<div v-show='!convo.again' >
					<v-layout >

					<!-- user profile image -->
						<img src="/static/image.jpg" class="circal" />
					<v-card class='white max' >
							<v-container grid-list-md>
								<v-slide-y-reverse-transition>
								<p class="center" >{{convo.msg}}</p>
								</v-slide-y-reverse-transition>
							</v-container>
						</v-card>
					</v-layout>
				</div>

			<!-- if user have multipule msg then this will exicute -->
				<div v-show='convo.again' style="margin-left:50px;">
					<v-layout>
						<v-card class='white max' style='margin-top:8px'>
							<v-container grid-list-md>
							<v-slide-y-reverse-transition>
								<p class="center" >{{convo.msg}} </p>
							</v-slide-y-reverse-transition>
							</v-container>
						</v-card>
					</v-layout>
				</div>
			<!-- have to add time some how but for later i'll do this stuff(s) -->
			</div>

		<!-- user self chat aria -->
			<div v-show='convo.self'>
				<v-layout justify-end >
					<v-card class='amber max elevation-1' style='margin-top:8px'>
						<v-container grid-list-md>
						<v-slide-y-reverse-transition>
							<p  class="center">{{convo.msg}}</p>
						</v-slide-y-reverse-transition>
						</v-container>
					</v-card>
				</v-layout>

				<v-layout justify-end v-show='Chatdata.length -1 === index?true:false'>
					<v-icon class='caption' v-show='status'>done_all</v-icon>
					<!-- <v-icon class='caption' v-show='status'>done_all</v-icon> -->
				</v-layout>
			</div>

			<!-- loop ends here -->
		</template>



		<v-container v-show='isNew'>
				<blockquote class='display-2'>start your conversation with <strong>"{{activeUser.name}}"</strong></blockquote>
		</v-container>
	</v-flex>
	</div>
</template>
<script>
import axios from 'axios'
import {bus} from '../../main'
	export default{
		props:['chat','activeUser'],
		data(){
			return{
				Chatdata:[],
				status:false,
				loading:false,
				timeNow:0,
				lastClicked:0,
				isNew:false
			}
		},
		sockets:{
		},
		watch:{
			"$route.params.id":function(){
				// this.$router.go({
				//     path: this.$router.path,
				//     query: {
				//         t: + new Date()
				//     }
				// })
				this.Chatdata = [];
				this.loading = true;
				this.featchData();
			},
			Chatdata:function(i){
				// if chat data is empty then run ths
				i === 0 ? this.isNew = true : this.isNew = false;
				const g = this.Chatdata;
				g.map((d , i) => {
					d.again = false;

					d.user === this.$store.getters.id?d.self = true:d.self = false;
					if(g.length === i + 1){
						g[i].again = false;
					}else{
						g[i].to === g[i+1].to?(g[i].again=true):g[i].again=false;
					}

				})
			}
		},
		methods:{
			featchData(){
				axios.get(`${this.$store.state.server}chat/get/${this.$store.getters.id}+${this.$route.params.id}`,this.$store.getters.auth).then(r=>{
				r.data.length === 0 ? this.isNew = true : this.isNew = false;
				setTimeout(()=> {
				this.loading = false;
				},500)
				console.log('loading',this.loading)
				const g = r.data;
				r.data.map((d , i) => {
					d.again = false;
					d.user === this.$store.getters.id?d.self = true:d.self = false;

					// r.data.length  === i + 1?r.data[i - 1].to === r.data[i]?r.data[i].again = true:r.data[i].again = false?r.data[i + 1].to === r.data[i].to?r.data[i].again = true :r.data[i].again = false;

					// it was a mirical?? showing user icon posisition 😱
					if(g.length === i + 1){
						// g[i].to === g[i -1].to?g[i].again=true:g[i].again=false;
						g[i].again = false;
					}else{
						g[i].to === g[i+1].to?(g[i].again=true):g[i].again=false;
					}

				})
				this.Chatdata = r.data;
				console.log(this.Chatdata)
			}).catch(e =>{
				console.log(e);
			})
			},
			formatTime(time){
				const d = new Date(time)
  				return d.toLocaleString()
			},
			diffrence(i){

			}
		},
		mounted(){
			
		},
		created(){
			this.loading = true;
			this.featchData();
			console.log('mounted')
			// push wiritten msg
			bus.$on('newMsg',d=>{
				d.user === this.$store.getters.id?d.self = true:d.self = false;
				this.Chatdata.push(d);
				console.log(d);
				this.status = false;
			})

			// responce from server
			bus.$on('successMsg',d=>{
				this.status = true;
			})
		},
		beforeUpdate(){
			
			console.log('bf',this.loading);
		},
		updated(){

		}
	}
</script>

<style scoped>
.center{
	margin: auto;
}

.max{
	max-width: 75%;
	border-radius: 5px;
	margin-top: 2px;
}

.wraper{

}

.space{
	margin-top: 2px;
}




.circal{

    background-repeat: no-repeat;
    background-position: 50%;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    margin-right: 10px;

}
</style>