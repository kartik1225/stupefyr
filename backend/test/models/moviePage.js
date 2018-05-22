const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const moviePageSchema = new Schema({
	title:{
		type:String,
		required:true
	},
	poster:{
		type:String,
		required:true
	},
	intro:{
		type:String,
		required:true
	},
	castings:[{
		type:Schema.Types.ObjectId,
		ref:'cast'
	}],
	genre:{
		type:Array,
		required:true
	},
	pageCreater:{
		type:Schema.Types.ObjectId,
		ref:'user',
		required:true
	},
	media_type:{
		type:String
	},
	release_date:{
		type:String
	},
	avrRating:{
		type:Number,
		default:0
	},
	ratings:[{
			type:Schema.Types.ObjectId,
			ref:'movieRating'
	}],
	ratings_length:{
		type:Number,
		default:0
	},
	userRating:{
		type:Object,
		default:null
	},
	tmdbId:{
		type:Number,
		default:null
	}
})

moviePageSchema.index({title: 'text'});

const moviePage = mongoose.model('moviePage' ,moviePageSchema)
module.exports = moviePage;