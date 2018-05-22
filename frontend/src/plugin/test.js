import gradient from './gradients.json'
import vibrant from 'node-vibrant'

// gradiant HEX code to rgb -- https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb

  function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

const grds = [];

  function getgr (arr,rgb) {
  
    arr.map((d,i)=>{
      d.colors.map(e=>{
        grds.push({index:i,rgb:hexToRgb(e)})
      })
    })

    // algorithum
    const close = grds.map(d=>{
      if (d.rgb !== null){
        let r = d.rgb.r - rgb[0];
        let g = d.rgb.g - rgb[1];
        let b = d.rgb.b - rgb[2];
        let result = Math.sqrt(r*r + g*g + b*b)
        return result;
      }
    })
    var min = close.reduce((iMax, x, i, arr) => x < arr[iMax] ? i : iMax, 0);
      const final = gradient[grds[min].index]
      return final.colors;
  }

const MyPlugin = {

  install(Vue, options) {
  	Vue.mixin({
      beforeCreate() {
        // taking image src with 'track' vue diractive
        Vue.directive('track', {
         bind(el, binding, vnode) {

            vibrant.from(el.src).getPalette()
              .then((palette) => {
                getgr(gradient,palette.Vibrant._rgb)
              })


              Vue.directive('grad',{
                update(El,Binding,Vnode){
                  vibrant.from(el.src).getPalette()
                    .then((palette) => {
                      if(!Binding.expression){

                        El.style.background=`linear-gradient(${getgr(gradient,palette.Vibrant._rgb)})`
                        
                      }

                        let clr = hexToRgb(getgr(gradient,palette.Vibrant._rgb)[0]);
                        var colourIsLight = function (r, g, b) {
                          var a = 1 - (0.299 * r + 0.587 * g + 0.114 * b) / 255;
                          return (a < 0.5);
                        }

                        if(Binding.expression ==='"text"'){

                          let light = colourIsLight(clr.r,clr.g,clr.b)?'#000000':'#ffffff';
                          El.style.color = light;

                        }

                        if(Binding.expression ==='"vb"'){
                          let vb = `rgb(${parseInt(palette.Vibrant._rgb[0])},${parseInt(palette.Vibrant._rgb[1])},${parseInt(palette.Vibrant._rgb[2])})`
                          // console.log(vb)
                          
                          El.style.setProperty("background-color", vb, "important");
                          setTimeout(()=>{

                            // El.style.removeProperty("background-color");
                          },500)

                        }                       
                      // console.log(Binding.expression)


                    })
                },



              })


              
          },
          unbind(el,binding,vnode){
              console.log('ub',vnode);
            Vue.directive('grmv',{
              update(El,Binding,Vnode){

                  // console.log(Binding.expression)
                  setTimeout(()=>{
                    El.style.background = '';
                  },500)

              }
            })
          }
        });
      },
    updated(){
        
    }
    });
  }
};

export default MyPlugin;