<template>

	<div style='width:100%'>
		<div v-show='loading'>
			<v-container>
				<v-layout justify-center>
					<v-progress-circular indeterminate :size="50" color="grey"></v-progress-circular>
				</v-layout>
			</v-container>
		</div>

		<div v-show='!loading'>
		<v-list v-show='nfData.length !== 0' two-line :style='$vuetify.breakpoint.width < 400?`width:${$vuetify.breakpoint.width}px`:`min-width:400px;`'>
			<v-subheader>{{$route.path === '/notifications'?`All Notification`:`Recent Notification`}}</v-subheader>
	        <template v-for="(item, index) in nfData">
	          <v-list-tile avatar >
	            <v-list-tile-avatar @click="$router.push(`/user/${item.owner}/post`)">
	              <img :src="`${$store.state.server}picture/${item.pp}?q=low`">
	            </v-list-tile-avatar>
	            <v-list-tile-content @click='$router.push(item.link)'>
	              <v-list-tile-title v-html="item.context"></v-list-tile-title>
	              <v-list-tile-sub-title ><timeago style='font-size:12px' class='grey--text':since='Date.parse(item.created)'></timeago></v-list-tile-sub-title>
	            </v-list-tile-content>
	          </v-list-tile>
	          <v-divider v-if='index +1 !== nfData.length'></v-divider>
	        </template>
		</v-list>
		<v-layout row wrap justify-center >
		<div  v-show='nfData.length === 0' :style='$vuetify.breakpoint.width < 400?`width:${$vuetify.breakpoint.width}px`:`width:400px;`'>
			
			<v-container style='width:100%' >
				<v-layout justify-center>
					<v-icon>notifications_none	</v-icon>
				</v-layout>
				<br>
				<p class='text-xs-center grey--text subheading'> You will see your all notifications here. </p>
			</v-container>
			  


		</div>
	</v-layout>
		<infinite-loading v-if='infEnable' @infinite="fetchData" loadbutton="once" force-use-infinite-wrapper='true' :distance='distance' ref="infiniteLoading">
		    <span slot="no-more">
		      Nothing more to show!
		    </span>
		  </infinite-loading>
		</div>
	</div>

</template>

<script>
import InfiniteLoading from 'vue-infinite-loading';

	export default{
		components:{
			InfiniteLoading
		},
		data(){
			return{
				nfData:[],
				distance:10000,
				infEnable:true,
				loading:false

			}
		},
		methods:{
			fetchData($state){
				this.distance = 3000;
				this.loading = true;

				this.$axios.get(`${this.$store.state.server}notify/new/${this.$store.getters.id}/${this.nfData.length}`,this.$store.getters.auth).then(r=>{
					console.log("notify data",r.data);
					this.loading = false;

					if(!r.data.error){

						r.data.map(d=>{
							this.nfData.push(d); 
						});

						const count = this.nfData.filter(d=> d.seen === false).length;

						console.log('count',count);

						this.$bus.$emit(`new_notifications_count`,count);
						$state.loaded();
					}else{
						$state.complete();
					}

					this.infEnable =  this.$route.path === '/notifications';

				}).catch(e=>{
					console.log(e);
				})
			}
		},
		created(){
		

			// for seen notifications
			this.$bus.$on(`seen_notificetions`,r=>{

				this.$axios.get(`${this.$store.state.server}notify/seen/${this.$store.getters.id}`,this.$store.getters.auth).then(r=>{
					console.log(r.data);
					this.nfData.map(d=>{
						d.seen = true;

					})
					this.$bus.$emit(`new_notifications_count`,0);

				}).catch(e=>{
					console.log(e);
				})

			})

			// for socket events
			 this.$bus.$on(`new_notifincation_socket`,r=>{

			 	this.nfData.unshift(r);

			 	const count = this.nfData.filter(d=> d.seen === false).length;
			 	this.$bus.$emit(`new_notifications_count`,count);


			 })
		}
	}
	
</script>

<style>
	
</style>