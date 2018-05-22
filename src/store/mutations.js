
export default {
    login(state,d){
      function parseJwt (token) {
          var base64Url = token.split('.')[1];
          var base64 = base64Url.replace('-', '+').replace('_', '/');
          return JSON.parse(window.atob(base64));
      };
      const read = parseJwt(d);
      console.log(read)
      state.userid = read._doc._id;
    },
  	snclose(state){
  		state.snackbar = false
  	},
    sn(state,d) {
    	state.snackbar = true;
		state.context = d.context || 'success';
    	state.snac = d.snac;
    	setTimeout(()=>{
    		state.snackbar = false
    	},6000)
    }
  }