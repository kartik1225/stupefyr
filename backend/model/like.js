 const mongoose = require('mongoose');
 const Schema = mongoose.Schema;

 const likeSchema = new Schema({
 	postId:{
 		type:String
 	},
 	userId:{
 		type:String
 	},
 	like:{
 		type:Boolean,
 		default:false
 	},
 	created:{
 		type:Date,
 		default:Date.now
 	}
 })

const like = mongoose.model('like',likeSchema);

module.exports = like;
