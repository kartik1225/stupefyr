const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const questionSchema = new Schema({
	type:{
		type:String,
		requiref:true
	},
	imageId:{
		type:String
	},
	id:{
		type:Number
	},

	// multioptions type
	options:{
		type:Array
	},
	answer:{
		type:String
	},
	question:{
		type:String
	},

	// feel in the blank type

	answers:{
		type:Array
	},
	blank:{
		type:Array
	},
	caption:{
		type:String
	},
	quizId:{
		type:Schema.Types.ObjectId,
		ref:'quiz'
	}
		
})

const question = mongoose.model('question',questionSchema);
module.exports = question;