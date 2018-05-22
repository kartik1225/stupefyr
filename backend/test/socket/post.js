const user = require(`../models/user`);
const notify = require(`../models/notify`);
module.exports = {

	io:async(socket , online , io)=>{

		socket.on(`n_new_post`,async _=>{

			// getting currunt sessions user's id;
			let cUser = online.filter(d=>d.socket === socket.id);
			let uid = cUser[0].user; 

			const User = await user.findById(uid).populate('followers');

			const followers = User.followers;



			const cFollowers = [];

		 	await followers.map(async f=>{
		 		// creating notifications to user's all followers;
		 		const data = {
		 			user:f.user,
		 			pp:User.image,
		 			type:'new_post',
		 			data:_._id,
		 			context:`${User.userName} has created a new post`,
		 			link:`/singlepost/listpost?pid=${_._id}`,
		 			owner:uid
		 		}

		 		const newNotify = new notify(data);
		 		await newNotify.save();

				 online.map(async d=>{

					if(d.user.toString() === f.user.toString()){

						cFollowers.push(d.socket);

						// emiting to user's followers
						io.to(d.socket).emit('notify',{followers,online,newNotify});

					}
				})


			})

		})
		console.log('this is tes..');

	}
}