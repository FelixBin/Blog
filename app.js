/**
 * Created by 与你在巅峰相会 on 2017/6/19.
 * 应用程序启动的（入口）文件
 */
//加载express模块
var express=require('express');

//加载模块处理模块
var swig=require("swig");

//创建app应用 =>nodeJs http.createServer()
 var app=express();

//设置静态资源托管
//当用户访问的url 以public开始，那么直接返回对应的_dirname+'public'下的文件
app.use('/public',express.static(__dirname+'/public'));

 //对数据库操作
var mongoose=require('mongoose');

//加载body-parse,用来处理post提交过来的数据
var bodyParse=require('body-parser');
//引入cookie
var Cookies=require('cookies');
//引入model
var User=require('./models/User');

 /*配置应用模块
 定义当前应用所使用的模板引擎
 *  第一个参数 ：模板引擎的名称同时也是，模板文件的后缀，第二个参数表示用于解析处理模板内容的方法
 * */
 app.engine('html',swig.renderFile);

//设置模板文件存放的目录，第一个参数必须是views,第二个参数是目录
app.set('views','./views');
 //注册所使用的的模板引擎，第一个参数必须是view engine,第二个参数与app.engine这个方法中定义的模板引擎的名称（第一个参数）是一致的。
 app.set('view engine','html');

 //开发过程需取消模板缓存
swig.setDefaults({cache:false});

//bodyParse设置
app.use(bodyParse.urlencoded({extended:true}));
//设置cookie
app.use(function (req,res,next ) {
req.cookies=new Cookies(req,res);
var  userInfo={};
//解析登录用户 cookie信息
    if(req.cookies.get("userInfo")){
        try{
req.userInfo=JSON.parse(req.cookies.get("userInfo"));
//获取当前登录用户的信息，是否是管理员
            User.findById(req.userInfo._id).then(function (userInfo) {
                req.userInfo.isAdmin=Boolean(userInfo.isAdmin);
                next();
            });
        }catch (e){
            next();
        }
    }
else{
        next();
    }

});
/*
 /!*首页
 * req  request对象
 * res response对象
 * next   与之匹配的下一个函数
 * *!/
app.get('/',function (req,res,next) {
    //res.send("<center><h1 style='color: greenyellow'>欢迎来到我的博客</h1></center>");
    //读取views下的指定文件，解析并返回给客户端
    //第一个参数表示：模板的文件，相对于views目录  views/index.html
    //第二个参数传递该模板的数据
    res.render('index');

});
*/
//根据不同功能划分模块
app.use('/admin',require('./routers/admin'));
app.use('/api',require('./routers/api'));
app.use('/',require('./routers/main'));

//监听http请求
mongoose.connect('mongodb://localhost:27019/blog',function (err) {
    if(err){
console.log("数据库连接失败！");
    }else{
     console.log("数据库连接成功!");//必须保持命令行开启才会成功
        app.listen(8082);
    }
});

