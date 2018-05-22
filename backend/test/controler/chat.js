const user = require('../models/user');
const more = require('../models/more');
const post = require('../models/post');
const comment = require('../models/comment')
const like = require('../models/like');
const chat = require('../models/chat')

module.exports = {
	all:async(req,res,next)=>{
		const {id} = req.params;
		const User = await user.findById(id).deepPopulate('followings.follow')
		res.send(User.followings)
	},

	// all routes are in testing phase
	sendmsg:async(req,res,next)=> {
		const {body}= req;
		const newChat = new chat(req.body)
			  await newChat.save();
		res.send(newChat);
	},
	getmsg:async(req,res,next)=> {
		const {id} = req.params;
		const result = id.split('+')
		const Chat = await chat.find({$or: [ {user:result[0],to:result[1]},{user:result[1],to:result[0]} ] })
		res.send(Chat);
	}
}
