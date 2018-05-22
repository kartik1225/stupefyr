const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const notifySchema = new Schema({
	type:{
		type:String
	},
	user:{
		type:String
	},
	notify:{
		type:String
	},
	to:{
		type:String
	},
	postId:{
		type:String
	},
	seen:{
		type:Boolean,
		default:false
	},
	owner:{
		type:String
	}
})


const notify = mongoose.model('notify',notifySchema);

module.exports = notify