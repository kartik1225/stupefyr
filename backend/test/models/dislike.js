const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dislikeSchema = new Schema({
	
	user:{
		type:Schema.Types.ObjectId,
		ref:'user'
	},
	post:{
		type:Schema.Types.ObjectId,
		ref:'post'
	},
	created:{
		type:Date,
		default:Date.now
	},
	type:{
		type:String,
		default:'post'
	}
})

const dislike = mongoose.model('dislike',dislikeSchema);
module.exports = dislike;