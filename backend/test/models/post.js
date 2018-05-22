const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const deepPopulate = require('mongoose-deep-populate')(mongoose);
const postSchema = new Schema({
	user:{
		type:Schema.Types.ObjectId,
		ref:'user',
		required:true
	},
	created:{
		type:Date,
		default:Date.now
	},
	image:{
		type:String
	},
	caption:{
		type:String
	},
	showComment:{
		type:Boolean,
		default:false
	},
	onlycaption:{
		type:Boolean,
		default:false
	},
	font:{
		type:String
	},
	comments:[{
		type:Schema.Types.ObjectId,
		ref:'comment'
	}],
	extra:{
		type:String,
		default:''
	},
	likes:[{
		type:Schema.Types.ObjectId,
		ref:'like'
	}],
	liked:{
		type:Boolean,
		default:false
	},
	pole:{
		type:Object,
		default:null
	},
	poleVotes:[{
		type:Schema.Types.ObjectId,
		ref:'poleVote'
	}],
	poleComments:[{
		type:Schema.Types.ObjectId,
		ref:'debateComment'
	}],
	movieId:{
		type:Schema.Types.ObjectId,
		ref:'moviePost'
	},
	movie:{
		type:Schema.Types.ObjectId,
		ref:'moviePage'
	}
	//likes
	//comments
})
postSchema.plugin(deepPopulate,{
  populate: {
    'comments.user': {
      select: 'name userName'
    },
    'comments.likes':{
    	select:'user'
    },
    'poleComments.replys':{
    	options:{
    		limit:3
    	}
    }

}
  });
const post = mongoose.model('post',postSchema);
module.exports = post;