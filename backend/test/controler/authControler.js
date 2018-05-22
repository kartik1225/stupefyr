const user = require('../models/user')

// auth dependences
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config')

module.exports = {
	// post
	root:async (req,res,next)=> {

		const salt = bcrypt.genSaltSync(10);
		const hash = await bcrypt.hashSync(req.value.password, salt);

			  req.value.password = hash

		const newUser = new user(req.value)

		let Unique = {
			error:null,
			email:null,
			userName:null,
			context:''
		}

// validate unique email and unique username 
	const emailUnique = await user.find({email:req.value.email})
		emailUnique.length === 0 ? Unique.email = true :(Unique.email = false , Unique.context = 'email is allready in use')

	const usernameUnique = await user.find({userName:req.value.userName})
		usernameUnique.length === 0 ? Unique.userName = true :(Unique.userName = false , Unique.context = 'user name is allready in use')

		const token = await jwt.sign(newUser, config.secret ,{
            expiresIn:86400
        });

	Unique.userName && Unique.email? (await newUser.save(),  console.log('created'),res.json({user:newUser.id,token:'JWT ' + token}) ):(res.json({error:Unique.context}))

	},

	//post
	login:async (req,res,next)=> {
		console.log(req.body)
		const User = await user.findOne({email:req.body.email}).select({'email':1,'password':1});
		console.log()
		if(User){
				const password = await bcrypt.compareSync(req.body.password, User.password);

				if(password){
		        const token = await jwt.sign(User, config.secret ,{
		            expiresIn:604800000
		        });

	       		res.send({token:"JWT "+token});
		        }else{
		        	res.send({error:'you have enterd wrong password.'})
		        }
	        }else{
	    	res.send({error:'email is not found , create a new account'})
	    }

	    

	}
}