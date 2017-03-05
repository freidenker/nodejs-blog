
var express = require('express');
var router = express.Router();

/*
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
}); */

router.get('/hh', function(req, res) {
  res.send("hallo");
});

router.get('/',function(req,res){
  res.render('index',{title: '主页'});
});
router.get('/reg',function(req,res){
  res.render('reg',{title: '注册'});
});
router.post('/reg',function(req,res){
//    res.render('index',{title: '主页'});
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
