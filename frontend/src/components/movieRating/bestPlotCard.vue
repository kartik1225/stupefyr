
<template>
  <!-- best plot card -->

<v-card>

<div style="position:relative;" class="">


        <v-container grid-list-lg>
        <v-layout >

        <!-- user avatar image -->
          
          <v-avatar                 
            size="36px"
            class="grey lighten-4"
          >
             <img src='/static/default-profile.png'/>
          </v-avatar>

          <v-layout style='margin-left: 0px;margin-top: 0px;'>
          <!-- user name -->
          <p class="subheading" style="margin-top:auto; margin-bottom:auto; margin-left:5px;">{{post.user.userName}}</p>
          <v-icon style='font-size:14px;'>play_arrow</v-icon>

          <!-- user post priority -->
          <p class="caption" style="margin-top:auto; margin-bottom:auto; margin-left:2px;">{{post.movieId.title}}</p>
          <v-icon style='margin-left:2px; font-size:6px;'>fiber_manual_record</v-icon>

          <p class="caption" style="margin-top:auto; margin-bottom:auto; margin-left:2px;">{{post.type === `best_part`?`best plot`:`review`}}</p>
          <v-icon style='margin-left:2px; font-size:13px;'>format_quote</v-icon>
          </v-layout>

          <div style='position:absolute; right:0px; margin-top:-7px;'>
          <!-- more option to edit or remove post -->


          </div>  
        </v-layout>
        <!-- displaying time -->
        <div style="margin-top: -19px;margin-left: 33px;">
        <p style='font-size:12px' class='grey--text'><timeago :since='Date.parse(post.created)'></timeago></p>
        </div>
        <!-- user post title  -->
      </v-container>


  <v-card style='margin-top:-18px;'>

  		<v-layout>
  			<!-- voting -->
  			<div class="teal darken-3 white--text" style="width:56px">
	  			<v-layout justify-center>
	  				<!-- upvote -->
		  			<v-btn icon class='white--text' @click='like'>
		  				<v-icon :style='`font-size:35px; ${post.liked?`color:#64FFDA`:`color:white`}`'>arrow_drop_up</v-icon>
		  			</v-btn>
	  			</v-layout>

	  			<p style="line-height:0px" class="text-center">{{post.likes.length - post.dislikes.length}}</p>

	  			<v-layout style="margin-top:-16px" justify-center>
	  				<!-- downvote -->
		  			<v-btn icon class='white--text' @click='dislike'>
		  				<v-icon :style='`font-size:35px; ${post.disliked?`color:#64FFDA`:`color:white`}`'>arrow_drop_down</v-icon>
		  			</v-btn>
	  			</v-layout>
  			</div>

  			<div style="width:100%">
  				<v-container class="quote-card teal white--text">
  					<p  :style="`font-size:${fontSize}`">{{post.content}}</p>
  				</v-container>
  			</div>
  		</v-layout>
  		<!-- commennt -->

  		<v-btn v-show='false' block @click='showComment = !showComment'>
  			<v-spacer></v-spacer>
  			show commnets 	
  			<v-spacer></v-spacer>
  			<v-icon>keyboard_arrow_down</v-icon>
  		</v-btn>

  		<v-layout>
  			<v-avatar style='margin:auto; margin-left:8px; '                 
  			  size="36px"
  			  class="grey lighten-4"
  			>
  			   <img src='/static/default-profile.png'/>
  			</v-avatar>

  		<v-text-field
  		   :id='`inp_${post._id}`'
  		   label="write a comment here..."
  		   single-line
  		   full-width
  		   hide-details
  		   append-icon='send'
  		   :append-icon-cb='createCmt'
  		   @keyup.enter='createCmt'
  		   :value='temp'
  		   @input='value => {temp = ""}'
  		 ></v-text-field>
  		</v-layout>

  		<v-btn block @click='(cmtShow = true,load_line = true)' v-show='!cmtShow' >show comments</v-btn>

  		<v-progress-linear v-show='load_line' style='height:3px;margin-top: 0px;margin-bottom: 0px;' v-bind:indeterminate="true"></v-progress-linear>

	  		<Comment :post='post' v-if='cmtShow' ></Comment>


  </v-card>

 </div>
</v-card>
</template>


<script>
	const Comment = ()=> import('./Comment');
	export default{
		props:['post'],
		components:{
			Comment
		},
		data(){
			return{
				showComment:false,
				fontSize:'18px',
				cmt:'',
				temp:'',
				load_line:false,
				cmtShow:false
			}	
		},
		methods:{
			createCmt(){

				const data = {
					user:this.$store.getters.id,
					post:this.post._id,
					comment:this.$el.querySelector(`#inp_${this.post._id}`).value,
					type:'movie_post'
				}

				this.load_line = true;
				this.cmtShow = true;

				this.$axios.post(`${this.$store.state.server}movie/newcomment`,data,this.$store.getters.auth).then(r=>{

					// if error
					if(r.data.error){
						this.$store.commit('sn',{context:'error',snac:r.data.error});
					}else{
					// success
					console.log(r.data);

					this.$bus.$emit(`movie_cmt_created`,r.data.cmt);

					this.$store.commit('sn',{snac:'Comment has posted..'})

					this.temp = null;

					}

				}).catch(e=>{
					console.log(e);

					this.$store.commit('sn',{context:'error',snac:'Server Error'});
				})


			},
			like(){
				let data = {
					user:this.$store.getters.id,
					post:this.post._id,
					type:'movie_post'
				}

				// pre replicating behaviour of like / dislikes
				this.post.liked?(this.post.liked = false , this.post.disliked = false):(this.post.liked = true , this.post.disliked = false);


				this.$axios.post(`${this.$store.state.server}movie/submitlike`,data,this.$store.getters.auth).then(r=>{

					// removing previous dislikes
					if(r.data.previous){
						const ix = this.post.dislikes.findIndex(i => i._id === r.data.previous._id);
						this.post.dislikes.splice(ix,1);
					}


					if(r.data.liked){
						this.post.likes.push(r.data.data);
						this.$store.commit('sn',{snac:'upvote has been submited'});

						this.post.liked = true;
						this.post.disliked = false;

					}else{
						const ix = this.post.likes.findIndex(i => i._id === r.data.data._id);
						this.post.likes.splice(ix,1);

						this.post.liked = false;
						this.post.disliked = false

						this.$store.commit('sn',{snac:'upvote has been removed'})
					}


				}).catch(e=>{
					console.log(e);
					this.$store.commit('sn',{context:'error',snac:'server error'})
				})
			},
			dislike(){
				let data = {
					user:this.$store.getters.id,
					post:this.post._id,
					type:'movie_post'
				}

				// pre replicating behaviour of like / dislikes
				this.post.disliked?(this.post.liked = false , this.post.disliked = false):(this.post.liked = false , this.post.disliked = true);

				this.$axios.post(`${this.$store.state.server}movie/submitdislike`,data,this.$store.getters.auth).then(r=>{

						// removing previos like 
						if(r.data.previous){
							const ix = this.post.likes.findIndex(i => i._id === r.data.previous._id);
							this.post.likes.splice(ix,1);
						}

						if(r.data.disliked){
							this.post.dislikes.push(r.data.data);
							this.$store.commit('sn',{snac:'downvote has been submited'})

							this.post.liked = false;
							this.post.disliked = true;
						}else{
							const ix = this.post.dislikes.findIndex(i => i._id === r.data.data._id);
							this.post.dislikes.splice(ix,1)
							this.$store.commit('sn',{snac:'downvote has been removed'})

							this.post.liked = false;
							this.post.disliked = false;
						}
						// console.log(r.data);
				}).catch(e=>{
					console.log(e);
					this.$store.commit('sn',{context:'error',snac:'server error'})
				})
			},
			fetchData(){
				this.$route.query.cid?(this.cmtShow = true,this.load_line = true):null;


			}
		},
		created(){
			this.fetchData();
			// font size
			this.post.content.length < 20 ?this.fontSize = '40px':this.post.content.length < 40?this.fontSize = '28px': this.fontSize = '18px';

			// if liked
			this.post.likes.map(d=>{
				d.user === this.$store.getters.id?this.post.liked = true:null;
			})

			this.post.dislikes.map(d=>{
				d.user === this.$store.getters.id?this.post.disliked = true:null;
			})


			// after cmt loaded

			this.$bus.$on(`cmt_loaded`,r=>{
				this.load_line = false;
			})
		}
	}
</script>

<style scoped>
	


	/* quote */
	.text-center {
	  text-align: center;
	}
	.quote-card {
	  background: #fff;
	  color: #222;
	  padding: 20px;
	  padding-left: 26px;
	  box-sizing: border-box;
	  box-shadow: 0 2px 4px rgba(34, 34, 34, 0.12);
	  position: relative;
	  overflow: hidden;
	  min-height: 120px;
	}
	.quote-card p {
	  font-size: 22px;
	  line-height: 1.5;
	  margin: 0;
	  max-width: 80%;
	}
	.quote-card cite {
	  font-size: 16px;
	  margin-top: 10px;
	  display: block;
	  font-weight: 200;
	  opacity: 0.8;
	}
	.quote-card:before {
	  font-family: Georgia, serif;
	  content: "“";
	  position: absolute;
	  top: -20px;
	  left: 0px;
	  font-size: 5em;
	  color: rgba(238, 238, 238, 0.8);
	  font-weight: normal;
	}
	.quote-card:after {
	  font-family: Georgia, serif;
	  content: "”";
	  position: absolute;
	  bottom: -110px;
	  line-height: 100px;
	  right: -32px;
	  font-size: 25em;
	  color: rgba(238, 238, 238, 0.8);
	  font-weight: normal;
	  opacity: 0.5;
	}
	@media (max-width: 640px) {
	  .quote-card:after {
	    font-size: 22em;
	    right: -25px;
	  }
	}


</style>
