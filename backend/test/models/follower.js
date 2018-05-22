const mongoose = require('mongoose')
const Schema = mongoose.Schema;


const followerSchema = new Schema({

	// here the user is your follower
	user:{
		type:Schema.Types.ObjectId,
		ref:'user'
	},
	// following is you
	follow:{
		type:Schema.Types.ObjectId,
		ref:'user'
	},
	created:{
		type:Date,
		default:Date.now
	}
})

const follower = mongoose.model('follower' ,followerSchema)
module.exports = follower;