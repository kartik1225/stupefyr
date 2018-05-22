<template >
	<div >
		<v-text-field
		v-model='url'
		>
			
		</v-text-field>


	<v-card :style="`background-color:rgb(${bg};`">
		<v-layout>
		<div :style="` width:400px; background-color:linear-gradient(to right, rgb(${v.Vibrant._rgb} 0%, rgb(${v.Muted._rgb} 100%)`">
			<img style="width:400px;" :src='src' cross-origin="anonymous">
		</div>	

	<div >
		<v-container>
			<p class='display-1' :style="`color:rgb(${txt};`">kartik</p>
		</v-container>
	</div>
</v-layout>
	</v-card>



	<v-layout>
	<template v-for='(c,i) in v'>
		<div v-if='c' :style="`height:400px; width:400px; background-color:rgb(${c._rgb}; color:rgb(251, 181, 127);`" >
			{{i}}
		</div>
		<span v-if='!c'>{{i}} <br> nope</span>
	</template>
</v-layout>
</div>
</template>

<script>
import vibrant from 'node-vibrant';
import contrast from 'get-contrast';

import Grade from 'grade-js'

	export default{
		data(){
			return{
				src:null,
				url:'/static/k.jpg',
				v:null,
				clrs:[],
				txt:null,
				bg:null
			}
		},
		watch:{
			url(i){
				this.src = i;
				console.log(this.src);

				vibrant.from(i).getPalette((err, palette) => {this.v=palette})


			}
		},
		methods:{

		},
		created(){


				// const random = Math.floor((Math.random() * 200) + 1)
				// this.url = `https://picsum.photos/${random}`;



				this.src = this.url
				vibrant.from(this.url).getPalette((err, palette) => {	
					this.v=palette

					// console.log(palette)

				    const rgbs =[];
				    const _ =  [];
					for (var key in palette) {
						
					    palette[key]?(rgbs.push(palette[key]._rgb,console.log('brah',palette[key].getPopulation()))):null
					}


					// cont algorithm
				const cont = [];

					rgbs.map((d,i)=>{

						rgbs.map((e,ind)=>{

							if(i!==ind){
								const diff = contrast.ratio(`rgb(${d})`, `rgb(${e})`)	
								cont.push({i,ind,diff})
							}

						})


					})	

					const max = Math.max(...cont.map(o => o.diff))

					const indexs = [];

					cont.map((d,i)=>{
						d.diff === max?indexs.push(i):null;
					})


					var one = Math.round(((parseInt(rgbs[cont[indexs[0]].i][0]) * 299) +
					                    (parseInt(rgbs[cont[indexs[0]].i][1]) * 587) +
					                    (parseInt(rgbs[cont[indexs[0]].i][2]) * 114)) / 1000);


					var two = Math.round(((parseInt(rgbs[cont[indexs[0]].ind][0]) * 299) +
					                    (parseInt(rgbs[cont[indexs[0]].ind][1]) * 587) +
					                    (parseInt(rgbs[cont[indexs[0]].ind][2]) * 114)) / 1000);


					if(one < two){
						this.bg = rgbs[cont[indexs[0]].i];
						this.txt = rgbs[cont[indexs[0]].ind]; 	
					}else{
						this.txt = rgbs[cont[indexs[0]].i];
						this.bg = rgbs[cont[indexs[0]].ind]; 
					}







					console.log();
				})








		}
	}
</script>

<style>
	
</style>