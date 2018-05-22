const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const quizSubmitSchema = new Schema({
 	
	user:{
		type:Schema.Types.ObjectId,
		ref:'user',
		required:true
	},
	quizId:{
		type:Schema.Types.ObjectId,
		ref:'quiz',
		required:true
	},
	created:{
		type:Date,
		default:Date.now
	},

	// ans format 
	// {
	// 	type:String,
	// 	index:Number,
	// 	answer:String
	// }

	answers:{
		type:Array,
		required:true
	},
	timeSpan:{
		type:Number,
		required:true
	}

})

const quizSubmit = mongoose.model('quizSubmit',quizSubmitSchema);
module.exports = quizSubmit;