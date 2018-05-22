const _data = window.localStorage.getItem('me');
const data = JSON.parse(_data)
import axios from 'axios'

export default {
  	id:(state,getters)=>{
      
    if(data.token){  
      // reading jwt functions
		  function parseJwt (token) {
          var base64Url = token.split('.')[1];
          var base64 = base64Url.replace('-', '+').replace('_', '/');
          return JSON.parse(window.atob(base64));
      };

      const read = parseJwt(data.token);
      return read._doc._id;

    }else{
      return '"Unauthorized"'
    }
  	},
  	token:(state,getters)=>{
      if(data.token !== undefined){
		return data.token
      }else{
        return "Unauthorized"
      }
  	},
  	user:async (state,getters)=> {
  		const auth = {
  			headers: {Authorization:getters.token} 
  		}
  		const User = await axios.get(`${state.server}user/get/${getters.id}`,auth);
  					 return User
  	},
  	auth:(state,getters)=>{
  		const auth = {
  			headers: {Authorization:getters.token} 
  		}
  		return auth
  	}
  }