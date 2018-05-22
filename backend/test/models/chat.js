const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatSchema = new Schema({
	
	user:{
		type:Schema.Types.ObjectId,
		ref:'user'
	},
	to:{
		type:Schema.Types.ObjectId,
		ref:'post'
	},
	msg:{
		type:String
	},
	status:{
		type:Boolean,
		default:false
	},
	created:{
		type:Date,
		default:Date.now
	}
})

const chat = mongoose.model('chat',chatSchema);
module.exports = chat;