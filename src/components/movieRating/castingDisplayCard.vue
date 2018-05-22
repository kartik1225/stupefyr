<template>
<div>
		<!-- hr scoll -->
		<v-layout justify-center>
		<v-flex xs12 sm10 ref='Wdt'>

		<div style="position:relative"  >
		<v-layout style="overflow:auto" ref='casts' v-scroll:throttle="{fn: onScroll}">

		<div style=' position:absolute; z-index:2; height:100% ;' class="fade" v-show='leftScroll'>
			<div class='v-middle'>

				<v-btn @click='hScroll(`left`)' light icon class='white' >
					<v-icon>keyboard_arrow_right</v-icon>
				</v-btn>

			</div>
		</div>


		<template v-for='cast in castings' >

			<v-container  v-bind="{ [`${size}`]: true }">
			<v-card style='width:200px' hover>
				<div class="grey lighten-4" v-ripple :style="`position:relative; line-height:0; overflow:hidden; height:250px;`" >
				<img style="width:100%;"  :src="`${$store.state.server}picture/${cast.profileImage}`">
				</div>
				<v-divider></v-divider>
				<v-container grid-list-lg style="position:relative;">
				<br>
					<v-btn
					  @click='postLike(cast)'
					  style='z-index:1'
		              :color="`purple ${cast.liked?`lighten-4`:null}`"
		              dark
		              absolute
		              top
		              right
		              small
		              fab>
		              <v-icon :style='`${cast.liked?`color:#9C27B0;`:`color:white;`}`'>{{cast.liked?`done`:`thumb_up`}}</v-icon>
		          </v-btn>
				<div>
					<p class="body-2">{{cast.name}}</p>
					<p class="body-1 grey--text" style="margin-top:-16px">{{cast.character}}</p>
					<p class="body-1 purple--text"style="margin-top:-16px">{{cast.likes.length}} <span class='caption'>upvotes</span></p>
				</div>
				</v-container>
			</v-card>
			</v-container>

		</template>

		<div style=' position:absolute; right:0; z-index:2; height:100% ;' class="fade_reverse" v-show='rightScroll'>
			<div class='v-middle' >
			<v-btn @click='hScroll(`right`)' light icon class='white' >
			<v-icon>keyboard_arrow_right</v-icon>
		</v-btn>
			</div>
		</div>

		</v-layout>
		</div>
		</v-flex>
		</v-layout>
</div>

</template>

<script>


export default {
	props:['movie'],
	data(){
		return{	
			size:'grid-list-md',
			castings:null,
			rightScroll:true,
			leftScroll:true,
			position: {scrollTop: 0, scrollLeft: 0}
		}
	},

	watch:{
		'$vuetify.breakpoint.width':function(i){

			i < 600? this.size = `grid-list-xs` : this.size = `grid-list-md`

		},
		'$refs.casts.scrollLeft':function(i){
			console.log(';');
		}
	},
	methods:{
		onScroll:function(e, position){
			// btn visibility handler
			this.rightScroll = parseInt(this.$refs.casts.scrollWidth - this.$refs.casts.scrollLeft - this.$refs.casts.offsetWidth) !== 0;
			this.leftScroll = this.$refs.casts.scrollLeft !== 0
		},
		hScroll(action){
				if(action === `left`){


					this.$refs.casts.scrollLeft -=  this.$refs.casts.offsetWidth; 
				}else{
					// right
					this.$refs.casts.scrollLeft +=  this.$refs.casts.offsetWidth
				}
			// btn visibility handler
			this.rightScroll = this.$refs.casts.scrollWidth - this.$refs.casts.scrollLeft - this.$refs.casts.offsetWidth !== 0;
			this.leftScroll = this.$refs.casts.scrollLeft !== 0
		},
		postLike(cast){
			const data = {
				user:this.$store.getters.id,
				post:cast._id,
				type:'cast'
			}

			cast.liked = !cast.liked;

			this.$axios.post(`${this.$store.state.server}movie/castlike`,data,this.$store.getters.auth).then(r=>{

				if(r.data.error){
					this.$store.commit('sn',{context:error,snac:r.data.error});
				}else{

					cast.liked = r.data.liked;

					if(r.data.liked){
						// like
						cast.likes.push(r.data.data);

					}else{
						// dislike
						const ind = cast.likes.findIndex(d=>d.user === r.data.data.user);
						cast.likes.splice(ind,1);

					}
				}
				console.log(r.data);
			}).catch(e=>{
				this.$store.commit('sn',{context:'error',snac:'server error.'});
				console.log(e);
			})
		}
	},
	mounted(){

			setTimeout(()=>{
				this.hScroll('left');

			},300)

			this.castings = this.movie.castings;

			console.log(this.movie.castings);

			// likes

			this.castings.map(d=>{

				d.likes.map(l=>{

					console.log('hmm',d);
					l.user === this.$store.getters.id?d.liked=true:null;
				})

			})

		this.$vuetify.breakpoint.width < 600? this.size = `grid-list-xs` : this.size = `grid-list-md`
	}
}
</script>

<style scoped>

.v-middle{
  position: relative;
  top: 50%;
  transform: translateY(-50%);
}

.fade{
	background: linear-gradient(to right,#f5f5f5,rgba(255,255,255,0));
	left: 0;
	box-pack: start;
	-webkit-justify-content: flex-start;
	justify-content: flex-start;
	z-index: 3;
}

.fade_reverse{
    background: linear-gradient(to left,#f5f5f5,rgba(255,255,255,0));
    right: 0;
    box-pack: end;
    -webkit-justify-content: flex-end;
    justify-content: flex-end;
}


</style>