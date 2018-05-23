<template>
	<div>
		<v-card style='height:100%' class=''>

			<div role='button' @click='route'  :style="`line-height:0;overflow:hidden; width:100%; height:240px; border-radius:5px; position:relative; background-image:${`linear-gradient(to right, ${background})`} ;animation: background 45s ease infinite;` " class=" elevation-3" >
				<div>
					<v-chip style='position:absolute; right:0;'small label :color="status" text-color="white">
    					  <span class="caption"><strong>{{timeLeft}}</strong></span></span>
    				</v-chip>


    				<img v-if='quiz.thumbnail' style="max-width:100%; max-height:100%;border-radius:5px; " :src='`${$store.state.server}picture/${quiz.thumbnail}`'>
				<div  :style="`height:50px; text-overflow:ellipsis; width:100%; position:absolute; bottom:0; z-index:0; ${quiz.thumbnail?`background-image: -webkit-gradient(linear, 0% 100%, 0% 0%, from(rgba(23, 23, 23, 0.56)), to(rgba(0, 0, 0, 0)));`:null}` ">
				
				<v-container grid-list-md style='position:absolute;bottom:0;'>

					<v-icon style='font-size:18px;' dark>account_circle</v-icon> <span class="body-1 white--text">created by<strong> {{quiz.creator.name}} &#9679; {{quiz.participants}}  </strong> participants </span> 				
				</v-container>
				</div>
				</div>
			</div>
			<div>
			<v-container style='margin-top:6px; position:relative;'>
				<v-btn		style='z-index:2;'
				              absolute
				              dark
				              fab
				              top
				              right
				              color="pink"
				              small
				            ><v-icon style='font-size:28px;'>play_arrow</v-icon>
				</v-btn>

				<p  class="title" ><strong></strong>{{quiz.title}}</p>  
				
				<v-icon style='font-size:14px;'class='grey--text'>label</v-icon> <span class="caption grey--text">Contains <strong>{{quiz.questions.length}} questions </strong> &#9679; created at {{createdAt}}</span>

			</v-container>
			</div>
		</v-card>
	</div>
	
</template>

<script>
import moment from 'moment'
import gradients from './gradients.json'
	export default{
		props:['qz'],
		data(){
			return{
				quiz:this.qz,
				timeLeft:null,
				createdAt:null,
				status:null,
				background:null
			}
		},
		methods:{

			endsInFunc(){
							let eventDayDiff = moment(this.qz.startStamp).zone(this.qz.timeZone).diff(moment())

							if(eventDayDiff > 0){

								let upcoming = moment.duration(eventDayDiff).humanize();

								this.status = 'grey'
								return `Quiz will start in ${upcoming}`
							}else{


							   	let diff = moment(this.qz.startStamp).add(this.qz.duration,'days').diff(moment());

							   	let _ = diff > 0 ?(this.status='green',`Quiz will ends in ${moment.duration(diff).humanize()}`):(this.status = 'red','expired');

							   	return _;
						   		this.timeLeft = _;
				}
			},
			route(){

				const live = moment(this.qz.startStamp).zone(this.qz.timeZone).add(this.qz.duration,'days').zone(this.qz.timeZone).diff(moment()) > 0?true:false;

				const upComing = moment(this.qz.startStamp).zone(this.qz.timeZone).diff(moment().zone(this.qz.timeZone)) > 0? true:false;

					if(live){

						if(upComing){

							this.$store.commit('sn',{context:'error',snac:this.timeLeft})
						}else{

							this.$router.push(`quiz/play/${this.quiz._id}`);

						}
					
					}else{

						this.$router.push(`quiz/result/${this.quiz._id}`);

					}

			}
		},
		created(){ 

			this.timeLeft = this.endsInFunc();

			// created 
			let full = this.quiz.startDate + ' ' + this.quiz.startTime
			let diff = moment(full,["YYYY MM DD hh:mmA"]).from(moment());

			this.createdAt = diff;

					 // I am writing code 🙌
			let ran = Math.floor((Math.random() * 286) + 1);

			this.background = gradients[ran].colors;

			setInterval(()=>{
				this.timeLeft = this.endsInFunc();
			},60000)

		}
	}
</script>

<style>
	
</style>