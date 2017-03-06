
var express = require('express');
var router = express.Router();

var crypto=require('crypto');
User = require('../models/user.js');
/*
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
}); */

router.get('/hh', function(req, res) {
  res.send("hallo");
});

router.get('/',function(req,res){
  res.render('index',{
    title: '主页',
    user: req.session.user,
    success: req.flash('success').toString(),
    error: req.flash('error').toString()
  });
});
router.get('/reg',function(req,res){
  res.render('reg',{
    title: '注册',
    user: req.session.user,
    success: req.flash('success').toString(),
    error: req.flash('error').toString()
  });
});
router.post('/reg',function(req,res){
  var name=req.body.name,
      password=req.body.password,
      password_re=req.body['password-repeat'];
  if(password_re != password){
    req.flash('error', 'password not same in two times');
    return res.redirect('/reg');
  }
  var md5=crypto.createHash('md5');
    password=md5.update(req.body.password).digest('hex');
  var newUser=new User({
    name: req.body.name,
    password: password,
    email: req.body.email
  });

  User.get(newUser.name,function(err, user){
    if(err){
      req.flash('error',err);
      returnres.redirect('/');
    }
  if(user){
    req.flash('error','already exist!');
    return res.redirect('/reg');
  }

  newUser.save(function(err, user){
    if(err){
      req.flash('error',err);
      return res.redirect('/reg');
    }
    req.session.user=user;
    req.flash('success','regiester successfully!');
    res.redirect('/');
  });
});
});
router.get('/login',function(req,res){
  res.render('login',{title: '登陆'});
});
router.post('/login',function(req,res){
//    res.render('index',{title: '主页'});
});
router.get('/post',function(req,res){
  res.render('post',{title: '发表'});
});
router.post('/post',function(req,res){
//    res.render('index',{title: '主页'});
});
router.get('/logout',function(req,res){
//    res.render('index',{title: '主页'});
});

 module.exports = router;

/*
module.exports=function(app){

}; */
