<template>
<div>
		<!-- hr scoll -->
		<v-layout justify-center>
		<v-flex xs12 ref='Wdt'>

		<div style="position:relative"  >
		<v-layout style="overflow:auto" ref='casts' v-scroll:throttle="{fn: onScroll}">

		<div style=' position:absolute; z-index:1; height:100% ;' class="fade" v-show='leftScroll'>
			<div class='v-middle'>

				<v-btn @click='hScroll(`left`)' light icon class='white' >
					<v-icon>keyboard_arrow_right</v-icon>
				</v-btn>

			</div>
		</div>


		<slot></slot>

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
		
	},
	mounted(){

			setTimeout(()=>{
				this.hScroll('left');

			},300)


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