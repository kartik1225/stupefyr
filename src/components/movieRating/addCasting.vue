
<!-- event bus : return data 'cast_added' -->
<!-- event bus : to pop up addCastPop -->
<template>

	<div>	
		
		<!-- add casting dialog -->
		<!-- this dialog should retun casting json -->
		<v-dialog  v-model='castingDialog' max-width='400px'>
			<v-card>	

					<div class='castCanvas' style="position:relative; line-height:0">

						<v-fab-transition>
						<div style='position:absolute; right:0;'  v-show='castImgShow'>
							<v-btn icon small class='black' @click='castCanvasRemove'>
								<v-icon class='white--text'>clear</v-icon>
							</v-btn>
						</div>
						</v-fab-transition>
					<croppa ref='croppaCasting'
							v-model="croppaCasting"
					        :width="400"
					        :height="500"
					        placeholder="upload image of Charater (click to Choose)"
					        :placeholder-font-size="20"
					        :disabled="false"
					        :prevent-white-space="true"
					        :show-remove-button="false"
					         :disable-drag-and-drop="true"
					        @file-choose="castImageChoose"
					        >
					</croppa > 
					</div>

				<v-divider></v-divider>
				<v-text-field 
					single-line
					full-width
					hide-details
					placeholder='name of charater in the movie?'
					v-model='cast.charaterName'
				>	
				</v-text-field>
				<v-divider></v-divider>
				<v-text-field 
					single-line
					full-width
					placeholder='real name?'
					hide-details
					v-model='cast.realName'
				>	
				</v-text-field>

				
					<v-divider></v-divider>

					<v-layout>
						<p class="caption grey--text" style="margin-left:10px; margin-top:15px;" >* all filed and image required *</p>
					<v-spacer></v-spacer>
					<v-btn flat :loading='add_loading' :disabled='add_disabled' @click='addCast'>
						add
					</v-btn>
					</v-layout>

			</v-card>
		</v-dialog>

	</div>

</template>

<script>
import vue2Dropzone from 'vue2-dropzone'
import 'vue2-dropzone/dist/vue2Dropzone.css'

export default {
	components:{
		vueDropzone: vue2Dropzone
	},
	data(){
		return{
			// title
			title:'',
			// discription
			description:'',
			// castings
			castingDialog:false,
			croppaCasting:null,
			// genre
			chips: [],
			dropzoneOptions: {
			         url: 'https://httpbin.org/post',
			         thumbnailWidth: 150,
			         headers: { "My-Awesome-Header": "header value" },
			         dictDefaultMessage:'Upload a Movie Poster here'
			},
			size:'grid-list-md',
			// add castings
			cast:{
				charaterName:'',
				realName:'',
				profileImage:null
			},
			add_loading:false,
			add_disabled:true,
			castImgShow:false
		}
	},
	watch:{
		'$vuetify.breakpoint.width':function(i){

			i < 600? this.size = `grid-list-xs` : this.size = `grid-list-md`

		},
		title(i){
			if(this.$vuetify.breakpoint.width > 600){
				this.$txtRe(document.querySelector('.title textarea'))
			}else{

			this.$txtRe(document.querySelector('.title-sm textarea'))
			}
		},
		description(i){
			if(this.$vuetify.breakpoint.width > 600){
				this.$txtRe(document.querySelector('.descript textarea'))
			}else{

			this.$txtRe(document.querySelector('.descript-sm textarea'))
			}
		},
		'cast.charaterName'(i){
			this.castingJustify();
		},
		'cast.realName'(i){
			this.castingJustify();
		}	
	},
	methods:{

		remove(item) {
	        this.chips.splice(this.chips.indexOf(item), 1)
	        this.chips = [...this.chips]
      	},

      	castImageChoose(){
      		console.log('ok')
      		this.castImgShow = true;
      		setTimeout(()=>{

      		const orignal =this.croppaCasting.getChosenFile();
      		console.log(orignal);
	      		this.castingJustify();
      			
      		},300)
      	},
      	castCanvasRemove(){
      		this.croppaCasting.remove()
      		this.castImgShow = false;
      		this.cast.profileImage = null;

      		setTimeout(()=>{

	      		this.castingJustify();

      		},300)

      	},

      	castingJustify(){

      		let hasImage = this.croppaCasting.hasImage();

      		let valid = this.cast.realName !== '' && this.cast.charaterName !== '' && hasImage;
      		this.add_disabled = !valid;

      		console.log('image',hasImage);
      	},
      	addCast(){
      		// this.castingDialog = false;



      		let hasImage = this.croppaCasting.hasImage();
      		if(hasImage){

	      		// initinate loading
	      		this.add_loading = true;

	      		const orignal =this.croppaCasting.getChosenFile();


	      		// getting current visible aria blob
	      		this.croppaCasting.generateBlob((blob) => {
	      		  const orignal =this.croppaCasting.getChosenFile()
	      		  const data = new FormData()
	      		    data.append("file", blob ,orignal.name);

	      		      // savig current image to database 
	      		          this.$axios.post(`${this.$store.state.server}picture/upload`,data,{
	      		          headers: {
	      		            'Content-Type': 'multipart/form-data'
	      		          }
	      		        }).then(r=>{	
	      		 			console.log(r.data);
	      		        	// stop add btn loading
	      					this.add_loading = false;

	      					// setting casting imaege in data
	      					this.cast.profileImage = r.data.imageId; 

	      					const data = {
	      						name:this.cast.realName,
	      						character:this.cast.charaterName,
	      						profileImage:this.cast.profileImage
	      					}

	      					let self = this;

  					      	// adding castings this _id
  							self.$axios.post(`${self.$store.state.server}movie/newcast`,data,self.$store.getters.auth).then(d=>{


  								const cast = d.data;
  								// emiting data to submitMovie.vue
  								self.$bus.$emit('cast_added',{data:cast,load:false})

  								console.log(d.data);
  							}).catch(e=>{	
  								console.log(e);
  							})

	      					// closing dialiog
	      					this.castingDialog = false;

	      					// setting to default
	      					this.castCanvasRemove();
	      					this.cast = {
											character:'',
											name:'',
											profileImage:null
										}


	      		          }).catch(e=>{
	      		            //server error
	      		            console.log(e)
	      		            this.$store.commit('sn',{snac:'server error , try again',context:'error'})
	      		          })

	      		}, orignal.type) 

      		}else{
      			this.add_loading = false;
      			this.$store.commit('sn',{context:'error',snac:'image is not selected!'})
      		}
      		


      	},
      	urlUpload(cast){

      			let self = this;
      			if(cast){

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


      				const c = cast.cast.filter(d=>d.profile_path !== null)

      				c.map( (d,i)=>{
      					if(d.profile_path){

      						console.log(d);
      					let url = `https://image.tmdb.org/t/p/w500/${d.profile_path}`
      					let name = d.profile_path;

      								getImageFormUrl(url, function (blobImage) {
      									var formData = new FormData();
      									formData.append('file', blobImage,name);

      									// uploading to stupefyr

      								      // savig current image to database 
      								         self.$axios.post(`${self.$store.state.server}picture/upload`,formData,{
      								          headers: {
      								            'Content-Type': 'multipart/form-data'
      								          }
      								        }).then(r=>{	

      								        	let data ={
	      								        			character:d.character,
	      								        			name:d.name,
	      								        			tmdb:{
	      								        				credit_id:d.credit_id,
	      								        				id:d.id
	      								        			},
	      								        			gender:d.gender,
	      								        			profileImage:r.data.imageId || '/static/default-profile.png',
	      								        			order:d.order
      								        			}


      	// adding castings this _id
		self.$axios.post(`${self.$store.state.server}movie/newcast`,data,self.$store.getters.auth).then(d=>{


			const cast = d.data;
			// emiting data to submitMovie.vue
			c.length === i+1? self.$bus.$emit('cast_added',{data:cast,load:false}):self.$bus.$emit('cast_added',{data:cast,type:'api',load:true});


		}).catch(e=>{
			console.log(e);
		})


      								          }).catch(e=>{
      								            //server error
      								            console.log(e)
      								            self.$store.commit('sn',{snac:'server error , try again',context:'error'})
      								          })

      								});	
      					}

      				})

      			}

      		}
	},
	created(){
		this.$bus.$on('addCastPop',r=>{
			if(r === true){

				this.castingDialog = true;

			}else{
				this.urlUpload(r)
			}
		})
	}
}
</script>


<style>

.castCanvas canvas {
	width: 100% !important;
	height: 100% !important;
	background-color: #f5f5f5 !important;
}

</style>