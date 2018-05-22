const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const castSchema = new Schema({
 	
	character:{
		type:String
	},
	name:{
		type:String
	},
	tmdb:{
		credit_id:String,
		id:String
	},
	gender:{
		type:Number
	},
	profileImage:{
		type:String
	},
	order:{
		type:Number
	},
	likes:[{
		type:Schema.Types.ObjectId,
		ref:'like'
	}],
	likes_length:{
		type:Number,
		default:0
	},
	liked:{
		type:Boolean,
		default:false
	}

})

const cast = mongoose.model('cast',castSchema);
module.exports = cast;