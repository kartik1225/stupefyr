const mongoose = require('mongoose')
const Schema = mongoose.Schema;


const followingSchema = new Schema({
	// user it self
	user:{
		type:Schema.Types.ObjectId,
		ref:'user'
	},

	following:{
		type:Schema.Types.ObjectId,
		ref:'user'
	},
	created:{
		type:Date,
		default:Date.now
	}
})

const following = mongoose.model('following' ,followingSchema)
module.exports = following;