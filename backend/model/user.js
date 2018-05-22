const mongoose = require('mongoose');
const Schema = mongoose.Schema;


var validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

const userSchema = new Schema ({
//user database
	Name:{
		type:String,
		required:'Name is required'
	},
	lastName:{
		type:String,
		required:'Last Name is required'
	},
	Gender:{
		type:String,
		required:'Specify your Gender'
	},
	Email:{
		type: String,
		        trim: true,
		        lowercase: true,
		        unique: true,
		        required: 'Email address is required',
		        validate: [validateEmail, 'Please fill a valid email address'],
		        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
	},
	Password:{
		type:String,
		required:'Password feald is required'
	},
	userName:{
		type:String,
		required:'user name is required'
	},
	intro:{
		type:String
	},
	phone:{
		type:Number
	},
	profileImg:{
		type:String
	},

	joinDate:{
		type:Date,
		default:Date.now
	},
	followings:{
		type:String
	}



});



const user = 	mongoose.model('user',userSchema);

module.exports = user;