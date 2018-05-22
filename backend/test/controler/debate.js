const user = require('../models/user');
const more = require('../models/more');
const post = require('../models/post');
const comment = require('../models/comment');
const like = require('../models/like');
const poleVote = require('../models/poleVote');
const debateComment = require('../models/debateComment');
const dislike = require('../models/dislike');

module.exports = {
	// post : pole vote 
	poleVote:async (req,res,next)=>{
		const {body} = req
		console.log(body);
		const pv = await poleVote.findOne({postId:body.postId,userId:body.userId});


		if(!pv){
			const Post = await post.findById(body.postId);

			const newPoleVote = new poleVote(body);
			Post.poleVotes.push(newPoleVote);
			await newPoleVote.save();
			await Post.save();

			console.log(Post);
			res.send(newPoleVote);
		}else{
			const pole = await post.findById(pv.postId);

			res.send({error:'you have allredy voted!',pv})
		}
	},
	// get : debate vote
	get: async (req,res,next)=>{
		const {id} = req.params;

		const _ = id.split('+');
		const userId = _[0];
		const postId = _[1];

		console.log({userId,postId})

		const pv = await poleVote.findOne({userId,postId});

		if(pv){
			res.json(pv);
		}else{
			// if not found
			res.send(null)
		}
	},

	// post: commnets
	postComment: async (req,res,next)=>{
		const {body} = req;
		const Post = await post.findById(body.post);

		// finding post
		if(Post){

			// if commnet is empty 
			if(body.comment === ''){
				res.send({error:'comment can\'t be empty!'})
			}else{
				// if everythig went okay then
				const newDebateComment = new debateComment(body);
				Post.poleComments.push(newDebateComment);
				await newDebateComment.save();
				await Post.save();
				console.log(Post);
				res.send(newDebateComment);
			}
		}else{
			// if post is not found
			res.send({error:'post does not exist!'})
		}
		
	},

	// edit commet
	putComment: async (req,res,next)=>{
		const {body} = req;
		const dc = await debateComment.findById(body._id).populate('user');

		if(dc){

			if(dc.user._id.toString() === body.cUser.toString()){
				dc.comment = body.comment;
				await dc.save();
				res.send({edited:true,data:dc})
			}else{
				res.send({error:'you can\' edit this comment'})
			}

		}else{
			res.send({error:'commet not found'})
		}

	},

	deleteComment: async (req,res,next)=> {
		// _[0] comment id || _[1] user id 
		const {id} = req.params;
		const _ = id.split('+')

		const dc = await debateComment.findById(_[0]).populate('user');

		if(dc){

			if(dc.user._id.toString() === _[1].toString()){

				if(dc.reply){
					await dc.remove();

					res.send({deleted:true,type:'rep',data:dc})
				}else{
					await dc.remove();
					res.send({deleted:true,type:'cmt',data:dc})
				}
			}else{
				// unauthorized
				res.send({error:'you can\' delete this comment'})
			}
		}else{
			// cmt not found
			res.send({error:'comment not found'})
		}

		res.send(id);
	},

	// get commnets
	getComment:async(req,res,next)=>{
		// 1st postId 2nd userId
		const {id} = req.params;
		const {skip} = req.params;
		const _ = id.split('+');

		const p = _[0];
		const u = _[1];

		const Post = await post.findById(p).deepPopulate('poleComments.user poleComments.likes poleComments.dislikes poleComments.replys.user poleComments.replys.likes poleComments.replys.replyedTo')
										   .populate({path:'poleComments',options: {limit: 5,sort: { created: -1 },skip:parseInt(skip)} })

		res.send(Post)
	},

	// get: single comment
	singleComment: async(req,res,next)=>{

		const {id} = req.params;

		const dc = await debateComment.findById(id).populate('user')

		dc?res.send(dc):res.send({error:'sonthing went wrong , try again'});


	},


	// submit like
	postLike: async(req,res,next)=>{
		const {body} = req;

		if(body.type === 'debate_cmt'){

			// removing cmt dislike if exist
			const Dislike = await dislike.findOne(body)

			if(Dislike){
				// pulling saved dislike id from debate comment
				const what = await debateComment.update({_id:body.post},{$pull:{dislikes:Dislike._id}})
				//deleting dislike
				await Dislike.remove();
			}


			// handleing like ---
			const Like = await like.findOne(body)

			if(!Like){

				// liking commnet 
				let newLike = new like(body);
				// finding debateCommet
				let dc = await debateComment.findById(body.post).populate('likes');
					dc.likes.push(newLike);

					// updating likes_length 
					dc.likes_length = dc.likes.length;

					await newLike.save();
					await dc.save();

					res.send({like:true,data:newLike,previous:Dislike,dc});
			}else{
				// pulling saved like id from debate comment
				const what = await debateComment.update({_id:body.post},{$pull:{likes:Like._id}})


				// updating likes_length 
				let dc = await debateComment.findById(body.post).populate('likes');
				dc.likes_length = dc.likes.length;
				await dc.save();

				//deleting like
				await Like.remove();
				res.send({like:false,data:Like,previous:Dislike,dc});
			}

		}
	},

	// submit dislike
	postDislike: async(req,res,next)=> {
		const {body} = req;

		if(body.type === 'debate_cmt'){

			// removing cmt like if exist
			const Like = await like.findOne(body)

			if(Like){
				// pulling saved like id from debate comment
				const what = await debateComment.update({_id:body.post},{$pull:{likes:Like._id}})

				// updating likes_length 
				let dc = await debateComment.findById(body.post).populate('likes');
				dc.likes_length = dc.likes.length;
				await dc.save();

				// deleting like
				await Like.remove();
			}

			

			// handleing dislike ---
			const Dislike = await dislike.findOne(body)

			if(!Dislike){

				// disliking commnet 
				let newDislike = new dislike(body);
				// finding debateCommet
				let dc = await debateComment.findById(body.post).populate('likes');
					dc.dislikes.push(newDislike);
					await newDislike.save();
					await dc.save();
					res.send({dislike:true,data:newDislike,previous:Like,dc});
			}else{
				// pulling saved dislike id from debate comment
				const what = await debateComment.update({_id:body.post},{$pull:{dislikes:Dislike._id}})
				//deleting dislike

				await Dislike.remove();
				res.send({dislike:false,data:Dislike,previous:Like,what});
			}

		}

	},


	// handleing replys

	// post commnet replys submit
	postCommentReply:async(req,res,next)=>{

		const {body} = req;


		const dc = await debateComment.findById(body.post);

		if(dc){

			// preventing comment fron being empty
			if(body.comment === '' || body.commnet === null){
				res.send({error:'comment can\'t be empty'})
			}else{
				const newDC = new debateComment(body);
				const parentPost =  await debateComment.findById(dc.post);


				
				if(body.replyedTo){
					// for comment > reply > repay

					parentPost.replys.push(newDC);

					// adding the replys_length for sorthing by most replys
					parentPost.replys_length = parentPost.replys.length; 

					await newDC.save();
					await parentPost.save();

					// pupulating stuffs	
					const final = await debateComment.findById(newDC._id).deepPopulate('replyedTo user')
					res.send(final)
				}else{
					// for comment > reply 
					dc.replys.push(newDC);

					// adding the replys_length for sorthing by most replys
					dc.replys_length = dc.replys.length;
					await newDC.save();
					await dc.save();
						

					const final = await debateComment.findById(newDC._id).deepPopulate('user')
					res.send(final)
				}
			}
			
			
		}else{

			res.send({error:'commnet  not found!'});

		}

	},


	// get more comment replys..
	moreReplys:async(req,res,next)=>{

		// _[0] is id , _[1] number of skip 
		const {id} = req.params
		const _ = id.split('+')
		const dc =  await debateComment.findById(_[0])
		                               .deepPopulate('replys.user replys.replyedTo replys.likes')
		                               .populate({path:'replys',options:{limit:10,skip:parseInt(_[1])}})
		res.send(dc)
	},

	// get sorted
	sortedComment:async(req,res,next)=>{
		// type of sorting = _[0] || post id = _[1] || skip = _[2]
		// sort: { likes_length: -1 } || sort: { reply_length: -1 } || sort: { created: -1 }
		// types of requests =  'latest' ||  'most_replyed'  ||  'most_liked'
		const {id} = req.params;

		const _ = id.split('+');

		const skip = _[2];


		// // for traking comment reply
		const cmt = _[3] !== 'null'? await debateComment.findById(_[3]):null;

		let cid = () => {
			if(cmt){
				if(cmt.reply){
					return cmt.post
				}else{
					return cmt._id;
				}
			}else{
				return null;
			}
		}


        if(_[0] === 'latest'){

        	const Post = await post.findById(_[1]).deepPopulate('poleComments.user poleComments.likes poleComments.dislikes poleComments.replys.user poleComments.replys.likes poleComments.replys.replyedTo')
        									   .populate({path:'poleComments',match:{_id:cid()},options: {limit: 5,sort: { created: -1 },skip:parseInt(skip)} })
        	res.send(Post)
        }

        else if(_[0] === 'most_replyed'){
        	const Post = await post.findById(_[1]).deepPopulate('poleComments.user poleComments.likes poleComments.dislikes poleComments.replys.user poleComments.replys.likes poleComments.replys.replyedTo')
        									   .populate({path:'poleComments',options: {limit: 5,sort: { replys_length: -1 },skip:parseInt(skip)} })
        	res.send(Post)
        }

        else if(_[0] === 'most_liked'){
        	const Post = await post.findById(_[1]).deepPopulate('poleComments.user poleComments.likes poleComments.dislikes poleComments.replys.user poleComments.replys.likes poleComments.replys.replyedTo')
        									   .populate({path:'poleComments',options: {limit: 5,sort: { likes_length: -1 },skip:parseInt(skip)} })
        	res.send(Post)
        }

        else{
        	res.send('nothin')
        }

	}


}