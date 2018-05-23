<template>
	<div>
	  <!-- ................................................ comment loop can be start here .......................................... -->
	  	<!-- comment lopp -->
	          <!-- user commemnt display -->
	            <v-container fluid grid-list-lg>
	  			<template v-for='(cmt,index) in cmts' ref="c">
	            <v-layout row>

	            <!-- commnet user image profile -->
	            <v-avatar                  
	              size="36px"
	              class="grey lighten-4"
	            >
	               <img src="/static/image.jpg" alt="avatar">
	            </v-avatar>



	            <!-- post content wrap -->
	            <v-flex xs11 md11 justify-start style='margin-top:-7px;'>
	              <v-layout row>

	              <!-- comment user post  -->
	             	
	                <p style='margin-left:9px;  font-weight:bold;' class="body-1 text-xs-left">{{cmt.user.name}}</p>
	             
	              <!-- commet user created time -->

	              	<div style="position: absolute;right: 0;">
	                <v-menu bottom left>
	                 <v-btn icon slot="activator" light @click='more(cmt,index)'>
	                   <v-icon style='font-size:22px;' class='orange--text'>more_vert</v-icon>
	                 </v-btn>

	                 <v-list v-show='isUser'>
	                   <v-list-tile @click='editComment(cmt,index)'>
	                   	<v-icon>edit</v-icon>
	                    <v-list-tile-title>edit</v-list-tile-title>
	                   </v-list-tile>
	                   <v-list-tile @click='deleteCmt(cmt,index)'>
	                   	<v-icon>delete</v-icon>
	                   	<v-list-tile-title>delete</v-list-tile-title>
	                   </v-list-tile>
	                 </v-list>

	                 <v-list v-show='!isUser'>
	                 	<v-list-tile>
	                 	<v-icon>flag</v-icon>
	                 	<v-list-tile-title>report this comment</v-list-tile-title>
	                 	</v-list-tile>
	                 </v-list>

	               </v-menu>
	               </div>

	              </v-layout>

	              <!-- comment user's comment -->
	              <div>
	              <p class="caption" style="margin-top:-4px;">{{cmt.comment}}</p>
	              </div>
	              <!-- comment actions -->
	              <v-flex xs7 sm6 md6 style='margin-top:-4px;'>
	              <v-layout justify-space-between >
	               <p :class="{caption:true , 'indigo--text':cmt.liked ,'grey--text':!cmt.liked ,'text-xs-right':true}" role='button' @click='postlike(index)'>{{cmt.liked?'liked':'like'}}</p>
	               <p role='button' class="caption orange--text">replay</p>
	               <p class="grey--text" style="font-size: 12px;"> <timeago :since="Date.parse(cmt.created)" :auto-update="30"></timeago></p>
	              </v-layout>
	              </v-flex>
	              </v-flex>

	              <!-- comment edit opctions -->
	              

	            </v-layout>

	            
	</template>
	            </v-container>

	                          <!-- comment edit box  -->
	                          <v-dialog v-model='editbox' width='600px'>
	                          	<v-card>
	            	              	<v-container>
	            	              		<v-text-field
	            	              		                name=""
	            	              		                label="edit your commet"
	            	              		                textarea
	            	              		                v-model='editInp'
	            	              		                autofocus
	            	              		                @keyup.enter='updateComment'

	            	              		></v-text-field>
	            	              		<v-card-actions>
	            	              			<v-spacer></v-spacer>
	            	              			<v-btn @click='updateComment' outline>done</v-btn>
	            	              		</v-card-actions>
	            	              	</v-container>
	                          	</v-card>
	                          </v-dialog>
	<!-- ................................................. comment loop will ends here ...................................................... -->
	</div>
</template>

<script>
import { bus } from '../../main'
import axios from 'axios'
	export default{
		props:['post'],
		data(){
			return{
				likeActive:false,
				isUser:false,
				editbox:false,
				selectedPost:null,
				editInp:'',
				cmts:null

			}
		},
		methods:{
			postlike(i){
				const c = this.cmts[i]
				console.log(c)
				const data = {
					user:this.$store.getters.id,
					post:c._id
				}
				axios.post(`${this.$store.state.server}user/comment/like/${this.$store.getters.id}`,data,this.$store.getters.auth).then(r => {
					console.log(r.data)
					c.liked = r.data.liked;
				}).catch(e=>{
					console.log(e)
					this.$store.commit('sn',{context:'error',snac:'getting error while "like" try again.'})
				})
			},
			// change menu if user then
			more(i,cmt){
				const is = i.user._id === this.$store.getters.id? (true):false;
				this.isUser = is;
			},
			editComment(i,index){
				this.editbox = true;
				console.log(i)
				this.editInp = i.comment;
				this.selectedPost = index
			},
			updateComment(){
				const c = this.cmts[this.selectedPost]
				const data = {
					post:c._id,
					user:this.$store.getters.id,
					update:this.editInp
				}
				console.log(this.editInp)
				axios.put(`${this.$store.state.server}user/comment/${this.$store.getters.id}`,data, this.$store.getters.auth).then(r => {
					console.log(r.data)
					if(r.data.success){
						this.editbox = r.data.sucess;
						console.log(this.cmts,this.selectedPost, r.data.comment)
						this.$set(this.cmts,this.selectedPost, r.data.comment)
						this.$store.commit('sn',{snac:'comment edited'})
					}else{
						this.editbox = false;
						this.$store.commit('sn',{context:'error',snac:'error while edting'})
					}
				}).catch(e => {
					console.log(e)
				})
			},
			deleteCmt(cmt,index){
				if(confirm('Are you sure do you want to delete comment?')){
				axios.delete(`${this.$store.state.server}user/comment/${cmt._id}+${this.$store.getters.id}`,this.$store.getters.auth).then(r=>{
					if(r.data.result){
						console.log(r.data.result)

						// deleting user from array
						setTimeout(()=>{
						  if (index > -1) {
						      this.cmts.splice(index, 1);
						  }
						},500)

						this.$store.commit('sn',{context:'error',snac:r.data.result})
					}else{
						this.$store.commit('sn',{context:'error',snac:r.data.error})
					}
				}).catch(e => {
					console.log(e)
					this.$store.commit('sn', {context:'error',snac:'server error , try again'})
				})

			}else{
				this.$store.commit('sn',{snac:'dont worry your commnet is still there.'})
			}

			},
			fetchData(){
				this.cmts = this.post.comments;
			}

		},
		created(){
			this.fetchData();
			// buss	
			bus.$on('comment_created',c=> {
				this.$store.commit('sn',{snac:'comment added'});
					if(c.post === this.post._id){
						this.cmts.unshift(c)
					}					
			})
			
		},
		beforeDestroy(){
			bus.$off('comment_created')
		}
	}
	
</script>

<style>
	
</style>