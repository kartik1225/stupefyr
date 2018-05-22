const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const deepPopulate = require('mongoose-deep-populate')(mongoose);

const debateCommentSchema = new Schema({
	user:{
		type:Schema.Types.ObjectId,
		ref:'user',
		required:true
	},
	post:{
		type:Schema.Types.ObjectId,
		ref:()=>{
			this.reply?'debateComment':'post';
		},
		required:true
	},
	comment:{
		type:String,
		required:true
	},
	reply:{
		type:Boolean,
		default:false
	},
	replyedTo:{
		type:Schema.Types.ObjectId,
		ref:'user'
	},
	replys:[{
		type:Schema.Types.ObjectId,
		ref:'debateComment'
	}],
	likes:[{
		type:Schema.Types.ObjectId,
		ref:'like'
	}],
	dislikes:[{
		type:Schema.Types.ObjectId,
		ref:'dislike'
	}],
	created:{
		type:Date,
		default:Date.now
	},
	liked:{
		type:Boolean,
		default:false
	},
	disliked:{
		type:Boolean,
		default:false
	},
	reply_disp:{
		type:Boolean,
		default:false
	},
	replys_length:{
		type:Number,
		default:0
	},
	likes_length:{
		type:Number,
		default:0
	}
})

debateCommentSchema.plugin(deepPopulate)




const debateComment = mongoose.model('debateComment' ,debateCommentSchema)
module.exports = debateComment;