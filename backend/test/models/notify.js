const mongoose = require('mongoose')
const Schema = mongoose.Schema;


const notifySchema = new Schema({
	user:{
		type:Schema.Types.ObjectId,
		ref:'user'
	},
	context:{
		type:String
	},
	type:{
		type:String
	},
	data:{
		type:Schema.Types.ObjectId,
		ref:'user'
	},
	pp:{
		type:String
	},
	link:{
		type:String
	},
	seen:{
		type:Boolean,
		default:false
	},
	created:{
		type:Date,
		default:Date.now
	},
	owner:{
		type:String
	}
})

const notify = mongoose.model('notify' ,notifySchema)
module.exports = notify;