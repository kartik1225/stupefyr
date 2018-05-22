<template>

	<v-layout justify-center >

		 <v-dialog persistent v-model="pop" :fullscreen='$vuetify.breakpoint.width < 400 ' :max-width="400" >
		<v-card  style='max-width:400px;' >


			<div :style="$vuetify.breakpoint.width > 400?`height:auto`:`height:${$vuetify.breakpoint.height - 64}px;overflow:auto;`">
			<v-card>


				<v-layout >
					<v-container grid-list-md>
					&nbsp<span class="title"> create a pole</span>
				</v-container>
					<v-spacer></v-spacer>
					<v-btn v-show='$vuetify.breakpoint.width < 400 ' @click='finalFunction' flat>
						done
					</v-btn>

				</v-layout>
			</v-card>


			<!-- image handler -->
				<v-layout  class='elevation-1'  style='max-width:400px;position:relative;'>

					<!-- image input buttun -->
					<div v-show='addImageShow'  :style="addImageChangeCss?`right:0;bottom:0;position:absolute;`:`position:absolute;left: 50%; bottom:50%;transform: translate(-50%, 0);`">
						<v-btn @click='addImageHandler' class='white' :fab='addImageChangeCss' :flat='!addImageChangeCss' :small='addImageChangeCss' :icon='!addImageChangeCss'>
							<v-icon>add_a_photo</v-icon>
						</v-btn>
					</div>

					<!-- image upliad 1 -->
					<div class='grey lighten-3' style="width:100%;">

						<!-- image1 remove btn  -->
						<div v-show='img1clear' style="width:100%; position:relative" >
							<div style='position:absolute; right:0px;'>
								<v-btn @click='imageRemove("image1")' fab class='grey lighten-4' small style='height:23px;width:23px;'  >
								  <v-icon>clear</v-icon>
								</v-btn>
							</div>
						</div>

						<div style="max-height:240px;">
							<!-- image1 canvas -->
							<croppa align='center' ref='image1' v-model="image1"  :width="multiImageShow?400:800" class="croppa"
							                :height="480" :disable-scroll-to-zoom="true"
							                :prevent-white-space="true"
							                :input-accept="'image/*'"
							                name='file'
							                :show-remove-button="false"
							                style='height:100%;'
							                :placeholder="'Choose an image (optional)'"
							                @file-choose='(addImageChangeCss = true,img1clear = true)'
							                :placeholder-font-size="30"
							                >
							</croppa>
						</div>	
					</div>

					<!-- image upload 2 -->
					<div class="grey lighten-4" style="width:100% " v-show='multiImageShow'>

						<!-- image2 remove btn 2-->
						<div v-show='img2clear' style='position:absolute; right:0px;'>
							<v-btn fab @click='imageRemove("image2")' class='grey lighten-4' small style='height:23px;width:23px;'  >
							  <v-icon>clear</v-icon>
							</v-btn>
						</div>


						<div style="max-height:240px;">
							<!-- image2 canvas -->
							<croppa align='center' ref='image2' v-model="image2"  :width="multiImageShow?400:800" class="croppa"
							                :height="480" :disable-scroll-to-zoom="true"
							                :prevent-white-space="true"
							                :input-accept="'image/*'"
							                name='file'
							                :show-remove-button="false"
							                style='height:100%;'
							                @file-choose='(poleMultiImage = false , img2clear = true)'
							                >
							</croppa>

						</div>

					</div>
				</v-layout>


			<!-- input pole handler -->
			<v-layout :column='noOfPole > 2' >


				<!-- pole input loop -->
				<template v-for='(pole,i) in noOfPole'>
					<div :style='noOfPole > 2?`width:100%`:`width:50%`' class="white elevation-1">

						<v-text-field 
						  class='elevation-0'
			              :label="`write pole ${pole} here..`"
			              single-line
			              full-width
			              hide-details
			              v-model='poleInput[i]'
			              :append-icon='noOfPole === 2 ? null:`cancel`'
			              :append-icon-cb="function() {poleInput.splice(i, 1); noOfPole -= 1}"
			            ></v-text-field>

					</div>
				</template>

			</v-layout>

			<!-- add pole btn -->
			<v-layout v-show='noOfPole < 6'>
				<v-spacer></v-spacer>
				<v-btn v-show='poleMultiImage' :disabled='!poleBtnDisabled' flat @click='addPole'>add pole</v-btn>
			</v-layout>

		</div>

		<v-layout>
			<v-spacer></v-spacer>
			<div :style='$vuetify.breakpoint.width > 400?`position:relative;`:`position:absolute; right:0; bottom:0;`'>
				<v-btn class='red--text' @click='warning = true' flat>
					cancel
				</v-btn>

				<v-btn :disabled='!poleBtnDisabled' @click='finalFunction' :loading='loading' flat>
					done
				</v-btn>
			</div>

			<!-- warning dialog -->
			<v-dialog :max-width='210' v-model='warning'>
				<v-card>
				<v-container>
				<p class="body-2 text-xs-center">All deta will be removed!</p>
				</v-container>
				<v-divider></v-divider>
				<v-layout>
					<!-- cancel btn -->
					<v-btn @click='cancel()' flat error>
						remove
					</v-btn>

					<!-- keep btn -->
					<v-btn @click='warning = false' flat>
						keep
					</v-btn>
				</v-layout>
					
				</v-card>
			</v-dialog>


		</v-layout>
	</v-card>
	</v-dialog>
		</v-layout>

</template>

<script>


	export default{
		data(){
			return{
				// other
				pop:false,
				// image
				image1:null,
				img1clear:false,
				image2:null,
				img2clear:false,
				resizeCroppa:false,
				multiImageShow:false,
				addImageShow:true,	
				addImageChangeCss:false,
				// after image uploaded
				image1Id:null,
				image2Id:null,
				// input pole
				noOfPole:2,
				poleInput:[],
				poleBtnDisabled:true,
				poleMultiImage:true,
				// done
				loading:false,
				doneDisabled:true,
				// warning
				warning:false
			}
		},
		watch:{
			poleInput:function(i){
				// handle and justify add pole visibility by exicute variable

				this.poleBtnHandler();


			},
			noOfPole(i){
				// handle addimage buttun visibility
				let hasImage = this.image1.hasImage();
				i > 2 && hasImage ? this.addImageShow = false : this.addImageShow = true; 

			},
			multiImageShow(i){
				// handle pole buttun visibility 
				i?this.poleMultiImage = false:this.poleMultiImage = true;
			}
		},
		methods:{	
			addImageHandler(){
				// this function handle image uploading add buttun css positioning

				let hasImage = this.image1.hasImage();

				if(this.noOfPole === 2){
					if(hasImage){
						this.multiImageShow = true;
						this.$refs.image2.chooseFile();
						this.addImageShow = false;

					}else{
						this.$refs.image1.chooseFile();


					}	
				}else{
					this.$refs.image1.chooseFile();
					this.img1clear = true;
					this.addImageShow = false;
				}
				
			},
			poleBtnHandler(){
				let data = []
				for (var i = 0; i < this.poleInput.length; i++) {

					if(this.poleInput.length < 2){
						data.push(true);
					}else{

					let what = this.poleInput[i] === undefined || this.poleInput[i] === ''
					data.push(what)
					console.log('this is',this.poleInput.length);

					}

				}
				// every lopp checking every element is false or true?
				let exicute =data.every((item)=>{
					// console.log(item);
					return item === false
				})

				this.poleBtnDisabled = exicute;
			},
			addPole(){
				// this function handle adding pole and justify

				// verifying last element of the arrey is String or not in pole's arrey
				if(typeof this.poleInput[this.poleInput.length -1] ===  'string'){
					this.noOfPole += 1 
				}
				this.poleBtnDisabled = false;
			},
			imageRemove(img){
				// remove image1 and image2
				if(img === 'image1'){
					// if image1 got cenceled then both image will be removed 
					this.img1clear = false;
					this.addImageShow = true;
					this.addImageChangeCss = false;
					this.image1.remove();
					this.image1Id = null;
					this.image2Id = null;
					this.multiImageShow = false;
					this.image2.remove()
				}

				// remove image2
				if(img === 'image2'){
					this.img2clear = false;
					this.multiImageShow = false;
					this.addImageShow = true;
					this.image2.remove()
					this.image2Id = null
				}
			},
			cancel(){
				this.imageRemove('image1');
				this.poleInput = [];
				this.noOfPole = 2;

				// closing dialogs
				this.warning = false;
				this.pop = false;

				// emiting event which set pole to default 
				this.$bus.$emit('poleData',null)

			},
			finalFunction(){
				let hasImage1 = this.image1.hasImage();
				let hasImage2 = this.image2.hasImage();

				let final = {
					imgs:[],
					poles:this.poleInput
				}

				//activate loading 
				this.loading = true;

				// for image1
				 if(hasImage1){
					const orignal =this.image1.getChosenFile();
					// getting current visible aria blob
					this.image1.generateBlob((blob) => {
					  const orignal =this.image1.getChosenFile()
					  const data = new FormData()
					    data.append("file", blob ,orignal.name);

					      // savig current image to database 
					          this.$axios.post(`${this.$store.state.server}picture/upload`,data,{
					          headers: {
					            'Content-Type': 'multipart/form-data'
					          }
					        }).then(r=>{


					        	console.log('IMAGE1',r.data)

					        	this.image1Id = r.data.imageId;

					        	final.imgs.push(r.data.imageId);

					        	console.log('1',final)


					        	// for image2 --------------------------------------------------------
					        	if(hasImage2){
					        		const orignal =this.image2.getChosenFile();
					        		// getting current visible aria blob
					        		this.image2.generateBlob((blob) => {
					        		  const orignal =this.image2.getChosenFile()
					        		  const data = new FormData()
					        		    data.append("file", blob ,orignal.name);

					        		      // savig current image to database 
					        		          this.$axios.post(`${this.$store.state.server}picture/upload`,data,{
					        		          headers: {
					        		            'Content-Type': 'multipart/form-data'
					        		          }
					        		        }).then(r=>{



					        		        	console.log('IMAGE2',r.data)
					        		        	this.image2Id = r.data.imageId

					        		        	final.imgs.push(r.data.imageId);

					        		        	console.log('2',final)

					        		        	// deactivate loading
					        		        	this.loading = false;

					        		        	// close dialog
					        		        	this.pop = false;
					        		        	//sending data to parent component
					        		        	this.$bus.$emit('poleData',final)

					        		          }).catch(e=>{
					        		            //server error
					        		            console.log(e)
					        		            this.$store.commit('sn',{snac:'server error , try again',context:'error'})
					        		          })

					        		}, orignal.type) 
					        	}else{
					        		// deactivate loading
					        		this.loading = false;

					        		//close dialog
					        		this.pop = false;

					        		this.$bus.$emit('poleData',final)

					        	}

					        	// ----------------------------------------------------------------------------------

					          }).catch(e=>{

					            //server error
					            console.log(e)
					            this.$store.commit('sn',{snac:'server error , try again',context:'error'})
					          })

					}, orignal.type) 
				}else{
					// without image
					this.$bus.$emit('poleData',final)
					// deactive loading
					this.loading = false;
					this.pop = false;


				}



			}

		},
		updated(){

				this.poleInput[0] === undefined?this.poleBtnDisabled = false:null;

		},
		created(){
			this.poleBtnDisabled = false;
			this.$bus.$on('showDebate',(r)=>{
				this.pop = r;
			})

			this.$bus.$on('poleCancel',(r)=>{
				this.cancel();
			})
		}
	}

	
</script>

<style>
 canvas{
 	width: 100% !important;
 	height: 100% !important;
}

	
</style>