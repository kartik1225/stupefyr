<template>
	<div>
	<div style='position:absolute;right:0px;top:24px;' v-show='canBtn'>
	<v-btn flat error  @click='removeImage' >cancel</v-btn>
	</div>
	<v-layout justify-center>
		
					<v-container>
						<croppa v-model="myCroppa"  :width="700" :style="update.style"
				                        :height="700" :disable-scroll-to-zoom="true"
				                        :prevent-white-space="true"
				                        @file-choose='profile'
				                        :input-accept="'image/*'"
				                        name='file'
				                        :show-remove-button="false"
				                        class="round"
				        ></croppa>
				        <img :src='durl' />
				    <v-container>
				    	<p class="text-xs-center title">{{update.status}}</p>
				   	</v-container>
				   	<v-layout justify-center>
					   	<v-btn :disabled='!update.active'outline large success @click='next' class='black' >
					   		{{update.btn}}
					   	</v-btn>
					</v-layout>
			    </v-container>
    </v-layout>
	</div>
</template>

<script>
import axios from 'axios'
import {bus} from '../../main'
import blobUtil from 'blob-util'

const _l = localStorage.getItem('me');
				const l= JSON.parse(_l)
	export default{
		data(){
			return{
				myCroppa:{},
				canBtn:false,
				file:null,
				durl:null,
				update:{
					btn:'done',
					active:false,
					status:'upload your profile picture user',
					style:'cursor:pointer',
					proImg:''
				}
				
			}
		},
		watch:{
			file:function(i){
				console.log(i);
				!i?this.canBtn=false:this.canBtn = true;
			}
		},
		methods:{
			removeImage(){
				this.myCroppa.remove();
				this.update.active = false;
				this.file = null;
			},
			profile(file){
				this.update.active = true;
				this.canBtn = true;
				this.update.status = 'you can drag image to adjust';
				this.update.style = 'cursor:move';
				this.file = file;
				console.log('file',file)
			},
			next(){

				if(this.file){
				const orignal = this.file;

				// getting current visible aria blob
				this.myCroppa.generateBlob((blob) => {
					const data = new FormData()
						data.append("file", blob ,orignal.name);

							// savig current image to database 
					        axios.post(`${this.$store.state.server}picture/upload`,data,{
								  headers: {
								    'Content-Type': 'multipart/form-data'
								  }
								}).then(r=>{
					          		this.proImg = r.data.imageId;
					          		// getting values from localStoreage
					          		const put = {
					          			proImg:this.proImg,
					          			id:this.$store.getters.id
					          		}

					          		// setting Authorization of use
					          		const auth = {
					          			headers:{ Authorization : this.$store.getters.token}
					          		}

					          		//updating user image profile to database
					          		axios.put(`${this.$store.state.server}user/update`,put,auth).then(r=>{
					          			console.log(r.data)

					          			bus.$emit('profilePic_updated',r.data);
					          			this.myCroppa.remove()
							          	// notifying user
							          	setTimeout(()=>{
							          		this.$store.commit('sn',{snac:'profile updated'})
							          	},500)
					          		}).catch(e=>{
					          			//server error
					          			console.log(e)
					          			this.$store.commit('sn',{snac:'server error , try again',context:'error'})
					          		})
					        }).catch(e=>{
					        	//server error
					        	console.log(e)
					        	this.$store.commit('sn',{snac:'server error , try again',context:'error'})
					        })

				}, orignal.type) 

				// const file = this.myCroppa.generateDataUrl()
				//      function dataURItoBlob(dataURI) {
				//     var byteString = atob(dataURI.split(',')[1]);
				//     var ab = new ArrayBuffer(byteString.length);
				//     var ia = new Uint8Array(ab);
				//     for (var i = 0; i < byteString.length; i++) {
				//         ia[i] = byteString.charCodeAt(i);
				//     }
				//     return new Blob([ab], { type: orignal.type });
				// }

				//         const fi =dataURItoBlob(file)

				//         console.log(fi)
				// 		// var Fin = new File([fi], orignal.name , {type: fi.type, lastModified: Date.now()});
				//         let f = new FormData()
				// 			f.append("file", fi,orignal.name);
				//         // console.log(blob)

				//         axios.post(`${this.$store.state.server}picture/upload`,f,{
				//   headers: {
				//     'Content-Type': 'multipart/form-data'
				//   }
				// }).then(r=>{
				//           console.log(r.data)
				//         }).catch(e=>{
				//           console.log(e)
				//         })


			}else{
				this.$store.commit('sn',{snac:'error while uploading file',context:'error'})	
			}
			}
		},
		updated(){
			this.myCroppa.remove()
		},
		mounted(){
				var container = this.$el.querySelector("canvas").setAttribute("style", "width:100% !important;height: 100% !important;background-repeat: no-repeat !important;background-position: 50% !important;border-radius: 50% !important;");
		}
	}
</script>

<style scoped>


</style>