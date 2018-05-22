<template>
	<v-app class='transparent'>
		<v-card v-show='$vuetify.breakpoint.width > 600' class='blue-grey ' height='200px'>
		</v-card>

	<v-container grid-list-xs>
		<v-layout row wrap justify-center>
		      <v-flex xs12 sm10 md8 lg6>
		      	<v-card :style='$vuetify.breakpoint.width > 600?`margin-top:-55px;`:null' class='indigo'>
		      		<v-container>
		      			<span class="title white--text" > Create a Quiz </span>
		      		</v-container>
		      	</v-card>


		      	<!-- basic info pop tile	 -->
		      	<div style='height:50px;' class="elevation-1" v-ripple @click='showBasic = !showBasic' role='button' v-show='!showBasic'>
		      		<v-layout>
		      			<v-container>

		      				<span class="subheading"> <strong>Basic info</strong> of this Quiz</span>
		      			</v-container>
		      			<v-spacer></v-spacer>
		      			<v-btn icon>
		      				<v-icon>{{showBasic?`arrow_drop_up`:`arrow_drop_down`}}</v-icon>
		      			</v-btn>
					<v-divider></v-divider> 
		      		</v-layout>
		      	</div>


				<v-card style='margin-top:3px;' class='' v-show='showBasic'>
					<v-container grid-list-xs >

			      		<v-container >
				        <div class='title'>
							<v-text-field
							 single-line

							 v-model='quizTitle'
							 placeholder='Write title of the Quiz...'
							></v-text-field>
						</div>
						</v-container>

						<!-- thumbnail upload -->
						<v-container grid-list-xs>
							<v-icon>keyboard_arrow_right</v-icon>
							<span class="subheading">Upload a Cover image (thumnail)</span>
						</v-container>

						<v-container >
							<v-layout justify-center>
								<v-btn v-show='!thumbImg' class='indigo ' flat @click='$bus.$emit(`thumb_pop`,true)'>upload &nbsp <v-icon>add_a_photo</v-icon></v-btn>
								<v-scale-transition>
								<v-card style='max-width:150px;; line-height:0' v-if='thumbImg'>


									<div style='position:absolute; right:0;'  >
										<v-btn icon small class='black' @click='thumbImg = null'>
											<v-icon class='white--text'>clear</v-icon>
										</v-btn>
									</div>


									<img  style='width:100%' :src='`http://localhost:3000/picture/${thumbImg}`'>
								</v-card>
								</v-scale-transition>
							</v-layout>
						</v-container>

						<v-container grid-list-xs>
							<v-icon>keyboard_arrow_right</v-icon>
							<span class="subheading">when do you want to post publish your quiz?</span>
						</v-container>

						<v-container>
						<v-layout>

						<!-- publish time -->
						<v-flex xs6>
						<v-menu
						   ref="menu"
						   lazy
						   :close-on-content-click="false"
						   v-model="timeMenu"
						   transition="scale-transition"
						   offset-y
						   full-width
						   :nudge-right="40"
						   max-width="290px"
						   min-width="290px"
						   :return-value.sync="picker"
						   :disabled='disableTime'
						 >
						   <v-text-field
						     slot="activator"
						     label="pick a time."
						     v-model="picker"
						     prepend-icon="access_time"
						     readonly
						     :disabled='disableTime'
						   ></v-text-field>
						   <v-card >

						   	<v-time-picker v-model="picker" @change="$refs.menu.save(picker)"></v-time-picker>
						   </v-card>

						 </v-menu>
						</v-flex>

						<v-flex xs6>
						    <v-select
						           :items="items"
						           v-model="day"
						           label="Select a day"
						           single-line
						           prepend-icon="date_range"
						           :disabled='disableDay'
						    ></v-select>

						</v-flex>
							</v-layout>

							<!-- publish now -->

							<p style='margin:auto;margin-left:40px;'>
								<a  @click='publishRightAfter'>({{!publishNow?`publish right after creating quiz?`:`edit time`}})</a>
								<span v-show='publishNow' class='body-1 grey--text'>quiz will publish right after you create.</span>
							</p>

						</v-container>

						<!-- quiz duration time -->
						<v-container grid-list-xs>
							<v-icon>keyboard_arrow_right</v-icon>
							<span class="subheading">Select quiz duration</span>
						</v-container>

						<v-container>

							<v-select
						           :items="durations"
						           v-model="dur"
						           label="Select quiz duration time"
						           single-line
						           prepend-icon="date_range"
						    ></v-select>

						</v-container>


						<v-layout>

							<v-btn block class='indigo white--text' :disabled='!basicJf' @click='showBasic = false'>
								next
							</v-btn>
						</v-layout>
					</v-container>
				</v-card>




				<!-- input box for title -->
				<v-slide-y-transition>

						

				<div class='white' v-show='!showBasic'>

				      	<!-- type of the question block -->
						<v-card>
						<v-container grid-list-xs>
							<v-icon>keyboard_arrow_right</v-icon>
							<span class="subheading">Choose Question Type...</span>
						</v-container>

						<v-layout row wrap>


							<v-flex xs6 justify-center>
								<v-btn block class='indigo' dark @click='multiOpction = true , feelBlank = false'>
									multipule choice &nbsp
									<v-icon>list</v-icon>
								</v-btn>
							</v-flex>


							<v-flex xs6 justify-center  @click='feelBlank = true, multiOpction = false'>
								<v-btn block class='indigo' dark>
									feel in the blank &nbsp
									<v-icon style ='font-size:12px; margin-top:10px;' >remove</v-icon>
									<v-icon style ='font-size:12px; margin-top:10px;' >remove</v-icon>
									<v-icon style ='font-size:12px; margin-top:10px;' >remove</v-icon>
									?
								</v-btn>
							</v-flex>
						</v-layout>
						</v-card>
					<v-layout>

						<!-- question numbers.... -->
					<div class="indigo" style="color: rgba(255, 255, 255, 1);" >

    					<div :style="parseInt($route.params.id) === 1 ?`padding: 8px 8px 8px 48px`:null">
    						
    					<v-btn @click='currentQuestion("backward")' v-show='parseInt($route.params.id) === 1 ?false:true' dark icon>
    						<v-icon>keyboard_backspace</v-icon>
    					</v-btn>
						<span class="subheading">Question - {{$route.params.id}}</span>

						&nbsp
						</div>
					</div>
					<!-- triangle css -->
					<div style="flex-shrink: 0;overflow: hidden;position: relative;width: 18px;">

						<svg style='height: 100%;overflow: visible;position: absolute;width: 90%;' xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 10 10" preserveAspectRatio="none" class="freebirdMaterialHeaderbannerSectionTriangle">

							<polygon class='indigo' style='fill: #3F51B5;stroke: #3F51B5;' points="0,0 10,0 0,10"></polygon></svg>

					</div>
					<v-spacer></v-spacer>


					<!-- forwerd arrow -->
					<v-btn @click='currentQuestion("forwerd")' v-show='forwardNav' icon light >
						<v-icon>arrow_forward</v-icon>
					</v-btn>

					</v-layout>

				<!-- title	 -->
		      	<v-card class='transparent' style='margin-top:3px;' v-show='multiOpction'>
		      		<v-container>
			        <div class='title'>
						<v-text-field
						 multi-line
						 hide-details
						 v-model='title'
						 placeholder='title or question'
						></v-text-field>
					</div>
					</v-container>
				</v-card>

				<v-card class='transparent' v-show='multiOpction || feelBlank'>
					<!-- image upload btn main post-->
					<v-layout v-show='!imageUploadWrap'>
						<v-container>
							<v-icon>keyboard_arrow_right</v-icon>
							<v-btn flat  @click='imageUploadWrap = true'>
								<v-icon>add_a_photo</v-icon>
							&nbsp Add image
							</v-btn>
							&nbsp
							<span class="caption grey--text">* optional *</span>
						</v-container>
					</v-layout>

					<div v-show='imageUploadWrap'>
						<div style='position:absolute; right:0;'>
							<v-btn icon  @click='imageUploadWrap = false'>
								<v-icon >cancel</v-icon>
							</v-btn>
						</div>

						 <vue-dropzone v-show='dz' @vdropzone-success="imageUpload" ref="quizDropzone" id="myVueDropzone2" :options="dropzoneOptions"></vue-dropzone>


		    			<div v-show='!dz' style="line-height:0;">
		    				<div style='position:absolute; right:0;'>
				    			<v-btn fab dark small class='red'  @click.native='imageCancel'>
				    			     <v-icon dark>remove</v-icon>
				    			</v-btn>
				    		</div>
			    			<img :src='uploadedImage' style="width:100%"/>
		    			</div>
	    			</div>
				</v-card>


				<!-- option block -->
				<v-card class='transparent' v-show='multiOpction'>
					<v-container>

						<v-layout row wrap justify-center>
						<template v-for='(i,index) in option'>
							<v-flex xs10>

						<v-btn block>{{i.text}}</v-btn>
						</v-flex>

							<v-btn icon @click='option.splice(index, 1)'><v-icon>cancel</v-icon></v-btn>

						</template>
					</v-layout>


					<!-- input submut for multipule options  -->
					<span class="caption grey--text">* Each option have 30 Charater limit and every question must have 2 options.*</span>
					<v-layout>
					<v-text-field class='elevation-1 op'
							v-show='option.length < 4'
			                 placeholder="write your options"
			                 single-line
			                 full-width
			                 hide-details
			                 v-model='optionText'
			                 @keyup.enter="addOption"
			                 maxlength="30"
			                 ref='blank'
			                 append-icon='done'
			                 :append-icon-cb='addOption'
					></v-text-field>

					</v-layout>

					<br>
					<v-icon>keyboard_arrow_right</v-icon>
					<span class="subheading">{{option.length >1?'What is the answer of your question?':'provide at last 2 options to create a question.'}}</span>
					<br><br>

							<v-select	 :disabled='option.length < 2'
							             v-bind:items="option"
							             v-model="multipuleChoiceAns"
							             label="Select your correct answer"
							             class="input-group--focused"
							             item-value="label"
							></v-select>



						<v-layout>	
						<v-spacer></v-spacer>

						<v-btn light  class='indigo white--text' @click='sendMultipuleOption' :disabled='option.length > 1 && multipuleChoiceAns !== "" && title !== ""?false:true' style='margin-top:22px;' >
								next

								<v-icon>keyboard_arrow_right</v-icon>
						</v-btn>

						</v-layout>
					</v-container>


				</v-card>


				<!-- feel in the blank block -->
				<v-card class='transparent' v-show='feelBlank'>

					<v-layout v-show='!blankCaptionShow'>
						<v-container >
							<v-icon>keyboard_arrow_right</v-icon>
						<v-btn flat @click='addBlankCaption'><v-icon>format_quote</v-icon>add caption</v-btn>
						<span class="caption grey--text">* optional *</span>
						</v-container>

					</v-layout>

					<v-container v-show='blankCaptionShow'>	
						<v-text-field class='elevation-1'
		                  label="write caption here!"
		                  single-line
		                  full-width
		                  hide-details
		                  ref='blankCaption'
		                  v-model='blankCaption'
		                  append-icon='cancel'
		                  :append-icon-cb='cancelCaption' 
						></v-text-field>

					</v-container>
					

					<v-container>
						        <div class='feelBlank'>
									<v-text-field
									 multi-line
									 hide-details
									 v-model='feelBlankInput'
									 placeholder='write your sentence here...'
									 autofocus
									></v-text-field>
								</div>

								<br>
								<v-layout>
								<v-spacer></v-spacer>
								<v-btn class='indigo' dark @click='addblank'>Add blank here</v-btn>
								</v-layout>
								<!-- answer input for feel in the blank  -->
								<div v-show='feelBlankInput.split(" [__blank__] ").length -1 !== 0'>
								<br>
									<v-icon>keyboard_arrow_right</v-icon>
									<span class="subheading">provide answers below...</span>
									<br><br>
								</div>

								<template v-for='i in feelBlankInput.split(" [__blank__] ").length -1'>

									<v-text-field class='elevation-1'
					                  :label="`submit blank number ${i} answer here`"
					                  single-line
					                  full-width
					                  hide-details
					                  v-model='feelBlankAns[-1 + i].answer'
									></v-text-field>
									<br>
								</template>

								<br>

								<v-spacer></v-spacer>

								<v-layout>
									<v-spacer></v-spacer>
									<v-btn @click='sendFeelBlank' class='indigo white--text' :disabled="blankSend">
										next
										<v-icon>keyboard_arrow_right</v-icon>
									</v-btn>
									
								</v-layout>
					</v-container>

					<!-- answer input -->


					<!-- preview -->
					<v-container v-show='feelBlankInput.length > 0?true:false'>
						<span class="title">preview</span><br>
						<v-container>
							<span class="subheading" v-html='blankOutput'></span>
						</v-container>
					</v-container>

				</v-card>


				<!-- information about next question and submit button -->
				<v-card class='transparent' v-show='!multiOpction && !feelBlank'>
					<v-container>
						<v-layout justify-center>
							<v-icon></v-icon>
							<div v-show=' questions.length <= 2'>
							<span class="headline text-xs-center grey--text">{{ questions.length === 0? `create your 1st question`:`create a ${ 3 - questions.length} more question`}}</span>
							</div>

							<div v-show=' questions.length > 2'>
								<span class="title grey--text"> you can create even more questions </span>
								<v-layout justify-center>
									<br> <span class="title grey--text text-xs-center">or</span> <br>
								</v-layout>

								<v-layout justify-center>
									<v-btn class='indigo white--text' @click='finalQuiz'> submit your quiz </v-btn>
								</v-layout>
							</div>

						</v-layout>
					</v-container>
				</v-card>
				</div>
			</v-slide-y-transition>

			<thumbUpload></thumbUpload>

				<v-layout>
					<v-spacer></v-spacer>
					<span class="caption grey--text">* every quiz must have at last 3 Question *</span>
				</v-layout>
		      </v-flex>
		  </v-layout>
	  	</v-container>
	</v-app>
</template>

<script>

import vue2Dropzone from 'vue2-dropzone'
import 'vue2-dropzone/dist/vue2Dropzone.css'
import moment from 'moment';
const thumbUpload = () => import('./thumbUpload');

export default{
	components:{
		thumbUpload,
		vueDropzone: vue2Dropzone
	},
	data(){
		return{
			e1:null,
			title:'',
			multiOpction:false,
			feelBlank:false,
			blankCaptionShow:false,
			optionText:'',
			option:[],
			dz:true,
			uploadedImage:null,
			imageUploadWrap:false,
			feelBlankInput:'',
			lastLength:0,
			blankOutput:'',
			imageId:null,
			multipuleChoiceAns:'',
			feelBlankAns:[],
			questions:[],
			questionNo:1,
			forwardNav:false,
			blankCaption:null,
			blankSend:false,
			// thumb
			thumPop:true,
			thumbImg:null,
			dropzoneOptions: {
				          url: `${this.$store.state.server}picture/upload`,
				          thumbnailWidth: 150,
				          maxFilesize: 20,
				          dictDefaultMessage: "Drop or Click here to Upload image!"
			},

			// v-time-picker
			timeMenu:false,
			picker:null,
			items: [
			       { text: 'today' },
			       { text: 'tomorrow' },
			       { text: 'day after tomorrow' }
			     ],
			durations:[
					{ text: '1 day' },
					{ text: '3 days' },
					{ text: '1 week' }
			],
			// date 
			day:null,
			toDay:null,
			dayMenu:null,
			// title
			quizTitle:'',
			// duration time
			dur:null,
			// basic
			showBasic:true,
			basicJf:false,
			// publish now
			publishNow:false,
			disableTime:false,
			disableDay:false,
			// dates and time
			timeZone:null,
			startDate:null,
			duration:null
		}
	},
	watch:{
		title(i){
			this.textareaResize(document.querySelector('.title textarea'))
		},
		feelBlankInput(i){

			this.textareaResize(document.querySelector('.feelBlank textarea'))

			this.finalOutput()

		},
		"$route.params.id":function(i){
			this.routeControl();
			parseInt(this.$route.params.id) - 1 === this.questions.length?this.forwardNav = false : this.forwardNav = true;
		},
		feelBlankAns(i){
			console.log(i);
		},
		quizTitle(){
			this.basicInfoJustify()
		},
		day(i){
			this.basicInfoJustify()

			let addDay = (day)=>{
				return moment().add(day, 'days').format('YYYY MM DD')
			}

			if(i){
				let d = i.text === 'today'?0:i.text === 'tomorrow'? 1:2;
				this.startDate = addDay(d);
			}


		},
		picker(i){
			this.basicInfoJustify()
		},
		dur(i){
			this.basicInfoJustify()
			let finalDur = i.text === '1 day'?1:i.text === '3 days' ? 3 :i.text === '1 week'?7:null; 
			this.duration = finalDur;
		},
		publishNow(i){
			this.basicInfoJustify();
		}
	},
	methods:{
		test(){

		},
		publishRightAfter(){
			this.publishNow = !this.publishNow;

			if(this.publishNow){
				this.disableTime = true;
				this.disableDay = true;	
				this.day = null;
				this.picker = null;
			}else{
				this.disableTime = false;
				this.disableDay = false;
			}
		},
		basicInfoJustify(){

			const wrap = (exicute)=>{
				this.basicJf = exicute;	

				console.log(this.quizTitle ,this.day, this.picker,  this.dur)
				let dt = moment(this.picker, ["hh:mmA"])
				let crTime = dt.diff(moment());

				if(this.day){
					if(crTime < 0 && this.day.text === 'today'){
						setTimeout(()=>{
							this.day = null;
						},200)	
						this.$store.commit('sn',{context:'error',snac:'you can\'t post in past! change a valid time.'});	
					}
				}

				return exicute;
			}


			
			if(!this.publishNow){
				let exicute = this.quizTitle !== '' && this.day !== null && this.picker !== null && this.dur !== null; 
				wrap(exicute)

			}else{

				let exicute = this.quizTitle !== '' && this.dur !== null; 
				wrap(exicute)
			}	 

		},
		routeNav(num){
			let route = parseInt(this.$route.params.id);
			let final = route + num
			let push = final.toString()
			console.log(push)
			this.$router.push(push);

		},
		imageUpload(i,r){
			console.log(r)
			this.dz = false;
			this.uploadedImage = `${this.$store.state.server}picture/${r.imageId}`;
			this.imageId = r.imageId;
		},
		imageCancel(){
		    this.dz = true;
		    this.uploadedImage = false;
		    this.$refs.quizDropzone.removeAllFiles();
			this.upload = '';

		},
		textareaResize(el){
			setTimeout(function(){
			   el.style.cssText = 'height:auto; padding:0';
			   // for box-sizing other than "content-box" use:
			   el.style.cssText = '-moz-box-sizing:content-box';
			   el.style.cssText = 'height:' + el.scrollHeight + 'px';
			 },0);

		},
		addOption(){
			let data = {
				text:this.optionText
			}

			document.querySelector('.op input').focus();
			this.optionText === '' ? null : this.option.push(data);
			this.optionText = '';

		},
		addblank(){
			document.querySelector('.feelBlank textarea').focus()
			if(this.lastLength === 0 || this.lastLength !== this.feelBlankInput.length){
			this.feelBlankAns.push({number:this.feelBlankAns.length,answer:''})
			this.feelBlankInput += ' [__blank__] '
			document.querySelector('.feelBlank textarea').focus()
			this.lastLength = this.feelBlankInput.length;

			}
		},
		finalOutput(){
			
			let split = this.feelBlankInput.split(' [__blank__] ');
			this.blankOutput = split.join(`&nbsp <input type='text' class='blankinp' placeholder='type your answer...'> &nbsp`);

		},
		mqClean(){
			this.title = '';
			this.multiOpction = false;
			this.optionText = '';
			this.imageId = null;
			this.multipuleChoiceAns = '';
			this.option = [];
			this.questionNo = this.questions.length + 1;
			this.imageCancel();
			this.imageUploadWrap = false
		},
		sendMultipuleOption(){

			let data = {
				options:this.option,
				imageId:this.imageId,
				question:this.title,
				answer:this.multipuleChoiceAns.text,
				type:'multipule_choice',
				id:this.$route.params.id
			}

			// checking if user has allredy created forward question or not?
			if(parseInt(this.$route.params.id) - 1 >= this.questions.length){
				this.questions.push(data);
				this.routeNav(1)
				this.mqClean();
			}else{
				this.currentQuestion('forwerd');
			}	

			console.log(data);
		},
		fbClean(){
			this.feelBlank = false;
			this.feelBlankInput = '';
			this.lastLength = 0;
			this.blankOutput = '';
			this.imageId = null;
			this.feelBlankAns = [];
			this.addBlank = false;
			this.lastLength = 0;
			this.imageCancel();
			this.imageUploadWrap = false;
			this.blankCaption = null;

		},
		mqFeel(data){

			if(data.type === 'multipule_choice'){
				this.multiOpction =true;
				this.feelBlank = false;
				this.title = data.title;
				this.imageId = data.imageId;
				this.option = data.options;
				this.multipuleChoiceAns = data.answer;

				if(this.imageId !== null){
					this.imageUpload(null,{imageId:data.imageId})
				}
			}

		},
		sendFeelBlank(){
			let split = this.feelBlankInput.split(' [__blank__] ')
			let data = {
				blank:split,
				imageId:this.imageId,
				caption:this.blankCaption,
				answers:this.feelBlankAns,
				type:'feel_blank',
				id:parseInt(this.$route.params.id)
			}

			// checking if user has allredy created forward question or not?
			if(parseInt(this.$route.params.id) - 1 >= this.questions.length){
				this.questions.push(data);
				this.routeNav(1)
				this.fbClean();
			}else{
				this.currentQuestion('forwerd');
			}	
			console.log(data);
		},
		addBlankCaption(){
			this.$refs.blankCaption.focus();
			this.blankCaptionShow = true;
		},
		cancelCaption(){
			this.blankCaptionShow = false;
			this.blankCaption = '';
		},
		justifyFb(){

			// nothing is imposible

			// cheking if the answer is emoty or not and storing in array
			let justify = this.feelBlankAns.map(d=>{
				return d.answer !== ''
			})

			// seprating all array	
			let final = justify.map(d=>{
				return d === true
			})

			// if all values are true then exicue true else false
			let value = (val) =>{
				return val === true
			}
			let exicute = this.feelBlankAns.length === 0 ? false : final.every(value)
			!exicute?this.blankSend = true : this.blankSend = false;
		},
		bfeel(data){
			if(data.type === 'feel_blank'){
				this.feelBlank = true;
				this.multiOpction = false;
				this.imageId = data.imageId;

				console.log(data.caption);

				if(data.caption){
					data.caption.length > 0 ?( this.blankCaptionShow = true , this.blankCaption = data.caption ): this.blankCaptionShow = false;
				}else{
					this.blankCaptionShow = false;
				}
				this.feelBlankInput = data.blank.join(' [__blank__] ');
				this.feelBlankAns = data.answers;


				if(this.imageId !== null){
					this.imageUpload(null,{imageId:data.imageId})
				}
			}
		},
		currentQuestion(arg){
			if(arg === 'forwerd'){
				this.routeNav(1);
				if(parseInt(this.$route.params.id) - 1 >= this.questions.length){
					this.mqClean();
					this.fbClean();
					console.log('para',parseInt(this.$route.params.id),'length',this.questions.length)
				}else{
					let data = this.questions[parseInt(this.$route.params.id) -1];
					this.mqFeel(data);
					this.bfeel(data);
				}
			}



			if(arg === 'backward'){
				this.routeNav(-1);
				let data = this.questions[parseInt(this.$route.params.id) - 1];
				console.log(data);
				this.mqFeel(data);
				this.bfeel(data);
			}
		
		},

		routeControl(){
			if (parseInt(this.$route.params.id) - 1 >= 0 && parseInt(this.$route.params.id) - 1 <= this.questions.length){
				console.log('valid')
			}else{
				console.log('not valid')
				this.$router.push('1');
			}
		},
		finalQuiz(){
			const tnd = `${this.startDate} ${this.picker}`
			const tStamp = moment(tnd,['YYYY MM DD hh:mmA']).toISOString()

			let data = {
				creator:this.$store.getters.id,
				questions:this.questions,
				title:this.quizTitle,
				startTime:this.picker,
				startDate:this.startDate,
				duration:this.duration,
				timeZone:this.timeZone,
				thumbnail:this.thumbImg,
				startStamp:tStamp
			}




			this.$axios.post(`${this.$store.state.server}quiz/submit`,data,this.$store.getters.auth).then(r=>{

				this.$socket.emit('userQuizSubmited',r.data);

				console.log(r.data);
			}).catch(e=>{
				console.log(e)
			})


		}

	},
	created(){

		this.$axios.get(`${this.$store.state.server}quiz/get/5aae49a9274c8c13526674b5`,this.$store.getters.auth).then(r=>{
			console.log(r.data);
		}).catch(e=>{
			console.log(e);
		})

		this.routeControl();

		this.$bus.$on(`thumb_uploaded`,r=>{
			this.thumbImg =  r.thumb;
		})

		this.timeZone = moment().zone();



	},
	updated(){
		this.justifyFb();
	}	
}
	
</script>

<style>

.title textarea{
	font-size: 34px !important;
	overflow:hidden;
	min-height: 64px;
	line-height: 135%;
	height: 51px;
}

.feelBlank textarea{
	font-size: 34px !important;
	overflow:hidden;
	min-height: 64px;
	line-height: 135%;
	height: 51px;
}

.blankinp {
background-color: transparent; 
border-style: solid; 
border-width: 0px 0px 2px 0px; 
min-width: 30px;
margin:2px;
width: 200px;
}
</style>