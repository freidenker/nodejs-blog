
var express = require('express');
var router = express.Router();

var crypto=require('crypto');
User = require('../models/user.js');
Post = require('../models/post.js');
Comment = require('../models/comment.js');
/*
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
}); */

function checkLogin(req, res, next){
  if(!req.session.user){
    req.flash('error','未登录!');
    res.redirect('/login');
  }
  next();
}

function checkNotLogin(req,res,next){
  if(req.session.user){
    req.flash('error','已登陆！');
    res.redirect('back');
  }
  next();
}

router.get('/hh', function(req, res) {
  res.send("hallo");
});

/*
router.get('/',function(req,res){
//  res.render('index',{
//    title: '主页',
//    user: req.session.user,
//    success: req.flash('success').toString(),
//    error: req.flash('error').toString()
//  });
  Post.getAll(null,function(err, posts){
    if(err){
      posts=[];
    }
    res.render('index',{
      title: '主页',
      user: req.session.user,
      posts: posts,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });
});
*/
router.get('/',function(req,res){
  var page=req.query.p ? parseInt(req.query.p):1;
  Post.getTen(null,page,function(err, posts,total){
    if(err){
      posts=[];
    }
    res.render('index',{
      title: '主页',
      posts: posts,
      page: page,
      isFirstPage: (page-1)==0,
      isLastPage: ((page-1)*3+posts.length) == total,
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });
});


router.get('/reg', checkNotLogin);
router.get('/reg',function(req,res){
  res.render('reg',{
    title: '注册',
    user: req.session.user,
    success: req.flash('success').toString(),
    error: req.flash('error').toString()
  });
});

router.post('/reg', checkNotLogin);
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

router.get('/login', checkNotLogin);
router.get('/login',function(req,res){
//  res.render('login',{title: '登陆'});
res.render('login',{
  title: '登陆',
  user: req.session.user,
  success: req.flash('success').toString(),
  error: req.flash('error').toString()
 });
});

router.post('/login', checkNotLogin);
router.post('/login',function(req,res){
//    res.render('index',{title: '主页'});
  var md5=crypto.createHash('md5'),
      password=md5.update(req.body.password).digest('hex');
  User.get(req.body.name, function(err, user){
    if(!user){
      req.flash('error','user does not exist!');
      return res.redirect('/login');
    }
    if(user.password != password ){
      req.flash('error','uncorrect password!');
      return res.redirect('/login');
    }
    req.session.user=user;
    req.flash('success', 'login successfully!');
    res.redirect('/');
  });

});

router.get('/logout', checkLogin);
router.get('/logout', function (req, res){
  req.session.user=null;
  req.flash('success','logout successfully!');
  res.redirect('/');
});

router.get('/upload', checkLogin);
router.get('/upload',function (req, res){
  res.render('upload',{
    title: '文件上传',
    user: req.session.user,
    success: req.flash('success').toString(),
    error: req.flash('error').toString()
  });
});
router.post('/upload', checkLogin);
router.post('/upload',function(req,res){
  req.flash('success','文件上传成功！');
  res.redirect('/upload');
});

/*
router.get('/u/:name',function(req,res){
  User.get(req.params.name,function(err,user){
    if(!user){
      req.flash('error','user not exist!');
      return res.redirect('/');
    }
    Post.getAll(user.name,function(err, posts){
      if(err){
        req.flash('error',err);
        return res.redirect('/');
      }
      res.render('user',{
        title: user.name,
        posts: posts,
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
      });
    });
  });
});  */

router.get('/archive', function(req, res){
  Post.getArchive(function(err, posts){
    if(err){
      req.flash('error',err);
      return res.redirect('/');
    }
    res.render('archive',{
      title: '存档',
      posts: posts,
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });
});

router.get('/tags',function(req, res){
  Post.getTags(function(err, posts){
    if(err){
      req.flash('error',err);
      return res.redirect('/');
    }
    res.render('tags',{
      title: '标签',
      posts: posts,
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });
});

router.get('/tags/:tag', function(req, res){
  Post.getTag(req.params.tag,function(err,posts){
    if(err){
      req.flash('error',err);
      return res.redirect('/');
    }
    res.render('tag',{
      title: 'TAG:'+req.params.tag,
      posts: posts,
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });
});

router.get('/links',function(req,res){
  res.render('links',{
    title: '友情链接',
    user: req.session.user,
    success: req.flash('success').toString(),
    error: req.flash('error').toString()
  });
});

router.get('/search',function(req, res){
  Post.search(req.query.keyword, function(err, posts){
    if(err){
      req.flash('error',err);
      return res.redirect('/');
    }
    res.render('search',{
      title: "SEARCH:" + req.query.keyword,
      posts: posts,
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });
});

router.get('/u/:name',function(req,res){
  var page=req.query.p ? parseInt(req.query.p):1;
  User.get(req.params.name,function(err,user){
    if(!user){
      req.flash('error','user not exist!');
      return res.redirect('/');
    }
    Post.getTen(user.name,page,function(err, posts,total){
      if(err){
        req.flash('error',err);
        return res.redirect('/');
      }
      res.render('user',{
        title: user.name,
        posts: posts,
        page: page,
        isFirstPage: (page-1)==0,
        isLastPage: ((page-1)*3+posts.length) == total,
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
      });
    });
  });
});

router.get('/u/:name/:day/:title',function (req,res){
  Post.getOne(req.params.name, req.params.day, req.params.title, function (err,post){
    if(err){
      req.flash('error',err);
      return res.redirect('/');
    }
    res.render('article',{
      title: req.params.title,
      post: post,
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });
});

router.post('/u/:name/:day/:title', function(req,res){
  var date=new Date(),
      time=date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+" "+date.getHours()+":"+(date.getMinutes()<10?'0'+date.getMinutes():date.getMinutes());
      var md5=crypto.createHash('md5'),
          email_MD5=md5.update(req.body.email.toLowerCase()).digest('hex'),
          head="http://gravatar.com/avatar/"+email_MD5+"?s=48";
      var comment = {
        name: req.body.name,
        head: head,
        email: req.body.email,
        website: req.body.website,
        time: time,
        content: req.body.content
      };
      var newComment=new Comment(req.params.name, req.params.day, req.params.title, comment);
      newComment.save(function(err){
        if(err){
          req.flash('error',err);
          return res.redirect('back');
        }
        req.flash('success','留言成功!');
        res.redirect('back');
      });
});

router.get('/edit/:name/:day/:title',checkLogin);
router.get('/edit/:name/:day/:title',function(req, res){
  var currentUser=req.session.user;
  Post.edit(currentUser.name, req.params.day, req.params.title,function (err,post){
    if(err){
      req.flash('error',err);
      return res.redirect('back');
    }
    res.render('edit',{
      title: 'edit',
      post: post,
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });
});

router.post('/edit/:name/:day/:title',checkLogin);
router.post('/edit/:name/:day/:title',function(req,res){
  var currentUser=req.session.user;
  Post.update(currentUser.name, req.params.day, req.params.title, req.body.post,function(err){
    var url=encodeURI('/u/'+req.params.name+'/'+req.params.day+'/'+req.params.title);
    if(err){
      req.flash('error',err);
      return res.redirect(url);
    }
    req.flash('success','修改成功!');
    res.redirect(url);
  });
});

router.get('/remove/:name/:day/:title',checkLogin);
router.get('/remove/:name/:day/:title', function(req, res){
  var currentUser = req.session.user;
  Post.remove(currentUser.name, req.params.day, req.params.title,function(err){
    if(err){
      req.flash('error',err);
      return res.redirect('back');
    }
    req.flash('success','删除成功!');
    res.redirect('/');
  });
});

router.get('/post', checkLogin);
router.get('/post',function(req,res){
//  res.render('post',{title: '发表'});
res.render('post',{
  title: '发表',
  user: req.session.user,
  success: req.flash('success').toString(),
  error: req.flash('error').toString()
 });
});
router.post('/post', checkLogin);
router.post('/post',function(req,res){
//    res.render('index',{title: '主页'});
var currentUser=req.session.user,
    tags=[req.body.tag1,req.body.tag2,req.body.tag3],
    post=new Post(currentUser.name,currentUser.head,req.body.title,tags,req.body.post);
post.save(function(err){
      if(err){
        req.flash('error',err);
        return res.redirect('/');
      }
      req.flash('success','发布成功！');
      res.redirect('/');
});
});
router.get('/logout',function(req,res){
//    res.render('index',{title: '主页'});
});

 module.exports = router;

/*
module.exports=function(app){

}; */
