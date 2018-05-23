<template>

<v-card flat>
        <v-card>
                <v-card-actions> 
                  <v-spacer></v-spacer>
                </v-card-actions>
                <v-container fluid grid-list-sm>
                  <v-layout row wrap>
                  <template v-for="photo in photos">
                    
                    <v-flex
                      lg3 md4 xs6
                    >
                      <v-card flat tile hover>
                        <v-card-media
                          @click='selected(photo)'
                          :src="photo.image"
                          height="30vh"
                          style='width:100%'
                        >
                        </v-card-media>
                      </v-card>
                    </v-flex>
                  </template>
                  </v-layout>
                </v-container>
              </v-card>
</v-card>

</template>

<script>
  import {bus} from '../../main.js'
  const postImage = ()=> import('./postImage')
  export default {
    props:{posts:{type:Array}},
    components:{
      postImage
    },
    data(){
      return{
        // all variables
        photos:[],
        fi:false,
        si:null,
        clicked:''
      }
    },
    watch:{
      activate:function(i){
        console.log('parent',i)
      } 
    },
    methods:{
      selected(i){
        console.log(i)

        // chage current domain here
        this.$router.push('/fullimage/'+i._id)
        
      }
    },
    beforeCreate(){
    bus.$emit('loading_on',true);
    },
    created(){
      bus.$emit('loading_off',false);

      // clicked
      if(this.posts){
      this.posts.map(d => {
        d.image?(this.photos.push(d),console.log(d)):null;
      })
    }
    },
    beforeUpdate(){
      bus.$emit('loading_on',true);
    },
    beforeDestroy(){
      this.photos = []
    },
    updated(){
      bus.$emit('loading_off',false);
    }
  }
</script>