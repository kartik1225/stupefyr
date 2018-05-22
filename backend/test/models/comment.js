const mongoose = require('mongoose');
const deepPopulate = require('mongoose-deep-populate')(mongoose);
const Schema = mongoose.Schema;

const commentSchema = new Schema({
	user:{
		type:Schema.Types.ObjectId,
		ref:'user'
	},
	post:{
		type:Schema.Types.ObjectId,
		ref:'post'
	},
	liked:{
		type:Boolean,
		default:false
	},
	likes:[{
		type:Schema.Types.ObjectId,
		ref:'like'
	}],
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
		ref:'comment'
	}],
	comment:{
		type:String,
		required:true
	},
	created:{
		type:Date,
		default:Date.now
	},
	reply_length:{
		type:Number,
		default:0
	},
	like_length:{
		type:Number,
		default:0
	},
	type:{
		type:String,
		default:'post'
	},
	cmt_disp:{
		type:Boolean,
		default:false
	},
	more_rep:{
		type:Boolean,
		default:false
	},
	loading:{
		type:Boolean,
		default:false
	},
	parent:{
		type:Schema.Types.ObjectId,
		ref:'comment'
	}

})

commentSchema.plugin(deepPopulate);
const comment = mongoose.model('comment',commentSchema);
module.exports = comment;