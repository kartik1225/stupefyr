<template>
	<v-app >
		<div v-if='questions.length !== 0'>
		<v-layout  justify-center>
			<v-flex xs12 sm10 md8 lg6>

				<div :style="$vuetify.breakpoint.width > 600?`padding:20px;`:`padding:2px;`">
					<v-card>
						

						<v-stepper :non-linear='true' v-model="e1" >

						  <v-stepper-header class='stripe'>

						    <template v-for="(q,n) in questions">
						      <v-stepper-step
						      	color='red'
						        :key="n"
						        :step="n"
						        :complete="e1 > n"
						        
						      >
						      <span class="white--text">question {{ n + 1}}</span>
						      </v-stepper-step>
						      <v-divider v-if="n !== questions.length" :key="n"></v-divider>
						    </template>
						  </v-stepper-header>


						  <v-stepper-items>
						    <v-stepper-content
						      v-for="(q,n) in questions"
						      :step="n"
						      :key="n"


						    >

							<!-- question display    -->
						    <v-container grid-list-xs >
						    <v-layout  column justify-center style='overflow:auto'>


						    	    <div v-show='!quizComplited'>
						    	    <img v-show='q.imageId !== null' :src='`${$store.state.server}picture/${q.imageId}`' style="width:100%;" />
						    		</div>


						    	<div v-show='!quizComplited'>

							      	<div v-if='q.type === `multipule_choice`'>
								      		<span :class="$vuetify.breakpoint.width > 600 ? `display-1`:`title`"><strong>Q -</strong> {{ q.question}}</span>

								      		<br><br>

							      			<div v-for='(ops,ind) in q.options'>
							      				<v-btn round block :class='q.userAns === ind?`stripe white--text`:`black-stripe`'  @click='multipuleAns(q,n,ops,ind)'  >{{ops.text}}</v-btn>
							      			</div>
							      			<v-layout>
							      				<v-spacer></v-spacer>
							      				<span class="caption grey--text">* click on one button to select the correct answer *</span>
							      			</v-layout>

							      	</div>


								      	<div v-if='q.type === `feel_blank`'>

								      		<div class='display-1' style="display:block;">

									      		<v-layout justify-center>
												 	<span> feel in the blank.</span>
												 </v-layout>

											</div>
											<br>

											<!-- caption  -->
											<div v-if='q.caption !== null'>	
												<v-icon>format_quote</v-icon>
												<span class="subheading">{{q.caption}}</span>
											</div>

											<br>

											<v-layout wrap>
								      		<template v-for='(b,i) in q.blank' style='width:100%;'>
								      			<span :class="$vuetify.breakpoint.width > 600 ? `display-1`:`title`">{{b}}</span>

								      					&nbsp
								      					<div style='width:150px;'>
														<v-text-field 
																  
																  class='inp'
														          single-line
														          label="type answer..."
														          value='test'
														          hide-details
														          v-model='vals[i]'
														          v-if='i !== q.blank.length -1'
														></v-text-field>
														</div>
														&nbsp
								      		</template>


								      	</v-layout>
								      		<br class="clearBoth" />

								      	</div>
							      	</div>

					      		<v-slide-y-transition>
							      	<div v-show='quizComplited'>
							      		<v-layout justify-center>
							      			<span :class=" $vuetify.breakpoint.width > 600?`display-1`:`title`">your quiz has been submited!</span>
							      		</v-layout>
							      		<br>
							      		<v-layout justify-center>
							      			<v-icon class='green--text' style='font-size:60px'> done </v-icon>
							      		</v-layout>
							      		<br>
							      		<v-layout justify-center>
							      			<span :class=" $vuetify.breakpoint.width > 600?`headline `:`subheading`">we will notify you after {{resultEta}}.</span>
							      		</v-layout>

							      	</div>	
						      	</v-slide-y-transition>

							     </v-layout>

							 </v-container>

							      <!-- <v-btn v-show='n === questions.length -1' color="primary" @click='finalSubmit' > submit </v-btn> -->

							      	<v-layout>

								      <v-btn  flat :disabled='quizComplited' v-show='n === 0 ?false:true' @click='e1 -= 1'><v-icon>keyboard_arrow_left</v-icon> back</v-btn>

								      <v-spacer></v-spacer>

								      <v-btn  :class='blankNext || vals.length !== q.blank.length -1?`stripe white--text`:null' v-if='q.type === "feel_blank"' :disabled='!blankNext || vals.length !== q.blank.length -1'  @click="nextStep(q,n)">{{n === questions.length -1?`submit`:`next question`}}<v-icon>{{n === questions.length -1?`file_upload`:`keyboard_arrow_right`}}</v-icon></v-btn>


								      <v-btn :class='multiNext?`stripe white--text`:null'  :disabled='!multiNext' v-if='q.type === "multipule_choice"' @click='nextStep(q,n)'>{{n === questions.length -1?`submit`:`next question`}}<v-icon>{{n === questions.length -1?`file_upload`:`keyboard_arrow_right`}}</v-icon></v-btn>
								    </v-layout>

						    </v-stepper-content>
						  </v-stepper-items>


						</v-stepper>
					</v-card>
				</div>
			</v-flex>
		</v-layout>
	</div>
	</v-app>
</template>

<script>
import moment from 'moment';
export default{
	data(){
		return{
			e1:0,
			questions:[],
			value:null,
			answers:[],
			temp:'',
			vals:[],
			userAns:[],
			blankNext:false,
			// multi ops
			multiNext:false,
			quizComplited:false,
			fullQuz:null,
			selectedOps:null,
			// moment stuff
			resultEta:null,
			st:null
		}
	},
	watch:{
		vals:function(){

			let data = []
			for (var i = this.vals.length - 1; i >= 0; i--) {
			 data.push(this.vals[i] === undefined || this.vals[i] === '');
			}

			let value = (val) =>{
				return val === false
			}

			let exicute = this.vals.length === 0 ? false : data.every(value)

			this.blankNext = exicute;

		},
		e1(){

			// this function add data in feel in the blank types

			const val = this.e1 - this.userAns.length
			if(val < 0){
				let Q = this.questions[this.e1];
				if(Q.type === 'feel_blank'){
					this.vals = Q.userAns;
				}
			}
		}
	},
	methods:{
			nextStep(q,n) {
				if(n === this.userAns.length){
					console.log('this')
				}

				if(q.type === 'feel_blank'){
					if(this.blankNext || this.vals.length !== q.blank.length -1){
						this.blankAnswerFunction(q,n);

						if(n !== this.questions.length - 1){
		          			this.e1 = n + 1;			
						}
					}
				}


				if(q.type === 'multipule_choice'){
					this.multiNext = false;

					

					setTimeout(()=>{
						this.selectedOps = null;
					},200)

					if(n !== this.questions.length - 1){
					
	          			this.e1 = n + 1;		

					} 

					if(n === this.questions.length -1){

						this.quizComplited = true;
						this.sendAnswers()
					}


					this.multipuleAnswerFunction(q,n)
				}



		          // console.log(this.vals);

			},
			sendAnswers(){
				let totalETA  = moment().diff(moment(this.st));
				let data = {
					user:this.$store.getters.id,
					quizId:this.fullQuz._id,
					answers:this.userAns,
					timeSpan:totalETA
				}	


				this.$axios.post(`${this.$store.state.server}quiz/usersubmit`,data,this.$store.getters.auth).then(r=>{
					console.log(r.data);

					// socket event for the cron.

				}).catch(e=>{
					console.log(e)
				});
				console.log(data)
			},
			blankAnswerFunction(q,n){
				//feel_blank type
				if(q.type === 'feel_blank'){

					let data = [];

					this.vals.map(d=>{
						data.push(d)
					})

					q.userAns = data;

					console.log(q);



					let final = {
						type:q.type,
						index:n,
						answer:data
					}

					if(n < this.userAns.length){

						this.userAns[n] = final;

					}else{

						this.userAns.push(final)
						
					}

					this.vals = [];


					if(n === this.questions.length -1){

						this.quizComplited = true;
						this.sendAnswers()
					}

					// finsl submit

					// console.log(this.userAns);

				}
			},
			multipuleAnswerFunction(q,n){
				// multipule_choice type
				if(q.type === 'multipule_choice'){

					if(n === this.questions.length -1){
						this.quizComplited = true;
					} 
				}

			},
			fetchData(){
				this.$axios(`${this.$store.state.server}quiz/get/${this.$route.params.id}`,this.$store.getters.auth).then(r=>{

					if(r.data.error){
						this.$store.commit('sn',{context:'error',snac:r.data.error})
					}

					r.data.questions.map(d=>{
						d.userAns = null;
					})
					console.log(r.data.questions)

					


					this.questions = r.data.questions;
					this.fullQuz = r.data;

					// calculating result eta 	

					let diff = moment(this.fullQuz.startStamp).zone(this.fullQuz.timeZone).add(this.fullQuz.duration,'days').diff(moment());
					this.resultEta =  moment.duration(diff).humanize();

					// snaping staring time
					this.st = moment().toISOString();
						

						this.e1 = 1 ;
					setTimeout(()=>{
						this.e1 = 0 ;
					},500)


				}).catch(e=>{
					console.log(e);
				})
			},
			multipuleAns(q,n,ans,i){

				let data = {
					type:q.type,
					index:n,
					answer:ans.text
				}


				q.userAns = i;

				// verifying if we have to replace the answer of not
				if(n < this.userAns.length){
					this.userAns[n].answer = ans.text;
				}else{
					this.userAns.push(data);
				}


				// disable and enable the next buttun
				this.multiNext = true;
				console.log(this.userAns);
			},
			finalSubmit(){



				let data = {
					user:this.$store.getters.id,
					quizId:fullQuz._id,
					answers:this.userAns
				}

				console.log(data)
			}
	},
	computed:{
		bla(arr){
			console.log(arr)
			return 'arr'
		}
	},
	created(){
		this.fetchData();

		
		console.log('test')
		const addMin = moment().add(60000,'milliseconds').toISOString()
		console.log(addMin);
		// if(this.questions[0].type === 'feel_blank'){
		// 	this.questions0[0].blank
		// 	this.vals.push('') 
		// }
	}
}
	
</script>

<style>
	div.inline { float:left; }

	.inp {
		padding:  0 0 0 !important;
	}

	.inp label{
		top:0 !important;
	}
	.inp .input-group__details{
		background: linear-gradient(to right, #ff9068, #fd746c);
		margin-top: -3px;
		min-height: 5px;
	}

	.disp-1 {
		font-size: 20px !important;
		font-weight: 400;
		line-height: 40px !important;
		letter-spacing: normal !important;
		width: 150px;
	}

	.tit {
		font-size: 13px !important;
		font-weight: 500;
		line-height: 1 !important;
		letter-spacing: 0.02em !important;
		width: 100px;
	}

	.blankinpÿ{
		background-color: transparent; 
		border-style: solid; 
		border-color: orange;
		border-width: 0px 0px 3px 0px; 
		margin:2px;
	}
	.clearBoth { clear:both; }

	.stripe{


		    background: #fd746c;  /* fallback for old browsers */
		    background: -webkit-linear-gradient(to right, #ff9068, #fd746c);  /* Chrome 10-25, Safari 5.1-6 */
		    background: linear-gradient(to right, #ff9068, #fd746c); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

	}

	.black-stripe{
		background: #8e9eab;  /* fallback for old browsers */
		background: -webkit-linear-gradient(to left, #eef2f3, #8e9eab);  /* Chrome 10-25, Safari 5.1-6 */
		background: linear-gradient(to right, #eef2f3, #8e9eab); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
	}
</style>