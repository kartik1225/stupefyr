const user = require('../models/user');
const more = require('../models/more');
const post = require('../models/post');
const comment = require('../models/comment')
const like = require('../models/like');
const moviePage = require('../models/moviePage');
const moviePost = require('../models/moviePost');
const dislike = require('../models/dislike');
const cast = require('../models/cast');
const rating = require('../models/movieRating');
const notify = require('../models/notify');

module.exports = {
	
	newNf:async(req,res,next)=>{
		const {id,skip} = req.params;

		const Notify = await notify.find({user:id}).sort({created:-1}).limit(5).skip(parseInt(skip)); 

		if(Notify.length === 0){
			res.send({error:'nothing more to load'});
		}else{
			res.send(Notify);
		}



	},
	allNf:async(req,res,next)=>{
		const {id,skip} = req.params;

		const Notify = await notify.find({user:id}).sort({created:-1}).limit(20).skip(parseInt(skip));

		if(Notify.length === 0){
			res.send({error:'nothing more to load'});
		}else{
			res.send(Notify);
		}



	},
	seen:async(req,res,next)=>{
		const {id} = req.params;
		const Notify = await notify.find({user:id});

		Notify.map( async d=>{
			d.seen = true;
			await d.save();
		});

		res.send(Notify);
	}

}