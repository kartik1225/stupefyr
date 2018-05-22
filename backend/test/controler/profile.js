const user = require('../models/user');
const more = require('../models/more');
const post = require('../models/post');
const comment = require('../models/comment')
const like = require('../models/like')
const poleVote = require('../models/poleVote')

module.exports = {
	displayName:async(req,res,next)=>{
		const {userId,displayName} = req.body;


			const User = await user.findById(userId);
			
			if(User){
				User.displayName = displayName; 

				res.send({updated:true,data:User})
			}else{
				res.send({error:'user not found'})
			}

	}
}