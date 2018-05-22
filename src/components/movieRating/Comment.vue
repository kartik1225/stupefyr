<template>

	<div>

		<v-card v-show='loaded'>

			<div v-show='no_cmts'>
				<v-container>
					<p class="title grey--text text-xs-center">No comments, Write one!</p>
				</v-container>
			</div>

			<div v-show='!no_cmts' >
			<v-divider></v-divider>
			<v-layout class='grey lighten-4' v-show='showFilters'>
				<v-btn block small flat :class='latest_select?`green--text`:`grey--text`' @click='filterCommnet("latest")'>latest</v-btn>
				<v-btn block small flat :class='reply_select?`green--text`:`grey--text`' @click='filterCommnet("most_replyed")'>most replyed</v-btn>
				<v-btn block small flat :class='likes_select?`green--text`:`grey--text`' @click='filterCommnet("most_liked")'>most liked</v-btn>
			</v-layout>

			<v-layout v-show='!showFilters' class='grey'>
				<v-btn flat small block class='white--text' @click='showFiltersFunc'>
					show all comments
				</v-btn>
			</v-layout>
			<v-divider></v-divider>



				<v-container v-show='cmt_loading'>
					<v-layout justify-center>
							<v-progress-circular indeterminate v-bind:size="50" color="primary"></v-progress-circular>
					</v-layout>
				</v-container>



			<template v-for='(cmt,i) in cmts' v-show='!cmt_loading'>
				<div :id='`wrap_${cmt._id}`' v-if='!cmt.deleted'>
					<v-container grid-list-lg>
						<v-layout style='position:relative;'>
							<v-avatar size='36px'>
								<img class="grey lighten-4" src='/static/default-profile.png'>
							</v-avatar>
							<div style='margin-left:5px; margin-top:1px; width:100%;'>


									<div style='position:absolute; right:0;'>
										<v-menu offset-y>
										      <v-btn small slot="activator" icon>
										      	<v-icon style='font-size:18px;'>more_vert</v-icon>
										      </v-btn>


										      <!--if your post -->
										      <v-list v-show='cmt.user._id === $store.getters.id'>
										        <!-- edit action -->
										        <v-list-tile @click='commnetEdit(cmt)'>
										          <v-icon>edit</v-icon>
										          <v-list-tile-title>edit</v-list-tile-title>
										        </v-list-tile>

										        <!-- delete post -->
										        <v-list-tile @click='commentDelete(`parent`,i)'>
										          <v-icon>delete</v-icon>
										          <v-list-tile-title>delete</v-list-tile-title>
										        </v-list-tile>
										      </v-list>

										      <!-- if other post -->
										      <v-list v-show='cmt.user._id !== $store.getters.id'>
										        <v-list-tile>
										          <v-icon>flag</v-icon>
										          <v-list-tile-title>report this post!</v-list-tile-title>
										        </v-list-tile>
										      </v-list>


										</v-menu>
									</div>

									<span class='body-2 '  style="width:calc(100% - 25px);" >{{cmt.user.userName}} </span> 
								<br>
								<span class="body-1">{{cmt.comment}}</span> <br>
								<!-- likes count -->
								<span :class="`caption ${cmt.liked?`green`:`grey`}--text`">{{cmt.likes.length}}</span>
								<span  :class="`caption ${cmt.liked?`green`:`grey`}--text`"  role='button' @click='sendLike(cmt)'>like</span>
								<span style="margin-left:20px;" class="caption grey--text" role='button' @click='cmt.cmt_disp = !cmt.cmt_disp'>reply</span>
								<span style="margin-left:20px;" class="caption grey--text">this time ago...</span>

								<!-- if reply -->
								<div style=" position:relative; width:100%; margin-top:5px;">

									<v-text-field	v-show='cmt.cmt_disp'
												  :id='`cmt_${cmt._id}`'
									              class="input-group--focused"
									              single-line
									              append-icon='send'
									              :value='temp'
									              @input='value => {temp = ``}'
									              :label="`replay to ${cmt.user.userName}`"
									              :append-icon-cb='()=>{sendReply(cmt)}'
									              @keyup.enter='()=>{sendReply(cmt)}'
									              :loading='cmt_sending'
									></v-text-field>
									<!-- parent cmt replys intrations -->
									<template v-for='(rep,ind) in cmt.replys'>

										<v-layout :id='`wrap_${rep._id}`' v-if='!rep.deleted'>

											<v-avatar size='36px'>
												<img class="grey lighten-4" src='/static/default-profile.png'>
											</v-avatar>
											<div style='margin-left:5px; margin-top:1px; width:100%; margin-right:8px;'>
													<div style='position:absolute; right:0;'>
														<v-menu offset-y>
														      <v-btn  small slot="activator" icon>
														      	<v-icon style='font-size:18px;'>more_vert</v-icon>
														      </v-btn>


														      <!--if your post -->
														      <v-list v-show='rep.user._id === $store.getters.id'>
														        <!-- edit action -->
														        <v-list-tile @click='commnetEdit(rep)'>
														          <v-icon>edit</v-icon>
														          <v-list-tile-title>edit</v-list-tile-title>
														        </v-list-tile>

														        <!-- delete post -->
														        <v-list-tile @click='commentDelete(`child`,i,ind)'>
														          <v-icon>delete</v-icon>
														          <v-list-tile-title>delete</v-list-tile-title>
														        </v-list-tile>
														      </v-list>

														      <!-- if other post -->
														      <v-list v-show='rep.user._id !== $store.getters.id'>
														        <v-list-tile>
														          <v-icon>flag</v-icon>
														          <v-list-tile-title>report this post!</v-list-tile-title>
														        </v-list-tile>
														      </v-list>


														</v-menu>
													</div>

													<span class="body-2">{{rep.user.userName}}</span>
													<!-- show if child comment reply -->
													<span v-show='rep.user._id !== rep.replyedTo._id'>

														<v-icon style='margin:auto; font-size:14px;'>play_arrow</v-icon>
														<span class="body-2">{{rep.replyedTo.userName}}</span>
													</span>

												<br>

												<!-- commet -->
												<span class="body-1">{{rep.comment}}</span> 
												<br>
												<span :class="`caption ${rep.liked?`green`:`grey`}--text`">{{rep.likes.length}}</span>
												<span  :class="`caption ${rep.liked?`green`:`grey`}--text`" role='button' @click='sendLike(rep)'>like</span>
												<span style="margin-left:20px;" class="caption grey--text" role='button' @click='rep.cmt_disp = !rep.cmt_disp'>reply</span>


												<span style="margin-left:20px;" class="caption grey--text">this time ago...</span>

												<v-text-field v-show='rep.cmt_disp'
															  :id='`cmt_${rep._id}`'
												              class="input-group--focused"
												              single-line
												              append-icon='send'
												              :value='temp'
												              @input='value => {temp = ""}'
												              :label="`replay to ${rep.user.userName}`"
												              :append-icon-cb='()=>{sendCommetReply(rep,cmt)}'
												              @keyup.enter='()=>{sendCommetReply(rep,cmt)}'
												              :loading='rep_sending'
												></v-text-field>

											</div>

										</v-layout>

										<!-- if comment is deleted -->

										<v-layout class='grey lighten-4' v-if='rep.deleted'>

											<v-container grid-list-sm>
												<p class="subheading text-xs-center grey--text" style='margin:auto'>comment has been deleted</p>
											</v-container>
										</v-layout>

									</template>

									<div v-if='cmt.replys.length >= 3'>
										<v-btn block flat @click='loadMoreReplys(cmt)' :disabled='cmt.more_rep' :loading='cmt.loading' >{{cmt.more_rep?`no more replys to load`:`show more replys`}}</v-btn>
									</div>

								</div>	
							</div>
						</v-layout>
					</v-container>
				</div>

				<v-layout class='grey lighten-4' v-if='cmt.deleted'>
					<v-container grid-list-sm>
						<p class="subheading text-xs-center grey--text" style='margin:auto'>comment has been deleted</p>
					</v-container>
				</v-layout>


			</template>

			<div v-if='cmts.length >= 5'>
				<v-btn block falt @click='loadMoreCmt' :disabled='more_cmts' :loading='more_cmts_loading'>{{more_cmts?`no more comments to load`:`load more comments...`}}</v-btn>
			</div>
		</div>

		<v-dialog v-model='edit_pop' max-width='400px'>
			<v-card  class='grey lighten-4' style='position:relative'>


				<!-- cancel btn -->
					<div style="position:absolute; right:0;">
						<v-btn icon small dark @click='wran_pop = true'>
							<v-icon small>clear</v-icon>
						</v-btn>	
					</div>

				<!-- title -->
				<v-container grid-list-md class='grey darken-3 white--text' >
				<p class="subheading" style="margin:auto">edit comment</p>
				</v-container>

				<v-divider></v-divider>

				<!-- input feald -->
				<v-text-field
				  v-model='edit_inp'
				  placeholder='edit your comment here...'
				  counter
				  max="120"
				  full-width
				  multi-line
				  single-line
				  hide-details
				></v-text-field>

				<v-layout>
					<v-spacer></v-spacer>
					<v-btn flat error small @click='wran_pop = true'> cancel </v-btn>
					<v-btn :dark='edit_inp !== ``' class='grey darken-3' small @click='putCmtEdit' :loading='ed_loading' :disabled='edit_inp === `` '>done</v-btn>
				</v-layout>


				<v-dialog v-model='wran_pop' max-width='250px'>
					<v-card>
						<div>
							<v-container >
								<p style="margin:auto" class="subheading text-xs-center"> All changes will be removed</p>
							</v-container>

							<v-divider></v-divider>
							<v-layout>

								<v-btn block flat @click='wran_pop = false'>
									keep
								</v-btn>

								<v-btn block flat error @click='(wran_pop = false,edit_pop = false)'>
									remove
								</v-btn>

							</v-layout>
						</div>
					</v-card>
				</v-dialog>


			</v-card>
		</v-dialog >


		<v-dialog v-model='delete_pop' max-width='250px'>
			<v-card>
				<v-container>
					<p class='subheading text-xs-center' style="margin:auto;">Are you sure do you want to <strong>Delete</strong> this commetnt?</p>
					<p class="caption text-xs-center grey--text" style="margin:auto;">this precess can't be reversed</p>
				</v-container>
				<v-divider></v-divider>
				<v-layout>
					<v-btn flat block @click='delete_pop = false'>
						keep
					</v-btn>

					<v-btn error block flat @click='confermDelete'>
						delete
					</v-btn>
				</v-layout>
			</v-card>
		</v-dialog>
		</v-card>
	</div>
	
</template>

<script>
	export default {
		props:['post'],
		components:{

		},
		data(){
			return{
				cmts:[],
				temp:"",
				// sort 
				latest_select:true,
				likes_select:false,
				reply_select:false,
				type:'latest',

				// laod more stuffs..
				more_cmts:false,
				skip:0,

				//edit box
				edit_pop:false,
				wran_pop:false,
				delete_pop:false,
				edit_inp:'',
				cr_edit:null,
				cr_delete:{
					index:null,
					type:null,
					c_index:null
				},
				ed_loading:false,
				// process 
				cmt_sending:false,
				rep_sending:false,
				cmt_loading:false,
				more_cmts_loading:false,
				no_cmts:false,
				loaded:false,

				// filter visivility
				showFilters:true
			}
		},
		methods:{
			// parent comment reply
			sendReply(cmt){
				let data = {
					user:this.$store.getters.id,
					post:cmt._id,
					replyedTo:cmt.user._id,
					comment:this.$el.querySelector(`#cmt_${cmt._id}`).value,
					reply:false
				}

				this.cmt_sending = true;

				this.$axios.post(`${this.$store.state.server}movie/commentreply`,data,this.$store.getters.auth).then(r=>{
					this.cmt_sending = false;
					if(r.data.error){
						this.$store.commit('sn',{snac:r.data.error});
					}else{

						let trackId = `#wrap_${r.data._id}`

						
						cmt.replys.unshift(r.data);

						setTimeout(()=>{

							this.$inView(this.$el.querySelector(trackId));

						},500)

						this.temp = null;
						this.temp = '';
						cmt.cmt_disp = false;

					}

				}).catch(e=>{
					this.cmt_sending = false;
					
					console.log(e);
				})

				console.log(data);
			},
			// child  comment reply
			sendCommetReply(cmt,par){
				let data = {
					user:this.$store.getters.id,
					post:par._id,
					replyedTo:cmt.user._id,
					comment:this.$el.querySelector(`#cmt_${cmt._id}`).value,
					parent:cmt._id,
					reply:true
				}


				console.log(data);

				this.rep_sending = true;

				console.log(this.$el.querySelector(`#cmt_${cmt._id}`).value);
				this.$axios.post(`${this.$store.state.server}movie/commentreplychild`,data,this.$store.getters.auth).then(r=>{

					this.rep_sending = false;
					if(r.data.error){

						this.$store.commit('sn',{snac:r.data.error});

					}else{


						par.replys.push(r.data);

						let trackId = `#wrap_${r.data._id}`

						
						cmt.replys.unshift(r.data);

						setTimeout(()=>{

							this.$inView(this.$el.querySelector(trackId));

						},500)


						this.temp = null;
						cmt.cmt_disp = false;

					}

				}).catch(e=>{
					this.rep_sending = false;

					console.log(e);
				})


			},
			sendLike(cmt){
				const data = {
					user:this.$store.getters.id,
					post:cmt._id,
					type:'movie_post'
				}

				// mocking like
				cmt.liked?cmt.liked = false:cmt.liked = true;

				this.$axios.post(`${this.$store.state.server}movie/commentlike`,data,this.$store.getters.auth).then(r=>{

					if(r.data.error){
						this.$store.commit('sn',{context:'error',snac:r.data.error})
					}else if(r.data.liked){
						// like

						this.$store.commit('sn',{snac:'comment liked'})
						cmt.likes.push(r.data.data);
						cmt.liked = true;
					}else {
						this.$store.commit('sn',{snac:'comment disliked'})
						const ix = cmt.likes.findIndex(i => i.user === r.data.data.user);
						cmt.likes.splice(ix,1);
						cmt.liked = false;
					}
					console.log(r.data);
				}).catch(e=>{
					console.log(e);
				})
			},
			commnetEdit(cmt){


				this.edit_inp = cmt.comment;
				this.edit_pop = true;
				this.cr_edit = cmt;


			},
			putCmtEdit(){

				if(this.$store.getters.id === this.cr_edit.user._id){

					this.cr_edit.comment = this.edit_inp;
					this.cr_edit.cuser = this.$store.getters.id;
					this.ed_loading = true;

					this.$axios.put(`${this.$store.state.server}movie/newcomment`,this.cr_edit,this.$store.getters.auth).then(r=>{

						this.ed_loading = false;

						if(r.data.done){
							this.$store.commit('sn',{snac:'Comment updated.'});

							this.$inView(this.$el.querySelector(`#wrap_${this.cr_edit._id}`));

							this.edit_pop = false;	
						}

						if(r.data.error){
							this.$store.commit('sn',{context:'error',snac:r.data.error});
						}	

					}).catch(e=>{
						console.log(e);
						this.$store.commit('sn',{context:'error',snac:'server error'});
					})

				}else{
					this.$store.commit('sn',{context:'error',snac:'you can not edit this comment.'});
				}
			},
			commentDelete(type,index,pi){

				this.cr_delete.index = index;
				this.cr_delete.type = type;
				this.cr_delete.c_index = pi;

				this.delete_pop = true;
				
			},		

			confermDelete(){

				if(this.cr_delete.type === 'parent'){

					this.$axios.delete(`${this.$store.state.server}movie/deletecmt/${this.cmts[this.cr_delete.index]._id}+${this.$store.getters.id}`,this.$store.getters.auth).then(r=>{
						if(r.data.error){
							this.$store.commit('sn',{context:'error',snac:r.data.error});
						}else{
						    this.$set(this.cmts, this.cr_delete.index, {deleted:true})

							this.$store.commit('sn',{snac:'comment deleted.'})
						}
							console.log(r.data);
					}).catch(e=>{
						this.$store.commit('sn',{context:'error',snac:'server error.'});
						console.log(e);
					})

				}else{
						

					this.$axios.delete(`${this.$store.state.server}movie/deletecmt/${this.cmts[this.cr_delete.index].replys[this.cr_delete.c_index]._id}+${this.$store.getters.id}`,this.$store.getters.auth).then(r=>{
						if(r.data.error){
							this.$store.commit('sn',{context:'error',snac:r.data.error});
						}else{

							this.cmts[this.cr_delete.index].replys.splice(this.cr_delete.c_index,1,{deleted:true});
							this.$store.commit('sn',{snac:'comment deleted.'})
						}
							console.log(r.data);
					}).catch(e=>{
						this.$store.commit('sn',{context:'error',snac:'server error.'});
						console.log(e);
					})

				}

				this.delete_pop = false;
			},
			loadMoreReplys(cmt){

				cmt.loading = true;

				this.$axios.get(`${this.$store.state.server}movie/morerep/${cmt._id}+${cmt.replys.length}`,this.$store.getters.auth).then(r=>{
					
					cmt.loading = false;


					if(r.data.warn){
						this.$store.commit('sn',{snac:r.data.warn})
						cmt.more_rep = true;
					}else{

						cmt.more_rep = r.data.length < 5;
						console.log(r.data.length > 4);
						// got more replys
						r.data.map(d=>{
							// validating likes 
							d.likes.map(l => {
								l.user === this.$store.getters.id?d.liked = true:null;
							})	

							cmt.replys.push(d);
						})


					}

				}).catch(e=>{
					console.log(e);
				})

			},
			loadMoreCmt(){
				this.fetchData();

				this.more_cmts_loading = true;

			},	
			filterCommnet(type){
				// highliting selected buttun
				type === 'latest'?(this.likes_select = false,this.reply_select = false, this.latest_select = true): null;
				type === 'most_liked'?(this.likes_select = true,this.reply_select = false, this.latest_select = false): null;
				type === 'most_replyed'?(this.likes_select = false,this.reply_select = true, this.latest_select = false): null;


				this.type = type;

				// console.log(type)
				this.fetchData(true);
			},
			showFiltersFunc(){
				this.showFilters = true;
				this.fetchData(true);
			},	
			fetchData(sort){

				sort?(this.cmts = [],this.cmt_loading = true, this.skip = 0):null;

				// for single post view
				let cid = this.$route.query.cid || null;
				sort?cid = null:null;
				cid?this.showFilters = false:null;


				this.$axios.get(`${this.$store.state.server}movie/sortcmt/${this.post._id}+${this.type}+${this.skip}+${cid}`,this.$store.getters.auth).then(r=>{


					this.cmt_loading = false;
					this.more_cmts_loading = false;

					this.$bus.$emit(`cmt_loaded`,true)

					if(r.data.warn){
						this.$store.commit('sn',{snac:r.data.warn})
						this.more_cmts = true;
					}else{

						r.data.comments.map(d=>{
							this.cmts.push(d);
						})


							// validating user likes
							this.cmts.map(d=>{
								d.likes.map(l=>{
									l.user === this.$store.getters.id?(d.liked = true):null;
								})

								// reply like
								d.replys.map(r=>{
									r.likes.map(rl=>{
										rl.user === this.$store.getters.id?(r.liked = true):null;
									})

								})

							})

					}


					// highliting cmt for single post view
					setTimeout(()=>{
						cid?this.$inView(this.$el.querySelector(`#wrap_${cid}`)):null;
					},500)

					this.loaded = true;

					this.skip = this.cmts.length;

					this.no_cmts = this.cmts.length === 0; 



				}).catch(e=>{
					console.log(e);
				})


			}
		},
		mounted(){
			this.fetchData();

			// on new cmt creation....
			this.$bus.$on(`movie_cmt_created`,r=>{
				if(this.post._id === r.post){

					this.loaded?this.cmts.unshift(r):null;
					this.$bus.$emit(`cmt_loaded`,true);
					// tracking new cmt..
					const trackId = '#wrap_' + r._id;
					setTimeout(()=>{

						this.$inView((this.$el.querySelector(trackId)))

					},500)

				}
			})
		}
	}
</script>

<style>

.ani{
	background: linear-gradient(282deg, #a1ffce, #faffd1);
	background-size: 400% 400%;
	transition-timing-function: ease;
}

	
</style>