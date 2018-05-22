const mongoose = require('mongoose')
const Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');
const deepPopulate = require('mongoose-deep-populate')(mongoose);
const validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

const userSchema = new Schema({
	// name:{
	// 	type:String,
	// 	required:true
	// },
	// lastName:{
	// 	type:String,
	// 	required:true
	// },
	email:{
		type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: 'Email address is required',
        validate: [validateEmail, 'Please fill a valid email address'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
	},	
	password:{
		type:String,
		required:true
	},
	userName:{
		type:String,
		unique: true,
		required:true
	},
	displayName:{
		type:String
	},
	gender:{
		type:String,
		required:true
	},
	birthday:{
		type:String
	},
	image:{
		type:String,
		default:'default/profile.jpg'
	},
	cover:{
		type:String,
		default:'default/cover.png'
	},   
	posts:[{
		type:Schema.Types.ObjectId,
		ref:'post'	
	}],
	created:{
		type:Date,
		default:Date.now
	},
	followers:[{
		type:Schema.Types.ObjectId,
		ref:'follower'
	}],
	followings:[{
		type:Schema.Types.ObjectId,
		ref:'follower'
	}]
})

userSchema.index({'$**': 'text'});
userSchema.plugin(deepPopulate,{
	populate:{
		'followers.user':{select:{image:1,name:1}}
	}
});

userSchema.plugin(uniqueValidator);

const user = mongoose.model('user' ,userSchema)
module.exports = user;