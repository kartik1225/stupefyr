const user = require('../models/user');
const more = require('../models/more');
const post = require('../models/post');
const comment = require('../models/comment')
const like = require('../models/like')
module.exports = {

	// get
	getpost:async (req,res,next)=> {
		const { id }= req.params;
		const Post = await post.findById(id).populate({path:'user',select:['name','image','_id']});
		Post?res.send(Post):res.send('post not found');
	},

	// put
	useredit:async (req,res,next)=> {
		const body = req.body;
		const {id} = req.params;
		const User = await user.findById(body.user)
		if(User){
			User.cover = body.cover
			await User.save()
			res.send(User)
		}else{
			res.send({error:'user is not found.'})
		}
	},

	oneuser:async (req,res,next)=> {
		const {id} = req.params;

		const User = await user.findById(id);
		User?res.send(User):req.send({error:'no user found'});
	},

	singleListPost:async (req,res,next)=>{

		const {pid} = req.query;

		console.log(pid);

		const Post = await post.find({_id:pid}).populate('user').populate('likes').sort({created: -1})
							   .deepPopulate('movieId.user movieId.movieId movieId.likes movieId.dislikes likes.post')

		res.send(Post);
	}
}