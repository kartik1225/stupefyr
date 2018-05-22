<template>

<div>
    <v-dialog persistent v-model="signupDialog" fullscreen transition="dialog-bottom-transition" :overlay="false" >

      <v-btn  slot="activator" href to='/signup' round outline class='white white--text' large >SignUp</v-btn>
      <v-card class='white'>
        <v-toolbar dark class="blue-grey darken-3">
          <v-btn href to='/login'icon @click.native="signupDialog = false" dark>
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>signup</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark flat @click="next" >next</v-btn>
          </v-toolbar-items>
        </v-toolbar>

        <v-layout  justify-center>
        <v-flex lg5>
        <v-container >
        <p class="text-xs-center subheading grey--text" style='font-family:monospace;margin: auto;' >You are just one step away to become a <strong>stupefyr</strong> <v-icon style='font-size: 16px;'>flash_on</v-icon> </p>
        <br>
        <p class="text-xs-right caption grey--text" style="margin: auto;">all * field is required</p>
        <br>
          <!-- <v-text-field label="What is your name?" v-model='signupData.name' required></v-text-field> -->
          <!-- <v-text-field label="Last name?" v-model='signupData.lastName' required></v-text-field> -->
          <v-text-field label="What's your email?" :error='eValidate' v-model='signupData.email' required></v-text-field>
          <v-text-field label="Set your pass***" v-model='signupData.password' type='password' required></v-text-field>
          <v-text-field label="set your Username" v-model='signupData.userName' required></v-text-field>

            

          <!-- display name pop -->

          <v-dialog v-model='displayNamePop' max-width='400px'>

            <v-card style='background-color: #1d212b'>
              <v-container>

                  <v-slide-y-transition>
                  <v-container grid-list-xs v-show='help' class='hide'>
                  <v-card class='grey lighten-4 '>
                    <div style="position: absolute; right: 0;">
                      <v-btn flat @click='help = !help' icon>
                        <v-icon class='black--text' >clear</v-icon>
                      </v-btn>
                    </div> 

                    <v-container class='elevation-1' style='background-color: rgb(0, 230, 118); border-radius: 2px;'>
                      <span class="body-2" >what is display name?</span>
                    </v-container>


                    <v-container grid-list-sm>
                      <p class="caption">Here you can be anything that you want! for example you can be <span class="body-1"><strong>Batman</strong></span> and this name will be displayed on all over this website. <br><br><span class="subheading">what is the point of display name? </span> <br><br> You can <strong> behave like your favourite character </strong> and create post related to your character and <strong>you can create your very own fanbase!</strong></p>
                      <p class="grey--text caption"> *this field is not required you can change it creating after account* </p>
                    </v-container>
                  </v-card>
                  </v-container>
                  </v-slide-y-transition>


                  <p class="headline" style="z-index: 2; margin:auto; color: rgb(0, 230, 118);">what do you want to be?</p>
                  <p style="margin: auto; z-index: 2;" class="body-2 white--text"> Choose your fictional character name.</p>
                  <v-layout justify-end>

                  <a align=''href='#' class="hide" @click='mouseOver' style="color:rgb(0, 230, 118);"><span class="caption" role='button'>what is this?</span></a>
                  </v-layout>
                  
                  <!-- <roket></roket> -->


                  <!-- <img src="static/rocket.svg" style="transform: scaleX(-1);" /> -->


                  <v-layout>
                    <v-text-field
                     single-line
                     placeholder='type name. e.g:~ Batman'
                     v-model='signupData.displayName'
                     hide-details
                     full-width
                     class='displayName'
                     style='padding: 0 !important;'
                    ></v-text-field>
                    <v-btn icon style='margin:auto;' @click='setDisplayName'>
                      <v-icon style='color:rgb(0, 230, 118);'>send</v-icon>
                    </v-btn>
                  </v-layout>

                  <v-layout justify-end>
                    <a href='#' class="caption white--text" @click='$router.push("/signup/profile")'>i will do this later..</a>
                  </v-layout>
              </v-container>
              <div class="white" v-show='false'>
                <v-container>

                  
                </v-container>
              </div>
            </v-card>
  
          </v-dialog>



          <v-radio-group v-model="signupData.gender" row>
              <v-radio label="male" value="male"></v-radio>
              <v-radio label="female" value="female"></v-radio>
            </v-radio-group>

          <!-- date -->

          <v-menu
                   lazy
                   :close-on-content-click="false"
                   v-model="menu"
                   transition="scale-transition"
                   offset-y
                   full-width
                   :nudge-left="40"
                   max-width="290px"
                 >
         <v-text-field
           slot="activator"
           label="when is your B'day?"
           v-model="signupData.birthday"
           prepend-icon="event"
           readonly
         ></v-text-field>
         <v-date-picker :allowed-dates="allowedMonths" v-model="signupData.birthday" scrollable actions>
          <template scope="{ save, cancel }">
             <v-card-actions>
               <v-btn flat primary @click.native="cancel()">Cancel</v-btn>
               <v-btn flat primary @click.native="save()">done</v-btn>
             </v-card-actions>
          </template>
        </v-date-picker>
        </v-menu>

        <v-btn block class='blue-grey darken-3' @click.native='next' dark>next</v-btn>
        </v-container>
        </v-flex>
        </v-layout>

      </v-card>
    </v-dialog>

    


</div>
</template>

<script>
import axios from 'axios'
import moment from 'moment';
import roket from './rocket2.vue'

  export default {
    components:{
      roket
    },
    data () {
      return {
        eValidate:false,
      	signupDialog:false,
        menu: false,
        modal: false,
        activator:false,
        help:false,
        snackbar:false,
        context:'success',
        snac:'',
        signupData:{
          // name:'',
          // lastName:'',
          email:'',
          password:'',
          userName:'',
          displayName:'',
          gender:'',
          birthday:null
        },
        displayNamePop:false
      }
    },
    watch:{
       'signupData.email':function(i){
          !this.validateEmail(i)? this.eValidate=true : this.eValidate = false;
      }
    },
    methods:{
      allowedMonths(val){

        const isBefore = moment(val,[`YYYY-MM-DD`]).isBefore();

        return isBefore;
      },
      mouseOver(){
        this.help = true;
      },
      activeDisplayName(){
        this.displayNamePop = true;
      },
      setDisplayName(){


        let data = {
          displayName:this.signupData.displayName,
          userId:this.$store.getters.id
        }

        this.$axios.put(`${this.$store.state.server}profile/displayName`,data,this.$store.getters.auth).then(r=>{
          console.log(r.data);
          window.location = '/signup/profile'
        }).catch(e=>{
          console.log(e);
        })

      },
      next(){
        axios.post(`${this.$store.state.server}auth`,this.signupData).then(r=>{
          if(r.data.error){

            //user has some error(s) showing notifications
            const nt = {
              snac:r.data.error,
              context:'error'
            }
            this.$store.commit('sn',nt)
            console.log(this.$store)
          }else{
            // user successfully has been registered
            console.log('success')

            this.activeDisplayName();

            localStorage.clear()
            localStorage.setItem('me',JSON.stringify(r.data))
            this.$store.commit('sn',{snac:'welcome , your accout is succesfully created.'})
          }
        }).catch((e)=>{
          //server error 
          this.$store.commit('sn',{snac:'some server error.. try again',context:'error'})
          console.log(e);
        })

      },
      validateEmail(email) {
          var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
          return re.test(email)
      },
      validate(){
        let d = this.signupData;
        let email = d.email !== '';
        let password = d.password !== '';
        let userName = d.userName !== '';
        let birthday = d.birthday !== null;
        let gender = d.gender !== '';

        if(!email){
          this.$store.commit('sn',{context:'error',snac:'email is required'})
        }else if(!password){
          this.$store.commit('sn',{context:'error',snac:'password is required'})
        }else if(!userName){
          this.$store.commit('sn',{context:'error',snac:'user name is required'})
        }else if(!birthday){
          this.$store.commit('sn',{context:'error',snac:'birth date is required'})
        }else if(!gender){
          this.$store.commit('sn',{context:'error',snac:'gender is required'})
        }else{
          this.activeDisplayName()
        }
      }
    },
    computed:{

    },
    created(){
      setTimeout(()=>{
      this.$route.fullPath === '/signup'? this.signupDialog = true : this.signupDialog=false;
    },500)
    }
    
  }
</script>

<style>
.hide{
  margin-bottom: -2px;
}

.displayName input{
  font-size: 25px !important;
  overflow:hidden;
  line-height: 135%;
  height: 51px;
  color: rgb(0, 230, 118) !important;
  font-family: monospace;
  border-bottom: 1px solid white;

}

.displayName input::-webkit-input-placeholder {
  color: white !important;
  font-size: 13px;
}
</style>
