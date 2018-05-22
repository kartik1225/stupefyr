const mongoose = require('mongoose');
const deepPopulate = require('mongoose-deep-populate')(mongoose);
const Schema = mongoose.Schema;

const movieRatingSchema = new Schema({
	user:{
		type:Schema.Types.ObjectId,
		ref:'user'
	},
	rating:{
		type:Object,
		require:true
	},
	avrage:{
		type:Number,
		require:true
	},
	movieId:{
		type:Schema.Types.ObjectId,
		ref:'moviePage'
	}
})

movieRatingSchema.plugin(deepPopulate);
const movieRating = mongoose.model('movieRating',movieRatingSchema);
module.exports = movieRating;