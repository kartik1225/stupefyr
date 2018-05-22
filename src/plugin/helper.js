// import vibrant from 'node-vibrant'
module.exports = {
	txtRe:(el)=>{
		      setTimeout(function(){
		         el.style.cssText = 'height:auto; padding:0';
		         // for box-sizing other than "content-box" use:
		         el.style.cssText = '-moz-box-sizing:content-box';
		         el.style.cssText = 'height:' + el.scrollHeight + 'px';
		       },0);

	},
	inView:(el)=>{
		// highlighting
			// prevent this on safari...
			if(window.safari === undefined){
				el.scrollIntoView({behavior: "smooth", block: "center"});
			}

				el.style.background = 'linear-gradient(282deg, #a1ffce, #faffd1)';
			setTimeout(()=>{
				el.style.background = '';
			},5000)
	}
	
}