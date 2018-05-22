<template>


<div class="bg" style='height:calc(100% - 56px);position:fixed;width:100%;'>


<div style='margin: auto 0;'>


<h3 :class='`text-xs-center white--text ${$vuetify.breakpoint.width>600?`display-1`:`headline`}`' >Here you can be anything</h3><br>

<h3 :class="`text-xs-center ${$vuetify.breakpoint.width>600?`display-1`:`headline`}`" style="color:#00E676;">start Stupifying !</h3><br>

<v-layout row justify-center>
  <signup></signup>
  <login></login>
</v-layout>


</div>
<roket></roket>
</div>

</template>
 
<script>
import bodyTemplate from '../bodyTemplate.vue'
import login from './login/login.vue'
import signup from './login/signup.vue'
import textAni from './textAni'
import roket from './roket.vue'



  export default {
    components:{
      bodyTemplate,
      login,
      signup,
      roket
    },
    data () {
      return {
      }
    },
    computed:{
      title(){

      },
      navigate(){

      }
    },
    created:function(){

    }
  }
</script>

<style>

* {
  box-sizing: border-box;
}

.bg {
  margin: 0 auto;
  height: 100%;
}

.bg {
  display: flex;
  align-items: center;
  font-family: monospace;
  justify-content: center;
  background-color: #1d212b;
}




.gradiant {
  width: 100wh;
  height: 90vh;
  color: #fff;
  background: linear-gradient(-45deg, #EE7752, #E73C7E, #23A6D5, #23D5AB);
  background-size: 400% 400%;
  -webkit-animation: Gradient 15s ease infinite;
  -moz-animation: Gradient 15s ease infinite;
  animation: Gradient 15s ease infinite;
}

@-webkit-keyframes Gradient {
  0% {
    background-position: 0% 50%
  }
  50% {
    background-position: 100% 50%
  }
  100% {
    background-position: 0% 50%
  }
}

@-moz-keyframes Gradient {
  0% {
    background-position: 0% 50%
  }
  50% {
    background-position: 100% 50%
  }
  100% {
    background-position: 0% 50%
  }
}

@keyframes Gradient {
  0% {
    background-position: 0% 50%
  }
  50% {
    background-position: 100% 50%
  }
  100% {
    background-position: 0% 50%
  }
}

h1,
h6 {
  font-family: 'Open Sans';
  font-weight: 300;
  text-align: center;
  position: absolute;
  top: 45%;
  right: 0;
  left: 0;
}

</style>
