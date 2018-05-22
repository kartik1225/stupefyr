const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// const commentSchema = new Schema({
// 	userLikes:{
// 		type:String,
// 		default:[]
// 	},
// 	created_time:{
// 		type:Date,
// 		default:Date.now
// 	},
// 	says:{
// 		type:String
// 	},
	
// })



const postSchema = new Schema ({
	postTitle:{
		type:String,
		default:'no title has been posted!'
	},
	postImg:{
		type:String,
		default:'no image uploaded'
	},
	userId:{
		type:String
	},
	likes:{
		type:Array,
		default:[]
	},
	created:{
		type:Date,
		default:Date.now
	},
	showComment:{
		type:Boolean,
		default:false
	},
	comments:[],
	cmt:{
		type:Array

	},
	user:{
		type:String,
		default:''
	}

});




// const comment = mongoose.model('comment',commentSchema);


const post = mongoose.model('post',postSchema);


module.exports = post;
