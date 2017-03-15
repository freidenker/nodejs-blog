/*
var mongodb=require('./db');
var crypto=require('crypto');

function User(user){
  this.name=user.name;
  this.password=user.password;
  this.email=user.email;
};

module.exports=User;

User.prototype.save=function(callback){
  var md5=crypto.createHash('md5'),
      email_MD5=md5.update(this.email.toLowerCase()).digest('hex'),
      head="http://gravatar.com/avatar/"+email_MD5+"?s=48";
  var user={
    name: this.name,
    password: this.password,
    email: this.email,
    head: head
  };

  mongodb.open(function (err, db){
    if(err){
      return callback(err);
    }
    db.collection('users',function (err, collection){
      if(err){
        mongodb.close();
        return callback(err);
      }
      collection.insert(user,{
        safe: true
      }, function(err, user){
        mongodb.close();
        if(err){
          return callback(err);
        }
        callback(null,user[0]);
      });

    });
  });
};

User.get=function(name, callback){
  mongodb.open(function (err, db){
    if(err){
      return callback(err);
    }
    db.collection('users', function (err,collection){
      if(err){
        mongodb.close();
        return callback(err);
      }
      collection.findOne({name: name},function (err, user){
        mongodb.close();
        if(err){
          return callback(err);

        }
        callback(null, user);
      });
    });
  });
};
*/
var crypto=require('crypto');
var mongoose = require('mongoose');
mongoose.connect('mongodb://10.47.139.168/blog');

var userSchema = new mongoose.Schema({
  name: String,
  password: String,
  email: String,
  head: String
},{
  collection: 'users'
});

var userModel = mongoose.model('User', userSchema);

function User(user){
  this.name=user.name;
  this.password=user.password;
  this.email=user.email;
};

User.prototype.save = function(callback){
  var md5 = crypto.createHash('md5'),
      email_MD5 = md5.update(this.email.toLowerCase()).digest('hex'),
      head = "http://www.gravatar.com/avatar"+ email_MD5+"?s=48";
  var user={
    name: this.name,
    password: this.password,
    email: this.email,
    head: head
  };

  var newUser=new userModel(user);
  newUser.save(function(err, user){
    if(err){
      return callback(err);
    }
    callback(null, user);
  });
};

User.get = function (name, callback){
  userModel.findOne({name: name}, function (err, user){
    if(err){
      return callback(err);
    }
    callback(null,user);
  });
};

module.exports = User;
