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

module.exports = {
	submitMovie:async(req,res,next)=>{
		const {body} = req;

		const newMovie = new moviePage(body);
		await newMovie.save();
		res.send({newMovie});
	},
	getMovie:async(req,res,next)=>{
		// _[0] = movieId || _[1] userId
		const {id} = req.params;	
		const _ = id.split('+')
		const mp = await moviePage.findById(_[0]).populate({path:'castings',populate:{path:'likes'}});


		if(mp){

			const ur = await rating.findOne({$and:[{user:_[1]},{movieId:_[0]}]});

			ur? mp.userRating = ur : null;
			res.send({movie:mp});
		}else{
			res.send({error:'movie not found'});
		}

	},
	query:async(req,res,next)=>{
		const {comp,ms} = req.query;

		if(comp){
			const movies = await moviePage.findOne({title:comp})

			if(movies){
				res.send(movies);
			}else{
				res.send({success:'not found'});
			}
		}

		// movie search
		if(ms){

			let regex = new RegExp(ms,'i');
			const result = await moviePage.find(  { "title": regex});
			res.send(result);
		}
	},
	// compare tmdb id 
	findMovie:async(req,res,next)=>{
		const {id,tmdb} = req.query;

		if(tmdb){
			const mp = await moviePage.findOne({tmdbId:tmdb});
			if(mp){
				res.send(mp)
			}else{
				res.send({error:'content not found..'});
			}
		}else if(id){
			const mp = await moviePage.findById(id);
			if(mp){
				res.send(mp)
			}else{
				res.send({error:'content not found..'});
			}
		}
		else{
			res.send({error:'id can\' be empty.'})
		}

		res.send(mp);
	},
	ratingSubmit:async(req,res,next)=>{
		const {body} = req;

		const previos = await rating.findOne({$and:[{movieId:body.movieId,user:body.user}]})


		const avrage = (body.rating.casting + body.rating.dir + body.rating.ent + body.rating.story ) / 4;

		const mv = await moviePage.findById(body.movieId);

		if(mv){
			if(!previos){

				const newRating = new rating({
					rating:body.rating,
					avrage:avrage.toFixed(1),
					user:body.user,
					movieId:body.movieId
				});

				const movie = await moviePage.findById(body.movieId).populate('ratings'); 
				movie.ratings.push(newRating);
				movie.ratings_length = movie.ratings.length;

				const all = [];
				movie.ratings.map(d=>{
					all.push(d.avrage);
				})

				const  sum = all.reduce((a,b)=> a+b) / all.length;

				movie.avrRating = sum.toFixed(1);

				movie.ratings.map(d=>{
					all.push(d.avrage);
				});

				await movie.save();
				await newRating.save();

				res.send({rating:newRating,avrRating:movie.avrRating});

			}else{

				previos.rating = body.rating;
				previos.avrage = avrage.toFixed(1);

				const movie = await moviePage.findById(body.movieId).populate('ratings'); 
				const all = [];
				movie.ratings.map(d=>{
					all.push(d.avrage);
				})

				const  sum = all.reduce((a,b)=> a+b) / all.length;
				movie.avrRating = sum.toFixed(1);

				await previos.save();
				await movie.save();

				res.send({rating:previos,avrRating:movie.avrRating});

				
			}
		}else{
			res.send({error:'movie is not found!'})
		}


	},

	// movie post handlers...
	newPost:async(req,res,next)=>{

		const {body} = req;

		const newPost = new moviePost(body);

		const Post = new post({
			movieId:newPost._id,
			user:newPost.user
		}) 

		await newPost.save();
		await Post.save();

		const final = await moviePost.findById(newPost._id).populate({path:'user movieId'})
		res.send({newPost:final});
	},

	// need to add the lim... 
	// all 
	getPost:async(req,res,next)=>{
		const {id} = req.params;
		const skip = 0;

		const post = post.find()

		const mp = await moviePost.find({movieId:id}).populate('user')
		                          .populate('movieId')
								  .deepPopulate('likes dislikes')
		res.send(mp); 
	},

	getReviewPost:async(req,res,next)=>{
		// _[0] = movieID || _[1] = sortType || len
		const {id} = req.params;
		const _ = id.split('+')
		const skip = 0;
		const sortBy = _[1] === 'Latest'?{created:-1}: _[1] === 'Most Replyed'?{comment_length:-1}:_[1] === 'Most Liked'?{likes_length:-1}:{created:-1};



		const mp = await moviePost.find({$and:[{movieId:_[0]},{type:'review'}]}).populate('user').sort(sortBy).limit(10).skip(parseInt(_[2]))
		                          .populate('movieId')
								  .deepPopulate('likes dislikes')

		if(mp.length === 0){
			res.send({error:'nothing more to load...'});
		}else{
			res.send(mp); 
		}								  

	},

	getBestPartPost:async(req,res,next)=>{
		// _[0] = movieID || _[1] = sortType || len
		const {id} = req.params;
		const _ = id.split('+')
		const skip = 0;
		const sortBy = _[1] === 'Latest'?{created:-1}: _[1] === 'Most Replyed'?{comment_length:-1}:_[1] === 'Most Liked'?{likes_length:-1}:{created:-1};



		const mp = await moviePost.find({$and:[{movieId:_[0]},{type:'best_part'}]}).populate('user').sort(sortBy).limit(10).skip(parseInt(_[2]))
		                          .populate('movieId')
								  .deepPopulate('likes dislikes')

		if(mp.length === 0){
			res.send({error:'nothing more to load...'});
		}else{
			res.send(mp); 
		}	


	},
	like:async(req,res,next)=>{
		const {body} = req;

		const oldLike = await like.findOne(body);

		const newLike = new like(body);

		// removing dislike if exist
		const oldDislike = await dislike.findOne(body);
		if(oldDislike){

			// pulling dislikes from movie post arrays
			await moviePost.update({_id:body.post},{$pull:{dislikes:oldDislike._id}})

			await oldDislike.remove();
			const mp = await moviePost.findById(body.post);
		}

		// dislike
		if(oldLike){

			// pulling likes from movie post arrays
			await moviePost.update({_id:body.post},{$pull:{likes:oldLike._id}})

			// updating likes length
			const mp = await moviePost.findById(body.post);
			mp.likes_length = mp.likes.length;
			await mp.save();

			// removing exixting dislike
			await oldLike.remove();

			res.send({liked:false,mp,previous:oldDislike,data:oldLike});


		}else{
			//like
			const mp = await moviePost.findById(body.post);
			mp.likes.push(newLike);
			mp.likes_length = mp.likes.length;

			// savinng 
			await newLike.save();
			await mp.save();

			res.send({liked:true,mp,previous:oldDislike,data:newLike});
		}
	},
	dislike:async(req,res,next)=>{
		const {body} = req;
		const newDislike = new dislike(body);
		const oldDislike = await dislike.findOne(body);

		// removing likes if its exist...
		const oldLike = await like.findOne(body);

		if(oldLike){
			// pulling likes from movie post arrays
			await moviePost.update({_id:body.post},{$pull:{likes:oldLike._id}})

			// updating likes length
			const mp = await moviePost.findById(body.post);
			mp.likes_length = mp.likes.length;
			await mp.save();

			// removing exixting dislike
			await oldLike.remove();
		} 


		if(oldDislike){

			// pulling dislikes from movie post arrays
			await moviePost.update({_id:body.post},{$pull:{dislikes:oldDislike._id}})

			await oldDislike.remove();
			const mp = await moviePost.findById(body.post);
			res.send({disliked:false,mp,previous:oldLike,data:oldDislike});
		}else{
			const mp = await moviePost.findById(body.post);
			mp.dislikes.push(newDislike);
			await newDislike.save();
			await mp.save();

			res.send({disliked:true,mp,previous:oldLike,data:newDislike});
		}	
	},
	// post request
	submitCmt:async(req,res,next)=>{
		const {body} = req;

		// if commnet is not empty

		if(body.comment !== ''){
			const newCmt = new comment(body);
			const mp = await moviePost.findById(body.post);

			if(mp){
				mp.comments.push(newCmt);
				// updating commnet length
				mp.comment_length = mp.comments.length;

				// saving stuffs
				await mp.save();
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
	// shorted comment
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
				if(cmt.reply){
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
			const sorted = await moviePost.findById(_[0]).deepPopulate('comments.user comments.likes comments.replyedTo likes user comments.replys.likes comments.replys.user comments.replys.replyedTo' )
									  .populate({ path:'comments',match:{_id:cid()},options: {limit: 5,sort: { created: -1 },skip:parseInt(skip)}})	

				if(skip !== 0 && sorted.comments.length === 0){
					res.send({warn:'no more comments to load...'})
				}else{

					res.send(sorted);

				}
		}
		
		else if(_[1] === 'most_replyed'){							  
		// reply
		const sorted = await moviePost.findById(_[0]).deepPopulate('comments.user comments.likes comments.replyedTo likes user comments.replys.likes comments.replys.user comments.replys.replyedTo')
									  .populate({ path:'comments',options: {limit: 5,sort: { reply_length: -1 },skip:parseInt(skip)}})

				if(skip !== 0 && sorted.comments.length === 0){
					res.send({warn:'no more comments to load...'})
				}else{

					res.send(sorted);

				}
		}

		else if(_[1] === 'most_liked'){
        // created
        const sorted = await moviePost.findById(_[0]).deepPopulate('comments.user comments.likes comments.replyedTo likes user comments.replys.likes comments.replys.user comments.replys.replyedTo')
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

	addCasting:async(req,res,next)=>{
		const {body} = req;
		const newCast = new cast(body);
		await newCast.save();
		res.send(newCast);
	},


	castLike:async(req,res,next)=>{
		const {body} = req;

		


		const Cast = await cast.findById(body.post);

		if(Cast){

			const Like = await like.findOne(body)

			if(!Like){
				// like
				const newLike = new like(body);

				Cast.likes.push(newLike);
				Cast.likes_length = Cast.likes.length;

				await Cast.save();
				await newLike.save();
				res.send({liked:true,data:newLike});

			}else{
				await cast.update({_id:body.post},{$pull:{likes:Like._id}});	
				const final = await cast.findById(body.post);

				await Like.remove();
				await final.save();

				final.likes_length = final.likes.length;
				res.send({liked:false,data:Like});

			}

			// dislike



		}else{
			res.send({error:'cast is not found'});
		}
	}


}