<template>

	<div>	
		<div v-if='movie !== null'>
			<rating :movie='movie'></rating>
		</div>

		<br>	

		<div >
			<cdisp v-if='movie !== null' :movie='movie'></cdisp>
		</div>

		<v-layout justify-center>
			<v-flex sm10>
				<bestplotPage v-if='movie !== null' :movie='movie'></bestplotPage>
			</v-flex>
		</v-layout>
	</div>

</template>

<script>

const cdisp =()=> import('./castingDisplayCard');
const rating = () =>import('./rating');
const bestplotPage = ()=> import('./bestplotPage');



export default {
	components:{
		cdisp,
		rating,
		bestplotPage
	},
	data(){
		return{	

			feed:{
				feedbox:true,
				rate:true,
				yes:true,
				no:true,
				size:'md4 sm6 xs12',
			},
			movie:null,
			castinngs:null,
		}
	},

	watch:{

	},
	methods:{

	},
	mounted(){
		this.$axios.get(`${this.$store.state.server}movie/get/${this.$route.params.movie}+${this.$store.getters.id}`,this.$store.getters.auth).then(r=>{
			console.log(r.data);
			this.movie = r.data.movie;

			this.movie.castings.sort((a,b)=>{
				return a.order -b.order
			})

			this.castings = this.movie.castings;
		}).catch(e=> {console.log(e)});

		this.$vuetify.breakpoint.width < 600? this.size = `grid-list-xs` : this.size = `grid-list-md`

		this.$bus.$on(`rated`,r=>{
			this.movie.avrRating = r.avrRating;
			this.movie.userRating = r.rating;
		})
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