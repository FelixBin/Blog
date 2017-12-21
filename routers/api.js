/**
 * Created by 与你在巅峰相会 on 2017/6/19.
 */
var express=require('express');
var router=express.Router();
var User=require('../models/User');
var Content=require('../models/Content');
//统一返回格式
var  responseData;
router.use(function (req,res,next) {
    responseData={
        code:0,
        message:''
    };
    next();
});
/*
* 用户注册
*    注册逻辑
*       1.用户名不为空
*       2，密码不为空
*       3.两次密码必须一致
*    1.用户名是否已经被注册
*        数据库查询
* */
//注册
router.post('/user/register',function (req,res,next) {
var username=req.body.username;
var password=req.body.password;
var repassword=req.body.repassword;
//判断用户名是否为空
    if(username==''){
responseData.code=1;
responseData.message='用户名不能为空';
        res.json(responseData);//以json格式返回给前端
        return ; //终止代码
    }
    //密码不能为空
    if(password==''){
        responseData.code=2;
        responseData.message='密码不能为空';
        res.json(responseData);//以json格式返回给前端
        return ; //终止代码
    }
    //两次输入密码必须一致
    if(password!=repassword){
responseData.code=3;
responseData.message='两次密码输入不一致';
res.json(responseData);
return;
    }
    //用户名是否已经被注册，如果数据库已经存在与我们要注册的用注册户名同名的数据表示该用户名------需要操作models下的User
User.findOne({
    username:username,
    password:password
}).then(function (userInfo) {
  //  console.log(userInfo);
    if(userInfo){
        responseData.code=4;
        responseData.message='用户已被注册';
        res.json(responseData);
        return;
    }
  //保存用户注册信息到数据库中
    //通过操作对象操作数据库
    var user=new User({
        username:username,
        password:password
    });
    return user.save();
}).then(function (newUserInfo) {
    responseData.message='注册成功';
    res.json(responseData);
    return;
});
});

//登录
router.post('/user/login',function (req,res) {
   var  username=req.body.username;
   var password=req.body.password;
   if(username==''||password==''){
responseData.code=1;
responseData.message='用户名或者密码不能为空';
res.json(responseData);
return;
   }
   //查询数据库相同用户名与密码记录是否存在，如果存在则登录
    User.findOne({
      username:username,
        password:password
    }).then(function (userInfo) {
        if(userInfo==null){
            responseData.code=2;
            responseData.message='用户名或者密码错误';
            res.json(responseData);
            return;
        }
        //用户名和密码正确
responseData.message='登录成功';
        responseData.userInfo={
            _id:userInfo._id,
            username:userInfo.username
        };
      req.cookies.set('userInfo',JSON.stringify({//保持成字符串存到userInfo里面
            _id:userInfo._id,
            username:userInfo.username
        }));//发送一个cookie信息至浏览器，浏览器会保存，每次访问都会通过头信息发送给服务端，来验证是否是登陆状态
        res.json(responseData);
        return;
    });
});

//退出登录
router.get('/user/logout',function (req,res) {
    req.cookies.set('userInfo',null),
        res.json(responseData)
});

/*
* 获取指定文章的所用评论
* */
router.get('/comment',function (req,res) {
    var contentId=req.query.contentId||'';
    Content.findOne({
        _id:contentId
    }).then(function (content) {
        responseData.data=content.comments;
        res.json(responseData);
    })
});

/*
* 分页
* */

/*
* 评论内容
* */
router.post('/comment/post',function (req,res) {
    //内容id
    var contentId=req.body.contentId||'';
    var postData={
        username:req.userInfo.username,
        postTime:new Date(),
        content:req.body.content
    };
    //查询这篇文章的内容
     Content.findOne({
         _id:contentId
     }).then(function (content) {
         content.comments.push(postData);
       return  content.save();
     }).then(function (newContent) {
         responseData.message='评论成功';
             responseData.data=newContent;
         res.json(responseData)
     })
});
module.exports=router;