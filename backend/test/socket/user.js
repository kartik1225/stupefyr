const schedule = require('node-schedule');
const moment = require('moment');
const quiz = require('./quiz');
const postIO = require('./post')


const online = [];
module.exports = {

	start:(io)=>{

		io.on('connection',(socket)=> {


			console.log('connected ✌️');


			// ext modules
			quiz.test(socket,online,io);
			postIO.io(socket,online,io);

			// conmnect
			socket.on('register_user',(_)=>{
				console.log('___________register_user__________')
				data = {
					user:_,
					socket:socket.id
				}
				// adding new user to array
				online.push(data);

			})

			// diconnect
		    socket.on('disconnect',()=>{
		    	// getting rid of disconnected user.
		    	online.map((d,i)=>{
		    		 d.socket === socket.id? online.splice(i, 1):null
		    	})
				console.log('user is gone 😩',online)
			})

		    // CHATTING SOCKETS

		    // on if user is typing
		    socket.on('typing',async(_)=>{
		    	console.log('typing',_)
		    	const user = await online.filter((d)=>{
		    		return d.user === _.user;
		    	});
		    	user.length !== 0?io.sockets.connected[user[0].socket].emit('user_typing',_):null; 
		    })

		    // on new msg created
		    socket.on('msg_created', async (_)=>{
		    	const user = await online.filter((d)=>{
		    		return d.user === _.to;
		    	});
		    	user.length !== 0?io.sockets.connected[user[0].socket].emit('got_msg',_):null; 
		    	console.log('msg',user);
		    })


	    })
	}
}