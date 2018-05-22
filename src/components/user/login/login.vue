<template>


    <v-dialog v-model="loginDialog" persistent max-width='400px'>
      <v-btn  slot="activator" round outline style="color:#00E676;" large>Login</v-btn>
      <v-card class='white'>
        <v-card-title class='blue-grey'>
          <span class="headline white--text">Login</span>
        </v-card-title>
        <v-card-text>
          <v-text-field :error='eval' label="Email" v-model='loginInfo.email' @keyup.enter='auth' required></v-text-field>
          <v-text-field label="Password" type="password" v-model='loginInfo.password' @keyup.enter='auth' required></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="blue--text darken-1" flat @click.native="loginDialog = false">Close</v-btn>
          <v-btn class="blue--text darken-1" flat @click.native="auth">login</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>


</template>

<script>
import axios from 'axios'

  export default {
    data () {
      return {
        loginDialog:false,
        eval:null,
        loginInfo:{
          email:'',
          password:''
        }
      }
    },
    watch:{
      // for email validation
      'loginInfo.email':function(i){
        if(i.length > 3){
        !this.validateEmail(i)?this.eval=true:this.eval = false;
        }
      } 
    },
    methods:{
      auth(){
        axios.post(`${this.$store.state.server}auth/login`,this.loginInfo).then(r => {
          //store user to localstorege
          if(!r.data.error){
            // removing previous USER
            console.log(r.data,'success')
            localStorage.clear();
            localStorage.setItem('me',JSON.stringify(r.data));
            this.$store.commit('sn',{snac:`welcome back`});
            // rediracting user to home route
            // this.$router.push('/test')

            window.location = '/'

          }else{
            console.log(r.data , 'error')
            this.$store.commit('sn',{context:'error',snac:r.data.error})

          }
        }).catch(e => {

        })
      },
      logout(){
        localStorage.clear();
      },

      //validating this email format
      validateEmail(email) {
          var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
          return re.test(email)
      }
    },
    created:function(){

    }
  }
</script>

<style>

</style>
