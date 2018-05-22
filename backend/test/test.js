// dependences
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const schedule = require('node-schedule');
const moment = require('moment');
const EventBus = require('eventbusjs');
mongoose.connect('mongodb://127.0.0.1/test');
const app = express();
const cors = require('cors');
const passport = require('passport');
require('./helpers/auth')(passport);
// socket io stuff
var server = app.listen(3000)
var io = require('socket.io').listen(server);
const sf = require('./socket/user');

// required routers
const user = require('./routers/user')
const picture = require('./routers/pictures')
const auth = require('./routers/auth')
const findOne = require('./routers/findOne')
const relationship = require('./routers/relationship')
const query = require('./routers/query')
const chat = require('./routers/chat')
const quiz = require('./routers/quiz')
const debate = require('./routers/debate')
const movie = require('./routers/movie')
const notify = require('./routers/notify')
const profile = require('./routers/profile')


// middlewers
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/temp'));
app.use(express.static('static'));

// passport stuff
app.use(passport.initialize());
const crypt = passport.authenticate('jwt',{session:false})

// socket connections
sf.start(io);

const date = moment().add(5000 , 'millisecond').toISOString()


// for schaduling crons for quiz...
const Quiz = require('./models/quiz');
Quiz.find().then(d=>{

	d.map(q=>{

		// quizzz that are not expired yet..
		const notExpired = moment(q.startStamp).add(q.duration,`days`).utcOffset(q.timeZone).diff(moment().utcOffset(q.timeZone)) 

		if(notExpired > 0){
			const startD = moment(q.startStamp).utcOffset(q.timeZone).toISOString();
			const endD = moment(q.startStamp).utcOffset(q.timeZone).add(q.duration,`days`).toISOString();


			// for testing
			setTimeout(()=>{
					EventBus.dispatch("pub_quiz",null,q);
			},5000)

			// // starting cron
			// schedule.scheduleJob(startD, function(){
			// 	setTimeout(()=>{
			// 		EventBus.dispatch("pub_quiz",null,q);
			// 	},5000)
			// });

		}		
	})



}).catch(e=>{
	console.log(e);
});



io.on('connection',(socket)=> {
	console.log('ok');
})

// routers
app.use('/user',crypt,user)
app.use('/picture',picture)
app.use('/auth',auth)
app.use('/one',crypt,findOne)
app.use('/rel',relationship)
app.use('/search',crypt,query)
app.use('/chat',crypt,chat)
app.use('/quiz',crypt,quiz)
app.use('/debate',crypt,debate)
app.use('/movie',crypt,movie)
app.use('/notify',crypt,notify)
app.use('/profile',crypt,profile)

// 404 page error handeling

app.use((req,res,next)=>{
	const err = new Error('Not Found');
	err.status = 404;
	next(err);
})

// error handeling from api

app.use((err,req,res,next)=>{
	const error = app.get('env') === 'development' ? err : {};
	const status = err.status || 500;

	// respond to client

	res.status(status).json({
		error:{
			message:error.message
			}
		})
	// colcole log to node server

		console.log(err);
	})



// port and server bootup
console.log('node is running on port 3000');