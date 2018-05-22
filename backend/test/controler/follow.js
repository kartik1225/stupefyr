const user = require('../models/user');
const more = require('../models/more');
const post = require('../models/post');
const comment = require('../models/comment');
const like = require('../models/like');
const follow = require('../models/follower');

module.exports = {
	storeFollow:async (req,res,next)=> {

		const Follow = await follow.findOne({user:req.body.user,follow:req.body.follow});
		const Self =  await user.findById(req.body.user);
		const Other = await user.findById(req.body.follow);

		if(!Follow){
			const newFollow = new follow(req.body);
			Self.followings.push(newFollow)
			Other.followers.push(newFollow)

			await newFollow.save();
			await Self.save();
			await Other.save();

			res.send({result:true,follow:newFollow})

		}else{
			// self
			await user.update({_id:Follow.user},{$pull:{followings:Follow._id}});
			// other
			await user.update({_id:Follow.follow},{$pull:{followers:Follow._id}});
		    await follow.findByIdAndRemove(Follow._id);
		    res.send({result:false})
		}

	}
}