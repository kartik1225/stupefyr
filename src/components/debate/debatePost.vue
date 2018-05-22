<template>

	<v-layout justify-center>
		<v-flex xs12>	

				<v-layout>
				<div v-for='img in pole.imgs'>
					<v-container grid-list-xs>
					<img style="width:100%;" :src='`${$store.state.server}picture/${img}`'>
					</v-container>
				</div>
				</v-layout>


					<!-- pole buttun -->
					<v-layout :column='imageLength !== 2' v-show='!resultShow'>

							<div :style="`width:100%`" v-for='(pole,i) in pole.poles'>
								<v-container :grid-list-xs='imageLength !== 2 || $vuetify.breakpoint.width < 600'>
									<v-btn :class='selected === i?`grey darken-4 white--text`:`grey lighten-1`' @click='poleSelected(pole,i)' large block>{{pole}}</v-btn>
								</v-container>	
							</div>

					</v-layout>


				<v-card v-show='resultShow'>
						<div class="black">
						<div class="amber" style="height:64px; width:80%">
							
						</div>
						</div>
				</v-card>


				<v-slide-y-transition>
					<v-card v-show='true' class='elevation-0'>
						<v-text-field
			                  :label="selected === null?`make a vote to write a commnet...`:`write reason or comment...`"
			                  single-line
			                  full-width
			                  hide-details
			                  class='elevation-0'
			                  append-icon='send'
			                  v-model='comment'
			                  @keyup.enter='submitComment'
			                  :append-icon-cb='submitComment'
			                  :disabled='selected === null'
						></v-text-field>
					</v-card>
				</v-slide-y-transition>


				 <div v-if='!poleCmtShow' v-show='post.poleShow' style="margin-bottom:-6px;">
				   <v-btn block flat @click='showCommentFunc' class='grey lighten-4'>
				      {{ `show commnets`}}

				   </v-btn>
				</div>
				
				<!-- loading line -->
				<v-progress-linear v-show='load_line' style='height:3px;margin-top: 0px;margin-bottom: 0px;' v-bind:indeterminate="true"></v-progress-linear>
				<div v-if='poleCmtShow'>
				<debateComment :post='post'></debateComment>
				</div>


		</v-flex>	
	</v-layout>

</template>

<script>
const debateComment = ()=> import('./debateComment');
export default {
	props:['post'],
	components:{
		debateComment
	},
	data(){
		return{
			//pole 
			pole:null,
			imageLength:0,
			selected:null,
			resultShow:false,
			poleCmtShow:false,
			//extre input stuff
			showInput:false,
			comment:'',
			load_line:false
		}
	},
	watch:{
		post(){
			this.fetchData();
		}
	},
	methods:{
		poleSelected(pole,i){
			this.showInput = true;
				// setTimeout(()=>{
				// 	this.resultShow = true;
				// },3000)
			let data = {
				userId:this.$store.getters.id,
				postId:this.post._id,
				vote:i
			}



				// moking fake pole submit

				this.selected = i;

				this.$axios.post(`${this.$store.state.server}debate/polevote`,data,this.$store.getters.auth).then(r=>{

					if(r.data.error){
						this.$store.commit('sn',{contest:'error',snac:r.data.error})
						this.selected = null;
						this.selected = r.data.pv.vote;
					}else{
						this.selected = i;
						this.$store.commit('sn',{snac:'vote has been recived!'})
					}

				}).catch(e=>{
					console.log(e);
				})





		},
		//sending commnet 
		submitComment(){

			const temp = this.comment;

			let data = {
				user:this.$store.getters.id,
				post:this.post._id,
				comment:temp,
				reply:false
			}

			this.poleCmtShow = true;
			this.load_line = true;
			this.comment = '';
			console.log(data);

			this.$axios.post(`${this.$store.state.server}debate/newcomment`,data,this.$store.getters.auth).then(r => {
				console.log(r.data)
				if(r.data.error){
					this.$store.commit('sn',{context:'error',snac:r.data.error})
				}else{
					
					this.$bus.$emit('debate_created',r.data)
				}
				this.comment = '';
			}).catch(e=>{
				this.$store.commit('sn',{context:'error',snac:'server error'});
				console.log(e);
			})
		},
		showCommentFunc(){
			this.poleCmtShow = !this.poleCmtShow;
			this.load_line= true;
		},
		fetchData(){
			let data 
			data = this.post.pole;

			this.$route.query.cid?this.showCommentFunc():null;

			this.imageLength !== null? this.imageLength = data.imgs.length:this.imageLength = 0;
			this.pole = data;

				// // getting previous voing data if exist!
				this.$axios.get(`${this.$store.state.server}debate/get/${this.$store.getters.id}+${this.post._id}`,this.$store.getters.auth).then(r=>{
					if(r.data){
					 	this.selected = r.data.vote;
					}


				}).catch(e=>{
					console.log(e)
				})
		}
	},
	created(){

		this.fetchData();

		this.$bus.$on('debate_cmt_trigr',p=>{
			// this.poleCmtShow = 

				setTimeout(()=>{
					if(this.post._id === p._id){
						this.poleCmtShow = false;
					}
				},500)
		})

		this.$bus.$on('debate_cmt_loaded',r=>{
			this.load_line = !r;
		})
	}
}
</script>

<style>
	
</style>