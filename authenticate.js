var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/user');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

const dotenv = require('dotenv'); 
dotenv.config();

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
exports.getToken = function(user) {
  return jwt.sign(user, process.env.secretKey,
      {expiresIn: 360000});
};

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.secretKey;

exports.jwtPassport = passport.use(new JwtStrategy(opts,
  (jwt_payload, done) => {
      console.log("JWT payload: ", jwt_payload);
      User.findOne({_id: jwt_payload._id}, (err, user) => {
          if (err) {
              return done(err, false);
          }
          else if (user) {
              return done(null, user);
          }
          else {
              return done(null, false);
          }
      });
  }));

exports.verifyUser = passport.authenticate('jwt', {session: false});
exports.verifyAdmin = function(req, res, next) {
    if(!req.user.admin){
        var err = new Error('You are not authorized to perform this operation!');
        err.status = 403;
        next(err);
    }
    else{
        return next();
    }
};
