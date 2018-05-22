const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const commentSchema = new Schema({
	userLikes:{
		type:String,
		default:[]
	},
	created_time:{
		type:Date,
		default:Date.now
	},
	says:{
		type:String
	},
	_creator:{
		type:String
	},
	userId:{
		type:String
	},
	Name:{
		type:String
	},
	lastName:{
		type:String
	},
	userName:{
		type:String
	}

})


const comment = mongoose.model('comment',commentSchema);

module.exports = comment;