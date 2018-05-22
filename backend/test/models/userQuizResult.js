const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userQuizResultSchema = new Schema({
 	
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
	result:{
		type:Array,
		required:true
	},
	timeSpan:{
		type:Number,
		required:true
	},
	userAns:{
		type:Schema.Types.ObjectId,
		ref:'quizSubmit',
		required:true
	},
	resultLength:{
		type:Number,
		default:true
	},
	rank:{
		type:Number,
		default:0
	}
})

const userQuizResult = mongoose.model('userQuizResult',userQuizResultSchema);
module.exports = userQuizResult;