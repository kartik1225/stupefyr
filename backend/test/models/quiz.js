const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const quizSchema = new Schema({
 	
	creator:{
		type:Schema.Types.ObjectId,
		ref:'user',
		required:true
	},
	created:{
		type:Date,
		default:Date.now
	},
	questions:[{
			type:Schema.Types.ObjectId,
			ref:'question'
	}],
	title:{
		type:String,
		required:true
	},
	startTime:{
		type:String,
		default:null
	},
	startDate:{
		type:String,
		default:null
	},
	duration:{
		type:Number,
		default:1
	},
	timeZone:{
		type:Number,
		default:null
	},
	thumbnail:{
		type:String
	},
	startStamp:{
		type:Date
	},
	resultStatus:{
		type:Boolean
	},
	participants:{
		type:Number,
		default:0
	},
	endStamp:{
		type:Date
	}
})

quizSchema.index({title: 'text'});

const quiz = mongoose.model('quiz',quizSchema);
module.exports = quiz;