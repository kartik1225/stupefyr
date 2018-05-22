const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const deepPopulate = require('mongoose-deep-populate')(mongoose);

const moviePostSchema = new Schema({
	type:{
		type:String,
		required:true
	},
	content:{
		type:String,
		required:true
	},
	user:{
		type:Schema.Types.ObjectId,
		ref:'user',
		required:true
	},
	movieId:{
		type:Schema.Types.ObjectId,
		ref:'moviePage',
		required:true
	},
	created:{
		type:Date,
		default:Date.now
	},
	comments:[{
		type:Schema.Types.ObjectId,
		ref:'comment',
		required:true	
	}],
	likes:[{
		type:Schema.Types.ObjectId,
		ref:'like'
	}],
	dislikes:[{
		type:Schema.Types.ObjectId,
		ref:'dislike'
	}],
	liked:{
		type:Boolean,
		default:false
	},
	disliked:{
		type:Boolean,
		default:false
	},
	likes_length:{
		type:Number,
		default:0
	},
	comment_length:{
		type:Number,
		default:0
	}	

})

moviePostSchema.plugin(deepPopulate,{
	populate:{
		'comments.replys':{
			options:{
				limit:3
			}
		}
	}
});


const moviePost = mongoose.model('moviePost' ,moviePostSchema)
module.exports = moviePost;