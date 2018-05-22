const Quiz = require('../models/quiz');
const User = require('../models/user');
const quizSubmit = require('../models/quizSubmit');
const Question = require('../models/question');
const userQuizResult  = require('../models/userQuizResult');
const moment = require('moment');


module.exports = {
	query:async ( req,res,next)=>{
		const {q} = req.query
		if(q){
			let regex = new RegExp(q,'i');

			const result = await Quiz.find(  { "title": regex});
			if(result.length !== 0){
				
				res.send(result);

			}else{
				res.send({error:'not foud'})
			}


		}
	},
	submit:async (req,res,next)=>{

		const Ques = req.body.questions;
		const data = req.body;
		delete data.questions;

		data.startStamp = moment(data.startStamp).utcOffset(data.timeZone); 
		  data.timeZone = moment().zone();
		  data.endStamp = moment(data.startStamp).add(data.duration,'days');
		  
		const newQuiz = new Quiz(data);

		await Ques.map(async d=>{

			const newQuestion = new Question(d);
			newQuestion.quizId = newQuiz._id;
			await newQuiz.questions.push(newQuestion);
			await newQuestion.save();

		})


		await newQuiz.save();

		res.json(newQuiz);	
	},
	getAllQuiz:async(req,res,next)=>{
		// _[0] = userId || _[1] = type of sorting 
		const {id} = req.params;
		const _ = id.split('+');
		const type = _[1];

		var cutoff = new Date();
		cutoff.setDate(cutoff.getDate());
		

		// {startStamp:{$gte: cutoff}} for upcoming
		// {endStamp:{$lte: cutoff}} for expired
		// {endStamp:{$gte: cutoff}} for upcoming and live
		// ↓ this was lit 🔥
		// {$and:[{ endStamp: { $not:{ $lte: cutoff }  } },{ startStamp: { $not:{ $gte: cutoff }  } }]} .sort(populate) for live 


		// {endStamp:{$gte: cutoff}} .sort(participants) for popular
		// lit .sort(created) for newest
		// {{endStamp:{$lte: cutoff}}} .sort(created) for expired
		// {endStamp:{$gte: cutoff}} .sort(created) for upcoming

		if(type === 'popular'){

			const quizes = await Quiz.find({$and:[{ endStamp: { $not:{ $lte: cutoff }  } },{ startStamp: { $not:{ $gte: cutoff }  } }]}).populate('creator','-posts').sort({participants:-1});
			res.send(quizes);

		}else if(type === 'newest'){
			const quizes = await Quiz.find({$and:[{ endStamp: { $not:{ $lte: cutoff }  } },{ startStamp: { $not:{ $gte: cutoff }  } }]}).populate('creator','-posts').sort({created:-1});
			res.send(quizes);
		}else if(type === 'expired'){
			const quizes = await Quiz.find({endStamp:{$lte: cutoff}}).populate('creator','-posts').sort({created:-1});
			res.send(quizes);
		}else if(type === 'upcoming'){
			const quizes = await Quiz.find({startStamp:{$gte: cutoff}}).populate('creator','-posts').sort({created:-1});
			res.send(quizes);
		}

	},
	 getQuiz:async(req,res,next)=>{
	 	const {id} = req.params;
	 	const quiz = await Quiz.findById(id).populate('questions', '-answer -answers');

	 	if(quiz){



	 		const live = moment(quiz.startStamp).utcOffset(quiz.timeZone).add(quiz.duration,'days').utcOffset(quiz.timeZone).diff(moment()) > 0?true:false;

	 		const upComing = moment(quiz.startStamp).utcOffset(quiz.timeZone).diff(moment().utcOffset(quiz.timeZone)) > 0? true:false;


	 		if(live){
	 			if(upComing){
	 				res.send({error:'this quiz have not started yet.'})
	 			}else{
	 				// live validated quiz 
	 				res.json(quiz);
	 			}
	 		}else{
	 			res.json({error:'this quiz has been expired.'})
	 		}

	 	}else{
	 		res.send({error:'quiz not foud.'})
	 	}
	 },
	 getQuizAns:async(req,res,next)=>{
	 	const {id} = req.params
	 	const quiz = await Quiz.findById(id).populate('questions');
	 	console.log(id);
	 	res.json(quiz);
	 },
	 userSubmit: async (req,res,next)=>{
	 	const {body} = req;
	 
	 	const newQuizSubmit = new quizSubmit(body);
	 	const qs = await newQuizSubmit.save();

	 	const quiz = await Quiz.findById(body.quizId);

	 	const participants = await  quizSubmit.find({quizId:body.quizId})
	 		quiz.participants = participants.length;

	 	await quiz.save();

	 	res.send({qs,quiz});
	 },

	 serveResult: async(req,res,next)=>{
	 	// _[0] = quiz id || _[1] = user id || _[2] = length of current iems
	 	const {id} = req.params; 
	 	const ___ = id.split('+');
	 	const skip = parseInt(___[2])
	 	const temp = await userQuizResult.find();



	 	const resultList = await userQuizResult.find({quizId:___[0]})
	 									 .sort({resultLength:-1,timeSpan:1})
	 									 .populate('user')
	 									 .limit(10)
	 									 .skip(skip);

        const count = await userQuizResult.count({quizId:___[0]});

        const quiz = await Quiz.findById(___[0]).populate('questions');

        const userAnswer = await userQuizResult.findOne({user:___[1],quizId:___[0]})
        									   .populate('user')




        const qzfunc = async (_)=>{

        	// const date = moment().add(10000,'milliseconds').toISOString();
        	const startT = _.startStamp;
        	const startdate = moment(startT).utcOffset(_.timeZone).toISOString();
        	const endDate = moment(startT).utcOffset(_.timeZone).add(_.duration,`days`).toISOString();
        	console.log(startdate);

        		// validate ans..
        		const que = await Quiz.findById(_.id).populate('questions');
        		const qs = await quizSubmit.find({quizId:_.id}); 

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

        				const newUqr = new userQuizResult(data);

        				await newUqr.save();
        			})

        			// ok
        		 	const resultList = await userQuizResult.find({quizId:_.id})
        		 									 .sort({resultLength:-1,timeSpan:1})
        		 									 .populate('user')

        	        resultList.map(async (d,i)=>{
        	        	d.rank = i + 1;

        	        	console.log(i);
        	        	await d.save();
        	        })
        		}

        		// updating quiz status
        		que.resultStatus = true;
        		await que.save();
				
				console.log('ended');

				// sending new updaed data
				const __ = id.split('+');

					 	const _resultList = await userQuizResult.find({quizId:__[0]})
					 									 .sort({resultLength:-1,timeSpan:1})
					 									 .populate('user')
					 									 .limit(10)
					 									 .skip(skip);

				        const _count = await userQuizResult.count({quizId:__[0]});

				        const _quiz = await Quiz.findById(__[0]).populate('questions');

				        const _userAnswer = await userQuizResult.findOne({user:__[1],quizId:__[0]})
				        									   .populate('user')
                        res.send({resultList:_resultList,quiz:_quiz,userAnswer:_userAnswer,count:_count});

        }

        const end_date = moment(quiz.startStamp).utcOffset(quiz.timeZone).add(quiz.duration,`days`).diff(moment().utcOffset(quiz.timeZone));

        console.log(end_date);

        if(end_date > 0){

        	res.send({error:'you have to wait untill quiz ends'})

        }else{

	        if(!quiz.resultStatus){
				qzfunc(quiz);
	        }else{
	        	res.send({resultList,quiz,userAnswer,count});
	        }

        }

        

	 }
}