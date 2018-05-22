const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const replySchema = new Schema({
	user:{
		type:Schema.Types.ObjectId,
		ref:'user'
	},
	reply:{
		type:Schema.Types.ObjectId,
		ref:'comment'
	},
	to:{
		type:Schema.Types.ObjectId,
		ref:'user'
	},
	created:{
		type:Date,
		default:Date.now
	}
})

const reply = mongoose.model('like',replySchema);
module.exports = reply;