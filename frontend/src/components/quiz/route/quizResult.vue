<template>
	<div v-if='quiz !== null'>
		<div class='lime accent-3 elevation-1 flex-center-vertically'>



			<v-container class=''>
				<v-layout justify-center>
						<p class='headline '>result of <strong>{{quiz.title}}</strong></p>
				</v-layout>

			</v-container>
		</div>

		<v-container style='margin-top:-72px;' :grid-list-xs='$vuetify.breakpoint.width < 600'>

			<v-card class='grey darken-2' v-show='true'>
			  <v-container>
			  	<v-icon dark>timeline</v-icon>
			  	<span class="body-2 white--text" style='margin-left:10px;'>Your ranking in this Quiz</span>

			  </v-container>
			  <v-divider dark></v-divider>
			  <v-data-table
			  	 style='margin-bottom:15px;'
			     :headers="uheaders"
			     :items="uitems"
			     class="elevation-1"
			     
			     dark
			     hide-actions
			   >

			     <template slot="headerCell" slot-scope="props">
			       <v-tooltip bottom>
			         <span slot="activator">
			           {{ props.header.text }}
			         </span>
			         <span>
			           {{ props.header.text }}
			         </span>
			       </v-tooltip>
			     </template>


			    <template slot="items" slot-scope="props">

			      <td :style='`${ props.item.rank === 1? `color:#C6FF00`:null}`' >
						{{ props.item.rank }} 

						 <v-icon class='text-xs-right' style='font-size:18px; color:#C6FF00; margin-left:10px;'>{{`${ props.item.rank === 1? `star`:``}`}}</v-icon>

					</td>
					      <td :class='`text-xs-right`' :style='`${ props.item.rank === 1? `color:#C6FF00`:null}`'><strong>{{ props.item.user }}</strong></td>
					      <td class='text-xs-right' :style='`${ props.item.rank === 1? `color:#C6FF00`:null}`'>{{ props.item.timeSpan }}</td>
					      <td class='text-xs-right' :style='`${ props.item.rank === 1? `color:#C6FF00`:null}`' >{{ props.item.result }}</td>
			     </template>

			   </v-data-table>
			  </v-card>
			<!-- table  -->

			<v-card class='grey darken-2'>
			  <v-container>
			  	<v-icon dark>trending_up</v-icon>
			  	<span class="body-2 white--text" style='margin-left:10px;'>Top list of this Quiz</span>
			  </v-container>
			  <v-data-table
			     :headers="headers"
			     :items="items"
			     :pagination.sync="pagination"
			     :total-items="totalItems"
			     class="elevation-1"

			     dark
			     :rows-per-page-items='[10]'
			     :loading='tableLoading'

			   >

			     <template slot="headerCell" slot-scope="props">
			       <v-tooltip bottom>
			         <span slot="activator">
			           {{ props.header.text }}
			         </span>
			         <span>
			           {{ props.header.text }}
			         </span>
			       </v-tooltip>
			     </template>


			    <template slot="items" slot-scope="props">

			      <td :style='`${ props.item.rank === 1? `color:#C6FF00`:null}`' >
						{{ props.item.rank }} 

						 <v-icon class='text-xs-right' style='font-size:18px; color:#C6FF00; margin-left:10px;'>{{`${ props.item.rank === 1? `star`:``}`}}</v-icon>

					</td>
					      <td :class='`text-xs-right`' :style='`${ props.item.rank === 1? `color:#C6FF00`:null}`'><strong>{{ props.item.user }}</strong></td>
					      <td class='text-xs-right' :style='`${ props.item.rank === 1? `color:#C6FF00`:null}`'>{{ props.item.timeSpan }}</td>
					      <td class='text-xs-right' :style='`${ props.item.rank === 1? `color:#C6FF00`:null}`' >{{ props.item.result }}</td>

			     </template>
			   </v-data-table>



			</v-card>
			<br>
				<div v-if='quiz'>
						<v-card>
						<v-container class='grey darken-2'>
							<span class='body-2 white--text '>Answers of this quiz</span>
						</v-container>
					</v-card>
				   		<quizAns :quiz='quiz'></quizAns>

			   	</div>
		  </v-container>



	</div>	
</template>

<script>
import quizAns from './quizAns'
	export default{
		components:{
			quizAns
		},
		data(){
			return{	
				headers: [
						 {text:'Rank',align:'left',value:'rank'},
				         {text: 'User Name',sortable: false,value:'user'},
				         {text:'Completed in time',value:'timeSpan'},
				         {text:'Correct Answers',value:'result'},
				       ],
				items:[],
				uheaders: [
						 {text:'Rank',align:'left',value:'rank'},
				         {text: 'User Name',sortable: false,value:'user'},
				         {text:'Completed in time',value:'timeSpan'},
				         {text:'Correct Answers',value:'result'},
				       ],
				uitems:[],
                quiz:null,
                totalItems:0,
                pagination:{},
                tableLoading:false
			}
		},
		watch:{
			pagination: {
			        handler () {
			          this.getDataFromApi()
			            .then(data => {
			            	this.tableLoading = false;
			              this.items = data.items;

			              console.log(data.items);
              			  this.totalItems = data.total;
			            })
			        },
			        deep: true
			      }
		},
		methods:{

			getDataFromApi(){
				return new Promise((resolve, reject) => {

				const { sortBy, descending, page, rowsPerPage } = this.pagination;
				this.tableLoading = true;


				this.$axios.get(`${this.$store.state.server}quiz/getresult/${this.$route.params.id}+${this.$store.getters.id}+${rowsPerPage?(page * rowsPerPage) - 10:0}`,this.$store.getters.auth).then(r=>{
					console.log(r)

					r.data.error?this.$store.commit('sn',{context:'error',snac:r.data.error}):null;
					// top list 
					const temp = [];
					this.totalItems = r.data.count;
					this.quiz = r.data.quiz;
					r.data.resultList.map((d,i)=>{

						const data = {
							rank:null,
							timeSpan:null,
							user:null,
							result:null
						}

						data.rank = d.rank;
						data.timeSpan = d.timeSpan;
						data.user = d.user.userName;

						const correct = d.result.filter(d=> d === true);
						data.result = correct.length;

						temp.push(data);

					})

					console.log('lllll',temp)

					// current user
					const ua = r.data.userAnswer;

					if(ua){
						const data = {
								rank:null,
								timeSpan:null,
								user:null,
								result:null
							}

							data.rank =  ua.rank;
							data.timeSpan = ua.timeSpan;
							data.user = ua.user.userName;

							const correct = ua.result.filter(d=> d === true);
							data.result = correct.length;

						this.uitems = [data];
					}


					// table stuffs from vuetify;

					let items = temp;
					let total = r.data.count;

					if (this.pagination.sortBy) {
					            items = items.sort((a, b) => {
					              const sortA = a[sortBy]
					              const sortB = b[sortBy]

					              if (descending) {
					                if (sortA < sortB) return 1
					                if (sortA > sortB) return -1
					                return 0
					              } else {
					                if (sortA < sortB) return -1
					                if (sortA > sortB) return 1
					                return 0
					              }
					            })
					          }

		          // if (rowsPerPage > 0) {
		          //   items = items.slice((page - 1) * rowsPerPage, page * rowsPerPage)
		          // }


		          console.log('rowsPerPage',rowsPerPage)
				resolve({
					items,
					total
		        })

				}).catch(e=>{
					console.log(e);
				})


				})
			}
		},
		mounted(){

			// this.fetchData();
          this.getDataFromApi()
            .then(data => {
            	this.tableLoading = false;
              this.items = data.items;

              console.log(data.items);
  			  this.totalItems = data.total;
            })

		}
	}

</script>

<style scoped>
	.flex-center-vertically {
	  display: flex;
	  justify-content: center;
	  flex-direction: column;
	  height:235px;
	}

	
</style>