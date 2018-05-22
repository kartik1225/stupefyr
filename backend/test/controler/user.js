const user = require('../models/user');
const more = require('../models/more');
const post = require('../models/post');
const comment = require('../models/comment')
const like = require('../models/like')
const poleVote = require('../models/poleVote')
module.exports = {
	index:(req,res,next)=>{
	  	  	res.send({name:'kartik'})
	},
	isvalid:(req,res,next)=> {
		res.send(true)
	},
	// get 
	feed:async(req,res,next)=>{
		const {id ,start} = req.params
		const User = await user.findById(id).populate('followings')

		const _users = await User.followings.map( d=>{
			return d.follow
		});
		_users.push(id);
		const Post = await post.find({'user':{$in:_users}}).populate('user').populate('likes').sort({created: -1}).skip(parseInt(start)).limit(10)
							   .deepPopulate('movieId.user movieId.movieId movieId.likes movieId.dislikes likes.post')
		Post.length !== 0 ? res.json(Post):(console.log('lol'),res.json({error:true}));
	},

	// get user's  all pictures
	userpictures:async (req,res,next)=> {
		const {id} = req.params;
		const Pics = await post.find({user:id})
		const _pics = await Pics.filter( d=>{
			return d.image !== '';
		})
		res.send(_pics);
	},

	user:(req,res,next)=> {
		res.json({name:'kartik'})
	},	
	more:async (req,res,next) => {
		const User = await user.findById('599c98f8169c236fc43e5cd6').populate('more')
		const newMore = new more({native:'599c98f8169c236fc43e5cd6'})
		User.more = newMore;
		await newMore.save();
		User.more.push(newMore);
		await User.save();
		res.send(User);

	},
	//post
	getuser:async (req,res,next)=>{
		const  { userid }  = req.value.params;
		console.log(userid);
		const all = await user.findById(userid).populate('followers');
		res.status(200).json(all);
	},
	//put
	edituser:async(req,res,next)=>{
		const {proImg , id} = req.body
		console.log(proImg)
		const User = await user.findById(id);
		console.log(User)
		      User.image = proImg;
		      await User.save();
		res.send(User)
	},
	//post
	postcreate:async (req,res,next)=> {
		const body = req.body;
		const User = await user.findById(body.user) || false;
			if(User){
				const newPost = new post(body)
				User.posts.push(newPost);
				await User.save();
				console.log(User)
				if(req.body.image || req.body.caption || req.body.pole){
					await newPost.save();
					const final = await await post.findById(newPost._id).populate({path: 'user', select: ['name','image']}).populate('likes',"-_id -__v -created -post")
					res.send(final)
				} else{ res.json({error:'empty post is not allowed'})}
				
			}else{
				res.json({error:'user does not exist in database!'})
			}
				
	},
	//get single user posts
	postget:async(req,res,next)=> {
		const {id,start} =req.params;
		// const Post = await user.findById(id).populate('posts');
		const Post = await post.find({user:id}).populate({path: 'user', select: ['name','image']}).populate('likes',"-_id -__v -created -post").sort({created: -1}).skip(parseInt(start)).limit(10)
								.deepPopulate('movieId.user')
		console.log(Post.length)
		Post.length !== 0 ? res.json(Post):(console.log('lol'),res.json({error:true}));
	},
	//delete
	postdelete:async (req,res,next)=> {
		const {id} = req.params
		const result = id.split('+');
		const Post = await post.findById(result[0]).deepPopulate('comments.likes').populate('likes')
		if(Post){
			if(result[1] === Post.user.toString()){
				await post.findByIdAndRemove(Post._id, async (err,post)=>{
					err?res.send({result:err}):null

				})
					res.send({result:'post deleted'});
		    }else{res.send({result:'this user is not allowed to delete this post'})}
		}else{
			res.send({result:'post not found'})
		}
		console.log(user)
	},
	postedit:async (req,res,next)=> {
		const {id} = req.params
		const result = id.split('+');
		// console.log(result[0])
		const Post = await post.findById(result[0])
		if(Post){
			if(Post.user.toString() === result[1]){
				// setting updated post
				Post.user = req.body.user;
          		Post.caption = req.body.caption;
          		Post.image = req.body.image;
          		Post.onlycaption = req.body.onlycaption;
          		Post.font = req.body.font;

				await Post.save();
				const final = await post.findById(Post._id).populate({path: 'user', select: ['name','image']}).populate('likes',"-_id -__v -created -post")
				res.send({result:'post updated',post:final})
			}else{console.log(false)};
		}else{
			res.send({result:'error while edting post'})
		}

	},
	//post
	postlike:async (req,res,next)=>{
		const { id } =req.params;
		const Like = await like.findOne({user:req.body.user,post:req.body.post})
		//removing likes
		if(Like){
			await post.update({_id:Like.post},{$pull:{likes:Like._id}})
			const  l = await like.findByIdAndRemove(Like._id)
			console.log(Like)
			res.send({liked:false})
		}else{
		//ragistaring new like
		const newLike = await new like(req.body)
		const Post = await post.findById(req.body.post)
			  Post.likes.push(newLike)
			  await Post.save();
			  await newLike.save();
		res.send({liked:true,data:newLike})
		}

	},
	// new comment functions

	// post request
	submitCmt:async(req,res,next)=>{
		const {body} = req;

		// if commnet is not empty

		if(body.comment !== ''){
			const newCmt = new comment(body);
			const p = await post.findById(body.post);

			if(p){
				p.comments.push(newCmt);
				// updating commnet length
				p.comment_length = p.comments.length;

				// saving stuffs
				await p.save();
				await newCmt.save();
				const final = await comment.findById(newCmt.id)
										   .populate({path:'user replyedTo'})

				res.send({cmt:final});
			}else{
				res.send({error:'post not found'});
			}
		}else{	
			res.send({error:'comment should not be empty'})
		}


	},

	submitCmtReply:async(req,res,next)=>{
		const {body} = req;
		const newReply = new comment(body);

		const parent = await comment.findById(body.post);

		if(parent){	
			// pushing id
			parent.replys.push(newReply);
			// storeing comment length
			parent.reply_length = parent.replys.length;
			// saving stufs
			await newReply.save();
			await parent.save();


			const final = await comment.findById(newReply._id)
			                           .populate({path:'user replyedTo'})

			res.send(final);

		}else{
			// parent cmt is not found
			res.send({error:'comment not found'})
		}

	},

	submitCmtChaildReply:async(req,res,next)=>{
		const {body} = req;
		const newReply = new comment(body);

		const parent = await comment.findById(body.post);



			if(parent){	
				// pushing id
				parent.replys.push(newReply);
				// storeing comment length
				parent.reply_length = parent.replys.length;
				// saving stufs
				await newReply.save();
				await parent.save();

				const final = await comment.findById(newReply._id)
										   .populate({path:'user replyedTo'})

                console.log('parent',parent);

				res.send(final);


			}else{
				// parent cmt is not found
				res.send({error:'comment not found'})
			}


	},

	loadMoreReplys:async(req,res,next)=>{
		// _[0] = post id ||  _[1] skip 

		const {id} = req.params;
		const _ = id.split('+');


		const replys = await comment.findById(_[0])
									  .deepPopulate('replys.user replys.likes replys.replyedTo')
									  .populate({path:'replys',options:{limit:10,skip:parseInt(_[1])}})
			  if(replys.replys.length === 0){
			  	res.send({warn:'nothing more to load..'})
			  }else{
				res.send(replys.replys);
			  }
	},

	cmtLike:async(req,res,next)=>{

		const {body} = req;


		

		const parent = await comment.findById(body.post);

		if(parent){

			const oldLike = await like.findOne(body);

			if(oldLike){
				// dislike
				await comment.update({_id:parent._id},{$pull:{likes:oldLike._id}});	

				const updated = await comment.findById(parent._id);

				updated.like_length = updated.likes.length;
				await updated.save()
				await oldLike.remove();
				res.send({liked:false,data:oldLike});

			}else{
			   // like
			   const newLike = new like(body);
			   // push
			   parent.likes.push(newLike);

			   // counting lenght
			   parent.like_length = parent.likes.length;

			   await newLike.save();
			   await parent.save();

			   res.send({liked:true,data:newLike});
			} 

		}else{
			res.send({error:'post not found!'})
		}

	},

	editCmt:async(req,res,next)=>{
		const {body} = req;

		const cmt = await comment.findById(body._id);

		if(cmt){

			if(body.cuser.toString() === cmt.user.toString()){

			cmt.comment = body.comment;

			await cmt.save();

			res.send({done:true});

			}else{
				res.send({error:'you cant make changes on this comment.'})
		
			}

		}else{
			res.send({error:'comment not found'})
		}

	},
	deleteCmt:async(req,res,next)=>{
		// _[0] = comment id + cUser

		const {id} = req.params;
		const _ = id.split('+');
		const cmt = await comment.findById(_[0]) 


		// removing reply length..

			if(cmt.user.toString() === _[1].toString()){

				if(cmt){
					await comment.update({_id:cmt.post},{$pull:{replys:_[0]}})
					await cmt.remove();
					const final = await comment.findById(cmt.post);
					final.reply_length = final.replys.length;
					await final.save();
					res.send(final)
				}else{
					res.send({error:'comment is not found!'})                  
				}

			}else{
				res.send({error:'only owner can delete this comment.'})
			}


	},

		getSortedPost:async(req,res,next)=>{

			// _[0] = post id || _[1] = sort type || _[2] = skip  

			const {id} = req.params;
			const _ = id.split('+')

			// const {id} = req.params;

			let skip = _[2];

			// // for traking comment reply
			const cmt = _[3] !== 'null'? await comment.findById(_[3]):null;

			let cid = () => {
				if(cmt){
					if(cmt.replyedTo){
						return cmt.post
					}else{
						return cmt._id;
					}
				}else{
					return null;
				}
			}


			// likes	
			if(_[1] === 'latest'){
				const sorted = await post.findById(_[0]).deepPopulate('comments.user comments.likes comments.replyedTo likes user comments.replys.likes comments.replys.user comments.replys.replyedTo' )
										  .populate({ path:'comments', match:{_id:cid()} ,options: {limit: 5,sort: { created: -1 },skip:parseInt(skip)}})	

					if(skip !== 0 && sorted.comments.length === 0){
						res.send({warn:'no more comments to load...'})
					}else{

						res.send(sorted);

					}
			}
			
			else if(_[1] === 'most_replyed'){							  
			// reply
			const sorted = await post.findById(_[0]).deepPopulate('comments.user comments.likes comments.replyedTo likes user comments.replys.likes comments.replys.user comments.replys.replyedTo')
										  .populate({ path:'comments',options: {limit: 5,sort: { reply_length: -1 },skip:parseInt(skip)}})

					if(skip !== 0 && sorted.comments.length === 0){
						res.send({warn:'no more comments to load...'})
					}else{

						res.send(sorted);

					}
			}

			else if(_[1] === 'most_liked'){
	        // created
	        const sorted = await post.findById(_[0]).deepPopulate('comments.user comments.likes comments.replyedTo likes user comments.replys.likes comments.replys.user comments.replys.replyedTo')
	        							  .populate({ path:'comments',options: {limit: 5,sort: { like_length: -1 },skip:parseInt(skip)}})

	        	    	if(skip !== 0 && sorted.comments.length === 0){
	        	    		res.send({warn:'no more comments to load...'})
	        	    	}else{
	        	    		res.send(sorted);
	        	    	}

	        }else{
	        	res.send({error:'need to specify sorthing type....'})
	        }

		},




	// ignore from below
	commentcreate:async(req,res,next)=> {
		const { id } = req.params;
		const newComment = await new comment(req.body)
		const Post = await post.findById(req.body.post)


		if(Post){

			if(req.body.comment === null || req.body.comment === ' '){
				res.send({error:'comment can\'t be empty!'})
			}else{
				Post.comments.push(newComment);
				await newComment.save();
				await Post.save();
				const send = await comment.findById(newComment._id).populate('user')
				res.send(send)
			}
		}else{
			res.send({error:'post not found!'})
		}
	},
	commentget:async(req,res,next)=> {
		const {id} = req.params
		const Comment = await post.findById(id).deepPopulate('comments.user comments.likes')
		res.send(Comment.comments)
	},
	//post
	postcommentlike:async (req,res,next)=> {
		const { id } =req.params;
		const Like = await like.findOne({user:req.body.user,post:req.body.post})
		//removing likes
		if(Like){
			await comment.update({_id:Like.post},{$pull:{likes:Like._id}})
			await like.findByIdAndRemove(Like._id)
			console.log(Like)
			res.send({liked:false})
		}else{
		//ragistaring new like
		const newLike = await new like(req.body)
		const Comment = await comment.findById(req.body.post)
			  Comment.likes.push(newLike)
			  await Comment.save();
			  await newLike.save();
		res.send({liked:true})
		}
	},
	// comment edit
	commetedit: async (req,res,next)=> {
		const Comment = await comment.findById(req.body.post).populate('user')
		if(Comment.user._id.toString() === req.body.user.toString()){
		await comment.findOneAndUpdate({_id:req.body.post},{$set:{comment:req.body.update}})
		const final = await comment.findById(req.body.post).populate('user')
			res.send({success:true,comment:final})
	    }else{
	    	res.send({error:'bad user data',success:false})
	    }
	},
	commentdelete: async(req,res,next)=> {
		// [1]post [2]cmtpost
		const result = req.params.id.split('+');

		// finding post
		const Comment = await comment.findById(result[0]).populate('user')

		 // verifying user 
		 if(Comment.user._id.toString() === result[1].toString()){
		 	await comment.findByIdAndRemove(result[0])
		 	res.send({result:'comment got deleted'})
		 }else{
		 	res.send({error:'this user is not valid'})
		 }

	}
}