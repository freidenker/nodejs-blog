var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
// add mongodb test
var settings = require('./settings');
var flash=require('connect-flash');
var users = require('./routes/users');

//for db session
var session=require('express-session');
var MongoStore=require('connect-mongo')(session);

var fs=require('fs');
var accessLog = fs.createWriteStream('access.log',{flags: 'a'});
var errorLog = fs.createWriteStream('error.log',{flags: 'a'});
var app = express();
var passport = require('passport'), GitHubStrategy = require('passport-github').Strategy;
var multer = require('multer');
// view engine setup
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//app.use(flash());

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(logger({stream: accessLog}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({
  dest: './public/images',
  rename: function(fieldname, filename){
    return filename;
  }
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(err, req, res, next){
  var meta = '[' + new Date() + ']' + req.url + '\n';
  errorLog.write(meta + err.stack + '\n');
  next();
});

app.use('/users', users);

app.use(session({
  secret: settings.cookieSecret,
  key: settings.db,
  cookie: {maxAge: 1000*60*60*24*30},
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    db: settings.db,
    host: settings.host,
    port: settings.port
  })
}));

app.use(flash());

app.use(passport.initialize());
app.use('/', routes);
/*
app.use(function(req, res){
  res.render("404");
});
*/
// catch 404 and forward to error handler

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
//  res.status(404).render('404');
});

// error handlers

// development error handler
// will print stacktrace
passport.use(new GitHubStrategy({
  clientID: "3a870b3d628df8b2d2e2",
  clientSecret: "21fb694e25768656a315d84895e3454b624b720b",
  callbackURL: "http://127.0.0.1:3000/login/github/callback"
}, function(accessToken, refreshToken, profile, done){
  done(null, profile);
}));

if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
