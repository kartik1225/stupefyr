<template>
	<div>
	<v-layout justify-center>
		<v-flex lg3 md4 sm6 xs12>

				<v-card class='' :style='$vuetify.breakpoint.width>600?`margin-top:20px;`:`margin-top:0px`'>
					<v-container class='blue-grey'>
					 	<p class="text-xs-center title white--text" style="margin:auto;">{{update.status}}</p>
					</v-container>

					<v-container>
						<croppa  v-model="myCroppa"  :width="700" :style="update.style"
				                        :height="700" :disable-scroll-to-zoom="true"
				                        :prevent-white-space="true"
				                        @file-choose='profile'
				                        :input-accept="'image/*'"
				                        name='file'
				                        :show-remove-button="false"
				                        placeholder="Upload profile image (click to Choose)"

				                        :placeholder-font-size="30"
				                        class="round"
				        ></croppa>

				    <br>
				   	
				   	<v-layout justify-center>
					   	<v-btn :loading='loading'  block @click='next' class='blue-grey white--text' >
					   		{{update.btn}}
					   	</v-btn>
					</v-layout>

						<div v-show='showNav'>
							<span class="subheader">Go to...</span>
							<v-layout>
								<v-btn block  href block  @click='$router.push(`/`)' flat>timeline</v-btn>						
								<v-btn block  href block flat to='/profile/post'>profile</v-btn>
							</v-layout>
						</div>	
			    </v-container>
		    </v-card>
		</v-flex>
    </v-layout>
	</div>
</template>

<script>
import axios from 'axios'

const _l = localStorage.getItem('me');
				const l= JSON.parse(_l)
	export default{
		data(){
			return{
				myCroppa:{},
				update:{
					btn:'skip',
					status:'Upload your profile picture',
					style:'cursor:pointer',
					proImg:''
				},
				showNav:false,
				loading:false
				
			}
		},
		methods:{
			profile(file){
				this.update.btn = 'upload';
				this.update.status = 'you can drag image to adjust';
				this.update.style = 'cursor:move';
			},
			next(){

				this.loading = true;

				if(this.update.btn === 'upload'){
					const orignal =this.myCroppa.getChosenFile();
					// getting current visible aria blob
					this.myCroppa.generateBlob((blob) => {
						const orignal =this.myCroppa.getChosenFile()
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
						          			console.log(r.data);

						          			this.showNav = true;
						          			this.loading = false;
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
				}else{
					this.loading = false;
					this.showNav = true;
				}
	
			}
		},
		mounted(){
				var container = this.$el.querySelector("canvas").setAttribute("style", "width:100% !important;height: 100% !important;background-repeat: no-repeat !important;background-position: 50% !important;border-radius: 50% !important; background:#EEEEEE;");
				console.log(container)
			}
	}
</script>

<style scoped>


</style>