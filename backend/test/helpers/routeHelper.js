const joy = require('joi');

module.exports = {
	validateParams: ( schema , name )=>{
		return(req,res,next)=>{
			const result = joy.validate({'param': req['params'][name]},schema)
			if (result.error){
				return res.status(400).json(result.error)
			}else{

			if(!req.value)
				req.value = {}

			if(!req.value['params'])
				req.value['params'] = {}
			req.value['params'][name] = result.value.param;

			console.log(req['value'].params[name])
				next()
			}
		}
	},
	validateBody:(schema)=>{
		return (req,res,next)=>{
			const validate = joy.validate(req.body,schema)
			// console.log(validate)
			validate.error !== null ? res.json({status:'err',error:validate.error.details[0].message}):(req.value = req.body,next())
		}
	},
	schemas:{
		idSchema:joy.object().keys({
			param:joy.string().regex(/^[0-9a-fA-F]{24}$/).required() 
		}),
		signup:joy.object().keys({
			// name:joy.string().required(),
			// lastName:joy.string().required(),
			email:joy.string().email().required(),
			password:joy.string().required(),
			userName:joy.string().required(),
			gender:joy.string().required(),
			displayName:joy.any(),
			birthday:joy.any()
		}),
		login:joy.object().keys({
			email:joy.string().email().required(),
			password:joy.string().required()
		}),
		movie:joy.object().keys({
			title:joy.string().required(),
			poster:joy.string().required(),
			intro:joy.string().required(),
			castings:joy.array().required(),
			genre:joy.array().required(),
			release_date:joy.any(),
			media_type:joy.any(),
			tmdbId:joy.any(),
			pageCreater:joy.string().regex(/^[0-9a-fA-F]{24}$/).required()
		})
	}
}