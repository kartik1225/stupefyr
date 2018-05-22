const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const followingSchema = new Schema({
	userId:{
		type:String,
		require:true
	},
	following:{
		type:String,
		require:true
	},
	trigger:{
		type:Boolean,
		default:true
	},
	started:{
		type:Date,
		default:Date.now
	},
	user:{
		type:Schema.Types.ObjectId,
		ref:'user'
	}
})

const following = mongoose.model('following',followingSchema);

module.exports = following;