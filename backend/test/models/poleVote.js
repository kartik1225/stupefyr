const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const poleVoteSchema = new Schema({
	userId: {
		type:Schema.Types.ObjectId,
		ref:'user'
	},
	postId:{
		type:Schema.Types.ObjectId,
		ref:'post'
	},
	vote:{
		type:Number,
		require:true
	},
	created:{
		type:Date,
		default:Date.now
	}
})

const poleVote = mongoose.model('poleVote',poleVoteSchema);

module.exports = poleVote;