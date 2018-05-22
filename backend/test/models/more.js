const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const moreSchema = new Schema({
	native:{
		type:Schema.Types.ObjectId,
		ref:'user'
	}
})

const more = mongoose.model('more' ,moreSchema)
module.exports = more;