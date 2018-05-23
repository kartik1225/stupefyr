<template>
	<div>
		<v-dialog v-model='thumbPop' max-width='400px'>
			<v-card>
				<div class='thumbCanvas'>

				<v-fab-transition>
				<div style='position:absolute; right:0;' v-show='cancelBtnShow' >
					<v-btn icon small class='black' @click='removeImg'>
						<v-icon class='white--text'>clear</v-icon>
					</v-btn>
				</div>
				</v-fab-transition>
				<croppa ref='thumb'
						v-model="croppaThumb"
				        :width="640"
				        :height="480"
				        placeholder="Upload cover image (click to Choose)"
				        :placeholder-font-size="30"
				        :disabled="false"
				        :prevent-white-space="true"
				        :show-remove-button="false"
				         :disable-drag-and-drop="true"
				        @file-choose="thumbImageChoose"
				        >
				</croppa > 
				</div>

				<v-layout>
					<v-spacer></v-spacer>
					<v-btn small error flat @click='thumbPop = false'>
						cancel
					</v-btn>
					<v-btn small flat @click='uploadImg' :disabled='!hasImage' :loading='imgLoading'>
						upload
					</v-btn>
				</v-layout>


			</v-card>
		</v-dialog>
	</div>
	
</template>

<script>
	export default{
		data(){
			return{
				thumbPop:false,
				// croppa
				croppaThumb:null,
				cancelBtnShow:false,
				hasImage:false,
				imgLoading:false
			}
		},
		methods:{
			thumbImageChoose(file){
				this.cancelBtnShow = true;

				setTimeout(()=>{
					this.hasImage = this.croppaThumb.hasImage();
				},300)
			},
			removeImg(){
				this.croppaThumb.remove();
				this.cancelBtnShow = false;
				this.hasImage = this.croppaThumb.hasImage();

				setTimeout(()=>{
					this.hasImage = this.croppaThumb.hasImage();
				},300)

			},
			uploadImg(){
							let hasImage = this.croppaThumb.hasImage();
					      		const orignal =this.croppaThumb.getChosenFile();

					      		this.imgLoading = true;
					      		if(hasImage){
					      			// getting current visible aria blob
					      			this.croppaThumb.generateBlob((blob) => {
					      			  const orignal =this.croppaThumb.getChosenFile()
					      			  const data = new FormData()
					      			    data.append("file", blob ,orignal.name);

					      			      // savig current image to database 
					      			          this.$axios.post(`${this.$store.state.server}picture/upload`,data,{
					      			          headers: {
					      			            'Content-Type': 'multipart/form-data'
					      			          }
					      			        }).then(r=>{
					      			        	this.imgLoading = false;
					      			 			console.log(r.data);

					      			 			const data = {
					      			 				thumb:r.data.imageId
					      			 			}

					      			 			this.removeImg();

					      			 			this.$bus.$emit(`thumb_uploaded`,data);
					      			 			this.thumbPop=false;

					      			          }).catch(e=>{
					      			            //server error
					      			            console.log(e)
					      			            this.$store.commit('sn',{snac:'server error , try again',context:'error'})
					      			          })

					      			}, orignal.type) 
					      		}else{
					      			this.$store.commit('sn',{context:'error',snac:'image is not selected!'})
					      		}
			}
		},
		created(){
			this.$bus.$on(`thumb_pop`,r=>{	
				this.thumbPop = r;
			})
		}
	}
	
</script>

<style>
	.thumbCanvas canvas {
		width: 100% !important;
		height: 100% !important;
		background-color: #f5f5f5 !important;
	}
</style>