
<!--return data in event bus 'cast_added' -->
<!-- to pop up addCastPop -->
<template>

	<div>	
		
		<!-- add poster image dialog -->
		<v-dialog persistent v-model='posterCanvasDialog' max-width='400px'>
			<v-card>
				<v-container grid-list-md >
					<span class="title grey--text">Upload a movie poster</span>
				</v-container>

				<v-divider></v-divider>

				<!-- canvas -->
				<div class="posterCanvas" style="position:relative;">

					<v-fab-transition>
						<div style="position:absolute; right:0;" v-show='posterRemoveShow'>
							<v-btn icon small class='black' @click='posterRemove'>
								<v-icon class='white--text'>clear</v-icon>
							</v-btn>
						</div>
					</v-fab-transition>

					<croppa ref='posterCanvas'
							v-model="posterCanvas"
					        :width="500"
					        :height="700"
					        placeholder="Click to Upload (image should be portrait)"
					        :placeholder-font-size="24"
					        :disabled="false"
					        :prevent-white-space="true"
					        :disable-drag-and-drop="true"
					        :show-remove-button="false"
					        @file-choose="posterImageChoose"
					        >
					</croppa> 
				</div>
				<v-divider style='margin-top:-6px;'></v-divider>

				<v-card-actions >
					<v-spacer></v-spacer>
					<v-btn flat error @click='posterWarning = true'>cancel</v-btn>
					<v-btn flat :loading='poster_loading' :disabled='poster_disabled' @click='uploadPoster'>
						upload &nbsp <v-icon>file_upload</v-icon>
					</v-btn>
				</v-card-actions>
			</v-card>

			<!-- warning dialog -->
			<v-dialog persistent :max-width='210' v-model='posterWarning'>
				<v-card>
				<v-container>
				<p class="body-2 text-xs-center">All deta will be removed!</p>
				</v-container>
				<v-divider></v-divider>
				<v-layout>
					<!-- cancel btn -->
					<v-btn @click='posterCancel()' flat error>
						remove
					</v-btn>

					<!-- keep btn -->
					<v-btn @click='posterWarning = false' flat>
						keep
					</v-btn>
				</v-layout>
					
				</v-card>
			</v-dialog>

		</v-dialog>

	</div>

</template>

<script>

export default {
	data(){
		return{
			// poster 
			posterCanvas:null,
			posterCanvasDialog:false,
			posterId:null,
			poster_loading:false,
			poster_disabled:false,
			posterRemoveShow:false,
			posterWarning:false
		}
	},
	methods:{
		remove(item) {
	        this.chips.splice(this.chips.indexOf(item), 1)
	        this.chips = [...this.chips]
      	},
      	posterImageChoose(){
      		this.posterRemoveShow = true;
	      	let hasImage = this.posterCanvas.hasImage();

	      	setTimeout(()=>{
	      		hasImage?this.poster_disabled = true: this.poster_disabled = false;
	      	},300)
	      	

      	},
      	posterRemove(){
      		this.posterCanvas.remove();
      		this.posterRemoveShow = false;
      		this.posterId = null;
      		this.poster_disabled = true;
      	},
      	posterCancel(){
      		this.posterRemove();
      		this.posterCanvasDialog = false;
      		this.posterWarning = false;
      	},
      	uploadPoster(){

      		let hasImage = this.posterCanvas.hasImage();
      		if(hasImage){

	      		// initinate loading
	      		this.poster_loading = true;

	      		const orignal =this.posterCanvas.getChosenFile();
	      		// getting current visible aria blob
	      		this.posterCanvas.generateBlob((blob) => {
	      		  const orignal =this.posterCanvas.getChosenFile()
	      		  const data = new FormData()
	      		    data.append("file", blob ,orignal.name);
	      		    console.log(data);
	      		      // savig current image to database 
	      		          this.$axios.post(`${this.$store.state.server}picture/upload`,data,{
	      		          headers: {
	      		            'Content-Type': 'multipart/form-data'
	      		          }
	      		        }).then(r=>{	
	      		 				
	      		        		this.poster_loading = false;
	      		        		this.posterId = r.data.imageId;

	      		        		this.posterCanvasDialog = false;
	      		        		this.$bus.$emit('poster_updated',this.posterId);

	      		        		console.log(this.posterId);



	      		          }).catch(e=>{
	      		            //server error
	      		            console.log(e)
	      		            this.$store.commit('sn',{snac:'server error , try again',context:'error'})
	      		          })
	      		}, orignal.type) 

      		}else{
      			this.poster_loading = false;
      			this.$store.commit('sn',{context:'error',snac:'image is not selected!'})
      		}
      	},
      	urlUpload(url,name){

      			let self = this;
      			if(url){

      				// got this from https://stackoverflow.com/questions/39592752/read-image-from-url-upload
      				function getImageFormUrl(url, callback) {
      				  var img = new Image();
      				  img.setAttribute('crossOrigin', 'anonymous');
      				  img.onload = function (a) {
      					var canvas = document.createElement("canvas");
      					canvas.width = this.width;
      					canvas.height = this.height;
      					var ctx = canvas.getContext("2d");
      					ctx.drawImage(this, 0, 0);

      					var dataURI = canvas.toDataURL("image/jpg");
      					  
      					// convert base64/URLEncoded data component to raw binary data held in a string
      					var byteString;
      					if (dataURI.split(',')[0].indexOf('base64') >= 0)
      						byteString = atob(dataURI.split(',')[1]);
      					else
      						byteString = unescape(dataURI.split(',')[1]);

      					// separate out the mime component
      					var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

      					// write the bytes of the string to a typed array
      					var ia = new Uint8Array(byteString.length);
      					for (var i = 0; i < byteString.length; i++) {
      						ia[i] = byteString.charCodeAt(i);
      					}

      					return callback(new Blob([ia], { type: mimeString }));
      				  }
      				  
      				  img.src = url;
      				}


      				getImageFormUrl(url, function (blobImage) {
      					var formData = new FormData();
      					formData.append('file', blobImage,name);

      					// uploading to stupefyr
      					console.log(blobImage,formData);
      				      // savig current image to database 
      				         self.$axios.post(`${self.$store.state.server}picture/upload`,formData,{
      				          headers: {
      				            'Content-Type': 'multipart/form-data'
      				          }
      				        }).then(r=>{	
      				 				
      	 			        		self.posterId = r.data.imageId
      				        		console.log(self.posterId);
      				        		self.$bus.$emit('poster_updated',self.posterId);


      				          }).catch(e=>{
      				            //server error
      				            console.log(e)
      				            self.$store.commit('sn',{snac:'server error , try again',context:'error'})

      				          })

      				});	

      			}

      		}
	},
	created(){
		this.poster_disabled = true;

		this.$bus.$on('posterPop',r=>{

			if(r === true){

			this.posterCanvasDialog = true;
			}else{
				this.urlUpload(r.poster_path?`https://image.tmdb.org/t/p/w780${r.poster_path}`:null,r.poster_path)
			}

		})
	}
}
</script>



<style >
	.posterCanvas canvas {
		width: 100% !important;
		height: 100% !important;
		background-color: #f5f5f5 !important;
	}

</style>