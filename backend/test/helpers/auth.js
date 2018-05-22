const user = require('../models/user');
const config = require('../config');
const ExtractJwt = require('passport-jwt').ExtractJwt;
const JwtStrategy = require('passport-jwt').Strategy;


module.exports = function(passport){
	var opts = {}

	opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
	opts.secretOrKey = config.secret;
	passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
	    user.findOne({id: jwt_payload._id}, function(err, user) {
	        if (err) {
	            return done(err, false);
	        }
	        if (user) {
	            done(null, jwt_payload._doc);
	        } else {
	            done(null, false);
	            // or you could create a new account 
	        }
	    });
	}));
}
