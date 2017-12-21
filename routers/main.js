/**
 * Created by 与你在巅峰相会 on 2017/6/19.
 */
var express=require('express');
var router=express.Router();
var Category =require('../models/Category');
var Content=require('../models/Content');
var data;
/*
* 处理通用数据
* */
router.use(function (req,res,next) {
    data={
        userInfo:req.userInfo,
        categories:[]
    };
    Category.find().then(function (categories){
        data.categories=categories;
        next();
    });

});


/*
* 首页
* */
router.get('/',function (req,res,next) {
   /*  data={
        page:,
       ,
        limit:2,
        pages:0,
        count:0,
        contents:''
    };*/
    data.page=Number(req.query.page||1);
    data.category= req.query.category||'';
    data.limit=10;
    data.pages=0;
    data.count=0;
    data.contents='';

    var where={};
    if(data.category){
        where.category=data.category;
    }
    //读取分类的信息
    Content.count().where(where).then(function (count) {
        data.count=count;
        //总页数
        data.pages=Math.ceil(data.count/data.limit);
        //取值不超过最大页数
        data.page=Math.min(data.page,data.pages);
        //取值不 小于1
        data.page=Math.max(data.page,1);
        var skip=(data.page-1)*data.limit;
      return  Content.find().where(where).limit(data.limit).skip(skip).populate(['category','user']).sort({addTime:-1});
    }).then(function (contents) {
        data.contents=contents;
        res.render('main/index', data);
    })
});

/*
* 查看全文
* */
router.get('/view',function (req,res,next) {

    var contentId=req.query.contentId||'';
    Content.findOne({_id:contentId}).then(function (content) {
        data.content=content;
        content.views++;
        content.save();
        res.render('main/view',data);
    })
})

module.exports=router;