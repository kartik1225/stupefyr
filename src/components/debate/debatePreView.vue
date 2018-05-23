<template>

	<v-layout justify-center>
		<v-flex xs12 sm10 md8 lg6>
				<v-layout>
					<v-spacer></v-spacer>
					<v-btn @click='$bus.$emit(`showDebate`,true)' icon small>
						<v-icon style='font-size:18px;'>edit</v-icon>
					</v-btn>	
					<v-btn  icon small @click='($bus.$emit(`poleCancel`,true) ,pole=null)' >
						<v-icon style='font-size:18px;' >clear</v-icon>
					</v-btn>	
				</v-layout>	

				<v-layout>
				<div v-for='img in pole.imgs'>
					<v-container grid-list-xs>
					<img style="width:100%;" :src='`${$store.state.server}picture/${img}`'>
					</v-container>
				</div>
				</v-layout>
				<v-slide-x-transition>

				<v-layout :column='imageLength !== 2' v-show='!resultShow'>

					<div :style="`width:100%`" v-for='(pole,i) in pole.poles'>

							<v-card>
								<v-container grid-list-lg>
									<span>{{pole}}</span>
								</v-container>
							</v-card>
					</div>

				</v-layout>
				</v-slide-x-transition>
		</v-flex>
	</v-layout>

</template>

<script>

export default {
	props:['poles'],
	components:{

	},
	data(){
		return{
			//pole 
			pole:null,
			imageLength:0,
			selected:null,
			resultShow:false,
			//extre input stuff
			showInput:false,
			data:null
		}
	},
	watch:{
		poles(){
			this.fetchData();
		}

	},
	methods:{
		fetchData(){

			this.data = this.poles;
			let data = this.data;

			this.imageLength = data.imgs.length;

			console.log(this.imageLength)
			
			this.pole = data;
		}

	},
	created(){
		this.fetchData()
	}	
}
</script>

<style>
	
</style>