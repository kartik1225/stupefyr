<template>
<div>


<!-- if no comments -->

<div v-show='!load_line' v-if='comments.length <= 0'>
	<v-divider></v-divider>
	<br>
	<v-container>
		<v-layout justify-center>
			<p class="subheading grey--text">no comments so far!</p>
		</v-layout>
		<br>
	</v-container>
</div>


<div>
	<!-- loading line -->

	<div v-if='showComment'>
	<v-layout justify-center>
		<v-flex xs12>

				<v-divider></v-divider>
				<v-layout class='grey lighten-4' v-show='showFilters'>
					<v-btn block small flat :class='latest_select?`green--text`:`grey--text`' @click='filterCommnet("latest")'>latest</v-btn>
					<v-btn block small flat :class='reply_select?`green--text`:`grey--text`' @click='filterCommnet("most_replyed")'>most replyed</v-btn>
					<v-btn block small flat :class='likes_select?`green--text`:`grey--text`' @click='filterCommnet("most_liked")'>most liked</v-btn>
				</v-layout>

				<v-layout v-show='!showFilters' class='grey' >
					<v-btn flat block small class='white--text' @click='showFiltersFunc'>
						show all comments
					</v-btn>
				</v-layout>
				<v-divider></v-divider>

				<div v-show='cmt_loading'>
						<v-container>
					<v-layout justify-center>
							<v-progress-circular indeterminate v-bind:size="50" color="primary"></v-progress-circular>
					</v-layout>
						</v-container>
				</div>

				<div v-show='!cmt_loading' >
				
				<template v-for='(cmt,n) in comments'>

				<v-layout :id='`wrap_${cmt._id}`'>

					<!-- voting upvote and downvote section -->
					<div style="position:relative;" >

					<!-- like -->

					<v-btn icon small :class='cmt.liked?`green--text `:`grey--text`' @click='submitLike(cmt,n)'>
						<v-icon style='font-size:30px;'>arrow_drop_up</v-icon>
					</v-btn>

					<p style="margin:-10px !important;" class="text-xs-center"><strong>{{cmt.likes.length - cmt.dislikes.length}}</strong></p>

						<!-- dislike -->
						<div style="margin-top:-13px">
							<v-btn icon small :class='cmt.disliked?`red--text`:`grey--text`' @click='submitDislike(cmt,n)'>
								<v-icon style='font-size:30px;'>arrow_drop_down</v-icon>
							</v-btn>
						</div>
						
					</div>

					<!-- user name and commnet section -->
					<div style="width:100%">
						<v-layout>
							<!-- username -->
							<div style="margin-top:5px; width:calc(100% - 52px);">
								<span class='body-2'>{{cmt.user.userName}}</span>
							</div>



							<!-- dropdown menu -->
							<div style="right:5px;position:absolute">
								
								<v-menu offset-y>

								  <v-btn @click='' slot="activator" icon small style='height:25px;width:25px;'>
								  	<v-icon class='grey--text' style='font-size:18px'>more_vert</v-icon>
								  </v-btn>

								<!--if your post -->
								<v-list v-show='cmt.user._id === $store.getters.id'>
								  <!-- edit action -->
								  <v-list-tile @click='commnetEdit(cmt,n)'>
								    <v-icon>edit</v-icon>
								    <v-list-tile-title>edit</v-list-tile-title>
								  </v-list-tile>

								  <!-- delete post -->
								  <v-list-tile @click='commentDelete(cmt,n)'>
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

						</v-layout>



						<!-- opinion / commnet  -->
						<div style="margin-right:5px;">	
							<span class="body-1">{{cmt.comment}}</span>
						</div>


						<v-layout>
						<!-- replay btn -->
						<p role='button' style="font-size:10px;margin-top:5px; margin-right:20px;" class="grey--text" @click='cmt.reply_disp = !cmt.reply_disp'>replay</p>

						<!-- time ago -->
						<p style="font-size:10px;margin-top:5px; margin-right:5px;" class="grey--text text-xs-left"><timeago :since="Date.parse(cmt.created)" :auto-update="30"></timeago></p>

						</v-layout>


					
					

						<!-- replay input -->
						<v-container grid-list-xs >
						<div v-if='cmt.reply_disp' >
							<v-text-field
										:id='"cmt"+n'
										:value='temp'
										@input='value => {temp = ""}'
							            name="input-1-3"
							            :label="`replay to ${cmt.user.userName}`"
							            single-line
							            append-icon='send'
							            @keyup.enter='()=>{cmtReply(cmt,n),cmt.reply_disp = !cmt.reply_disp}'
							            :append-icon-cb='()=>{cmtReply(cmt,n),cmt.reply_disp = !cmt.reply_disp}'
							></v-text-field>
						</div>
						</v-container>


						<template v-for='(rep,index) in  cmt.replys'>
							<!-- comment replay -->
							<div :id='`wrap_${rep._id}`' style='margin-right:5px; ' v-show='true'>
								<v-layout style='margin-right:20px;width:calc(100% - 40px)'>
									<v-icon style='font-size:18px;' class='icon-flipped'>keyboard_return</v-icon> &nbsp
									<span class="body-2">{{rep.user.userName}}</span>


									<!-- if replayed to post user then false if another user then true  nestd -->
									<div v-if='rep.replyedTo'>
									<v-icon  style='font-size:14px;'>play_arrow</v-icon>
										<span class="body-2">{{rep.replyedTo.userName}}</span>
									</div>

									<div style="right:5px;position:absolute;margin-top: -9px;">

									<v-menu offset-y>

									  <v-btn @click='' slot="activator" icon small style='height:25px;width:25px;'>
									  	<v-icon class='grey--text' style='font-size:18px'>more_vert</v-icon>
									  </v-btn>

									<!--if your post -->
									<v-list v-show='rep.user._id === $store.getters.id'>
									  <!-- edit action -->
									  <v-list-tile @click='commnetEdit(rep,index,n)'>
									    <v-icon>edit</v-icon>
									    <v-list-tile-title>edit</v-list-tile-title>
									  </v-list-tile>

									  <!-- delete post -->
									  <v-list-tile @click='commentDelete(rep,index,cmt,n)'>
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



								</v-layout>

								<div style="margin-left:20px; width:100%;" class="blue">
								</div>
								<div style="margin-left:22px;">
								<!-- user reply -->	
								<span class="body-1">{{rep.comment}}</span>


								<v-layout>

									<!-- like count -->
									<span class="caption grey--text">{{rep.likes.length}}</span> &nbsp
									<!-- like btn-->
									<span :class="rep.liked?`green--text caption`:`grey--text caption`" role='button' @click='likeReply(rep,index,n)'>like</span>

									<!-- replybtn -->
									<span class="grey--text caption" style='margin-left:20px' role='button' @click='rep.reply_disp = !rep.reply_disp'>replay</span>

									<!-- time ago... -->
									<span class="grey--text caption" style='margin-left:20px' ><timeago :since="Date.parse(rep.created)" :auto-update="30"></timeago></span>
								</v-layout>

								<!-- user reply input -->

								<v-container grid-list-xs >
								<div v-if='rep.reply_disp' >
									<v-text-field
												:id='"cmt_reply"+index'
												:value='temp'
												@input='value => {temp = ""}'
									            name="input-1-3"
									            :label="`replay to ${rep.user.userName}`"
									            single-line
									            append-icon='send'
									            @keyup.enter='()=>{commentReplyToUser(rep,index,n) ,rep.reply_disp = !rep.reply_disp}'
									            :append-icon-cb='()=>{commentReplyToUser(rep,index,n),rep.reply_disp = !rep.reply_disp}'
									></v-text-field>
								</div>
								</v-container>
								</div>

							</div>
						</template>


						<div v-show=' cmt.show_more || cmt.replys.length >= 3'>
						<v-container v-show='!cmt.show_more'>
							<v-layout justify-center> 
								<span>nothing more to show </span>
								<v-icon style='font-size:18px;'>error_outline</v-icon>
							</v-layout>							
						</v-container>

						<!-- load more commnets btn -->
						<v-container v-show='cmt.show_more' :loading='reply_load' grid-list-xs @click='lodeMoreReplys(cmt,n)'>
							<v-btn flat block>
								show more replys
							</v-btn>
						</v-container>
						</div>
					</div>

				</v-layout>
				<v-divider v-if='comments.length - 1 !== n'></v-divider>
			</template>

			</div>




			<div v-show='more_btn_show || comments.length >= 5'>
			<!-- if no commet  -->
			<v-container v-show='!more_btn_show'>
				<v-layout justify-center>
				<p class="body-1 grey--text text-xs-center">No more commets to load</p>
				&nbsp
				<v-icon style='font-size:18px;'>error_outline</v-icon>
				</v-layout>
			</v-container>

			<!-- show more comments -->
			<v-container grid-list-sm v-show='more_btn_show'>
			 <v-layout>
			   <v-btn block flat  :loading='more_btn_loading' @click='lodeMore'>
			     <v-icon>keyboard_arrow_down</v-icon>
			   </v-btn>
			 </v-layout>
			</v-container>
			</div>

		</v-flex>	
	</v-layout>

		<div v-if='editBox'>
		<v-dialog v-model='editBox'>
			<v-card>
				<v-card-text>
				              <v-text-field
				                textarea
				                v-model='editedInp'
				                @key-up.enter='commnetEditPost'
				              ></v-text-field>
				        <v-layout>
				        	<v-spacer></v-spacer>
				        	<v-btn outline :loading='edit_load'@click='commnetEditPost' >done</v-btn>
				        </v-layout>
				</v-card-text>
			</v-card>
		</v-dialog>
		</div>
	</div>
</div>
</div>
</template>

<script>

export default {
	props:['post'],
	components:{

	},
	data(){
		return{
			showComment:false,
			comments:[],
			liked:false,
			disliked:false,
			skip:0,
			// show more comment
			more_btn_loading:false,
			more_btn_show:true,
			// replay
			temp:'',
			somthing:'',
			skip_replys:3,
			reply_load:false,
			reply_more_show:false,
			// selects
			latest_select:true,
			likes_select:false,
			reply_select:false,
			type:'latest',
			cmt_loading:false,
			// edit and delete
			editBox:false,
			mypost:true,
			crData:null,
			editedInp:'',
			edit_load:false,
			load_line:false,
			showFilters:true
		}	
	},
	methods:{

		// post like
		submitLike(i,index){
			// pre replicating behaviour of like / dislikes
			this.comments[index].liked?(this.comments[index].liked = false , this.comments[index].disliked = false):(this.comments[index].liked = true , this.comments[index].disliked = false);


			let data = {
				user:this.$store.getters.id,
				post:i._id,
				type:'debate_cmt'
			}
			// for cmt like requrest
			this.$axios.post(`${this.$store.state.server}debate/cmtlike`,data,this.$store.getters.auth).then(r=>{
				console.log('look',r.data)
				if(r.data.previous){

					// removig like if exist
					const dislike_index = this.comments[index].dislikes.findIndex(i => i._id === r.data.previous._id);
					this.comments[index].dislikes.splice(dislike_index,1);
					console.log(dislike_index,this.comments[index].dislikes,r.data.previous._id)

					this.comments[index].disliked = false;
				}

				// update commnets with newlike
				if(r.data.like){
					this.comments[index].likes.push(r.data.data)

					this.comments[index].liked = true;

					this.$store.commit('sn',{snac:'upvote has been submited'})
				}else{

					// findeing and removig like from like array
					const ix = this.comments[index].likes.findIndex(i => i._id === r.data.data._id);
					this.comments[index].likes.splice(ix,1)

					this.comments[index].liked = false;
					this.$store.commit('sn',{snac:'upvote has been removed'})
				}
			}).catch(e=>{
				console.log(e);
				this.$store.commit('sn',{context:'error',snac:'server error'});
			})
		},

		// post dislike
		submitDislike(i,index){
			// pre replicating behaviour of like / dislikes
			this.comments[index].disliked?(this.comments[index].liked = false , this.comments[index].disliked = false):(this.comments[index].liked = false , this.comments[index].disliked = true);



			let data = {
				user:this.$store.getters.id,
				post:i._id,
				type:'debate_cmt'
			}

			// for cmt dislike requrest
			this.$axios.post(`${this.$store.state.server}debate/cmtdislike`,data,this.$store.getters.auth).then(r=>{
				console.log('look',r.data)
				if(r.data.previous){
					// removig like if exist
					const like_index = this.comments[index].likes.findIndex(i => i._id === r.data.previous._id);
					this.comments[index].likes.splice(like_index,1);

					this.comments[index].liked = false;
				}


				if(r.data.dislike){
					this.comments[index].dislikes.push(r.data.data);

					this.comments[index].disliked = true;

					this.$store.commit('sn',{snac:'downvote has been submited'})
				}else{
					const ix = this.comments[index].dislikes.findIndex(i => i._id === r.data.data._id);
					this.comments[index].dislikes.splice(ix,1)

					this.comments[index].disliked = false;
					this.$store.commit('sn',{snac:'downvote has been removed'})
				}

				console.log(this.comments[index]);
			}).catch(e=>{
				console.log(e);
				this.$store.commit('sn',{context:'error',snac:'server error'});
			})

		},

		// get more comments
		lodeMore(){
			this.skip += 5;
			this.fetchData();
		},

		// cmt replay functions
		cmtReply(i,index){

			const data = {
				user:this.$store.getters.id,
				post:i._id,
				reply:true,
				comment:this.$el.querySelector('#cmt'+index).value
			}

			this.$axios.post(`${this.$store.state.server}debate/newcomment_reply`,data,this.$store.getters.auth).then(r=>{
				console.log(r.data)

				if(r.data.error){
					this.$store.commit('sn',{context:'error',snac:r.data.error})
				}else{
				this.$store.commit('sn',{snac:'commnet has been posted'});
				this.comments[index].replys.push(r.data)
				this.comments[index].skip_replys = 3;

				}

				const trackId = '#wrap_' + r.data._id;

				// highlighting
				setTimeout(()=>{

					// prevent this on safari...
					if(window.safari === undefined){
						this.$el.querySelector(trackId).scrollIntoView({behavior: "smooth", block: "center"});
					}

						this.$el.querySelector(trackId).classList.add("ani");
					setTimeout(()=>{
						this.$el.querySelector(trackId).classList.remove("ani");
					},5000)
				},500)




			}).catch(e=>{
				console.log(e)
				this.$store.commit('sn',{context:'error',snac:'server error'})
			})
			// cool
        	this.temp=null;
		},


		// replay to user from commmets
		commentReplyToUser(i,index,p_index){
			const data = {
				user:this.$store.getters.id,
				post:i._id,
				replay:true,
				comment:this.$el.querySelector('#cmt_reply'+index).value,
				replyedTo:i.user._id
			}

			console.log(data)
			this.$axios.post(`${this.$store.state.server}debate/newcomment_reply`,data,this.$store.getters.auth).then(r=>{
				console.log(r.data)
				if(r.data.error){
					this.$store.commit('sn',{context:error,snac:r.data.error})
				}else{
					this.$store.commit('sn',{snac:'commnet has been posted'});
					this.comments[p_index].replys.push(r.data)



					const trackId = '#wrap_' + r.data._id;

					// highlighting
					setTimeout(()=>{

						// prevent this on safari...
						if(window.safari === undefined){

							this.$el.querySelector(trackId).scrollIntoView({behavior: "smooth", block: "center"});
							
						}

							this.$el.querySelector(trackId).classList.add("ani");
						setTimeout(()=>{
							this.$el.querySelector(trackId).classList.remove("ani");
						},5000)
					},500)


				}	
			}).catch(e=>{
				console.log(e)
				this.$store.commit('sn',{context:'error',snac:'server error'})
			})


			this.temp = null;


		},

		// load more replys...
		lodeMoreReplys(i,index){

			this.reply_load = true;

			this.$axios.get(`${this.$store.state.server}debate/moreReplys/${i._id}+${this.comments[index].skip_replys}`,this.$store.getters.auth).then(r=>{

 

				r.data.replys.length === 10?this.comments[index].show_more = true :this.comments[index].show_more = false;


				console.log(r.data);
				this.reply_load = false;

				// pushing reply DATA
				r.data.replys.map(d=>{
					this.comments[index].replys.push(d);
				})


				this.comments[index].skip_replys += 10;
			}).catch(e=>{
				console.log(e);
				this.$store.commit('sn',{context:'error',snac:'server error'});
			})	



		},

		// post reply like
		likeReply(i,index,p_index){

			let data = {
				user:this.$store.getters.id,
				post:i._id,
				type:'debate_cmt'
			}

			this.comments[p_index].replys[index].liked?this.comments[p_index].replys[index].liked = false:this.comments[p_index].replys[index].liked = true;

			// for cmt like requrest
			this.$axios.post(`${this.$store.state.server}debate/cmtlike`,data,this.$store.getters.auth).then(r=>{
				// update commnets with newlike
				console.log(r.data)
				if(r.data.like){
					this.comments[p_index].replys[index].likes.push(r.data.data)
					this.comments[p_index].replys[index].liked = true;

					this.$store.commit('sn',{snac:'comment liked'})

				}else{
					const ix = this.comments[p_index].replys[index].likes.findIndex(i => i._id === r.data.data._id);
					this.comments[p_index].replys[index].likes.splice(ix,1)
					this.comments[p_index].replys[index].liked = false;
					this.$store.commit('sn',{snac:'comment disliked'})
				}



			}).catch(e=>{
				console.log(e);
				this.$store.commit('sn',{context:'error',snac:'server error'});
			})


		},

		// edit commnet edit 
		commnetEdit(i,index,p_index){

			// activating dialog
			this.editBox = true;
			this.crData = i;
			p_index? (this.crData.index = {p:p_index,c:index} , this.crData.type = 'child') : (this.crData.index = index , this.crData.type = 'parent');
			this.editedInp = i.comment;

		},

		// post edited data
		commnetEditPost(){

			if(this.crData.user._id === this.$store.getters.id){

			// getting currennt value
			this.crData.comment = this.editedInp;

			// sending current user id
			this.crData.cUser = this.$store.getters.id;	

			this.edit_load = true;

			this.$axios.put(`${this.$store.state.server}debate/newcomment`,this.crData,this.$store.getters.auth).then(r=>{

				if(r.data.error){
					this.$store.commit('sn',{context:'error',snac:r.data.error})
				}else{
					this.edit_load = false;
					this.$store.commit('sn',{snac:'comment has been updated!'})
					this.editBox = false;
				}
			}).catch(e=>{
				console.log(e);
				this.$store.commit('sn',{context:'error',snac:'server error'});
			})

		}else{
			this.$store.commit('sn',{context:'error',snac:'you can\'t edit this post!'})
		}
		},

		// deleting commnet 
		commentDelete(i,index,cmt,p_index){

			if(i.user._id === this.$store.getters.id){

				if (confirm('Are you sure you want to delete this comment?')) {
					this.$axios.delete(`${this.$store.state.server}debate/deletecmt/${i._id}+${this.$store.getters.id}`,this.$store.getters.auth).then(r=>{
						console.log(r.data)
						if(r.data.error){
							this.$store.commit('sn',{context:'error',snac:r.data.error});
						}else if(r.data.type === 'cmt'){
							// for cmt 
							this.comments.splice(index,1);
							this.$store.commit('sn',{snac:'comment has been deleted'});

						} else if(r.data.type === 'rep'){
							// show more 

							cmt.replys.length >= 3?cmt.show_more = true:null;
							console.log(cmt.replys.length >= 3)
							// for rep
							cmt.replys.splice(index,1);
							this.$store.commit('sn',{snac:'reply comment has been deleted'});
						}
					}).catch(e=>{
						console.log(e);
						this.$store.commit('sn',{context:'error',snac:'server error'});
					})
				}else{
					this.$store.commit('sn',{snac:'comment is still there'});
				}
			
			} else {
				this.$store.commit('sn',{context:'error',snac:'you can\'t delete this post!'})
			}

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
			this.more_btn_loading = true;
			this.load_line = true;
			this.skip === 0? this.cmt_loading = true : null;

			sort?(this.skip = 0,this.comments = [],this.cmt_loading = true ):null;
			// for single post view

			let cid = this.$route.query.cid || null;
			sort?cid = null:null;
			cid?this.showFilters = false:null;

			this.$axios.get(`${this.$store.state.server}debate/sort/${this.type}+${this.post._id}+${this.skip}+${cid}`, this.$store.getters.auth).then(r=>{
				console.log(r.data.poleComments);
				this.$bus.$emit('debate_cmt_loaded',true);
				this.load_line = false;
				// show more commnet btn handler
				r.data.poleComments.length >= 5?this.more_btn_show = true:this.more_btn_show = false;

				r.data.poleComments.map(d=>{

					console.log(d.replys.length)
					d.replys.length === 3?d.show_more = true :d.show_more = false;
				}) 


				if(r.data.poleComments.length !== 0){
					this.showComment = true;

					// pushing data in comment


					r.data.poleComments.map(d=>{
						this.comments.push(d);
					})

					// user have liked the commnet or not?
					this.comments.map(d => {
						d.skip_replys = 3 ;

						d.likes.map(l=>{
							d.liked = l.user === this.$store.getters.id;
						})

						// user have commnet diliked or not?
						d.dislikes.map(l=>{
							d.disliked = l.user === this.$store.getters.id;
						})

						// liked user commnet reply ? 

						d.replys.map(r=>{
							r.likes.map(l=>{
								r.liked = l.user === this.$store.getters.id;
							})
						})
					})
				}

				// highliting cmt for single post view
				setTimeout(()=>{
					cid?this.$inView(this.$el.querySelector(`#wrap_${cid}`)):null;
				},1000)

					this.more_btn_loading = false;
					this.cmt_loading = false;


			}).catch(e=>{
				console.log(e);
				this.$store.commit('sn',{context:'error',snac:'server error'});
			})
		}

	},
	created(){
		this.fetchData();

		// pushing new written commet data
		this.$bus.$on('debate_created',r=>{
			// loading true

			// this statement justify the spacic post commnet created post
			if(r.post === this.post._id){
				this.commnets = [];
				// getting and unshift data
				this.$axios.get(`${this.$store.state.server}debate/singlecomment/${r._id}`,this.$store.getters.auth).then(r=>{

					this.more_btn_show = false

					if(this.post._id === r.data.post){

						this.showComment = true;

						// loading false
						// closing loading in debatePost 
						this.$bus.$emit('debate_cmt_loaded',true);

						if(!r.data.error){
							this.comments.unshift(r.data);
							this.$store.commit('sn',{snac:'comment comment posted.'})


							let trackId = `#wrap_${r.data._id}`
								setTimeout(()=>{	

								this.$inView((this.$el.querySelector(trackId)))

							},500)


						}else{
							this.$store.commit('sn',{context:'error' , snac:r.data.error});	
						}

					}

				}).catch(e=>{
					console.log(e);
					this.$store.commit('sn',{context:'error' , snac:'server error'})
				})

			}

		})

		this.$bus.$on('debate_cmt_load',post=>{
			post.debate_cmt_loading = true;
		})


	}
}
</script>

<style>
.icon-flipped {
    transform: scaleX(-1);
    -moz-transform: scaleX(-1);
    -webkit-transform: scaleX(-1);
    -ms-transform: scaleX(-1);
    font-size: 18px;
}


.vl {
    border-left: 2px solid grey;
    padding: 2px;
    height: calc(100% - 100px);
}

.ani{
background: linear-gradient(282deg, #a1ffce, #faffd1);
background-size: 400% 400%;
transition-timing-function: ease;
}
</style>