const moment = require('moment');
const schedule = require('node-schedule');
const Quiz = require('../models/quiz');
const Question = require('../models/question');
const Qs = require('../models/quizSubmit');
const Uqr = require('../models/userQuizResult');

const EventBus = require('eventbusjs');




module.exports = {

	test:async(socket , online)=>{

			// main func
			const qzfunc = async (_)=>{

				// const date = moment().add(10000,'milliseconds').toISOString();
				const startT = _.startStamp;
				const startdate = moment(startT).utcOffset(_.timeZone).toISOString();
				const endDate = moment(startT).utcOffset(_.timeZone).add(_.duration,`days`).toISOString();
				console.log(startdate);

				schedule.scheduleJob(startdate, function(){	
				
				// notify user who created this quiz and maybe to user's followers..
				socket.emit('quizResults', { startdate , _ });
				  console.log('started');
				});



				schedule.scheduleJob(endDate,async function(){

					// validate ans..
					const que = await Quiz.findById(_.id).populate('questions');
					const qs = await Qs.find({quizId:_.id}); 

					// maching answers 
					if(qs.length > 0){
						// d is quiz submit objacts
						qs.map(async d=>{
							const result = [];

							d.answers.map(async (uAns,i)=>{
								const R = que.questions[uAns.index];
								const rAns = R.answer || R.answers;

								if(R.type === 'feel_blank'){
									rAns.map((ra,i)=>{
										result.push(ra.answer.toLowerCase() === uAns.answer[i].toLowerCase())
									})
								}else{
									result.push(uAns.answer === rAns);
								}
							})

							const data = {
								user:d.user,
								result,
								quizId:_.id,
								timeSpan:d.timeSpan,
								userAns:d._id
							}

							const newUqr = await Uqr(data);

							await newUqr.save();
						})

					 	const resultList = await Uqr.find({quizId:_.id})
					 									 .sort({resultLength:-1,timeSpan:1})
					 									 .populate('user')
					 									 // .limit(10);
				        resultList.map(async (d,i)=>{
				        	d.rank = i+1;
				        	await d.save();
				        })

				        // updating quiz status
				        que.resultStatus = true;
				        await que.save();

						// notify in future 
						socket.emit('quizResults','its done man..');

						console.log('endedajsdfand');
					}


				});
			}


			// for crons...
			function pubQz(event,_){
					qzfunc(_);				
			}

			EventBus.addEventListener("pub_quiz", pubQz ,null);


			// for socket event
			socket.on('userQuizSubmited',async(_)=>{
				qzfunc(_)
			})
	}
}