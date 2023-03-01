var createError = require('http-errors');
var express = require('express');
var path = require('path');
var passport = require('passport');
var usersRouter = require('./routes/users');
var subscriberRouter = require('./routes/subscriberRouter')
var funBot =require('./botconfig'); 
const dotenv = require('dotenv'); 

PORT = process.env.PORT || 5005;

dotenv.config();
const mongodbUrl = process.env.MONGO_URL;

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use(passport.initialize());
app.use('/users', usersRouter);
funBot();
app.use('/subscribers',subscriberRouter)

const mongoose = require('mongoose');
const connect = mongoose.connect(mongodbUrl);

connect.then((db) => {
    console.log("Connected correctly to server");
}, (err) => { console.log(err); });

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
