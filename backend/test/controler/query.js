const user = require('../models/user');
const more = require('../models/more');
const post = require('../models/post');
const comment = require('../models/comment');
const like = require('../models/like');
const follow = require('../models/follower');

module.exports = {
	getquery:async (req,res,next)=> {
		const User = await user.find({$text: {$search:req.query.q}})
		res.send(User)
	}
}