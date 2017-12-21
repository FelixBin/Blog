/**
 * Created by 与你在巅峰相会 on 2017/6/19.
 */
var express=require('express');
var router=express.Router();
var User=require('../models/User');//引入数据库
var Category =require('../models/Category');
var Content =require('../models/Content');
router.use(function (req,res,next) {

 if(!req.userInfo.isAdmin){
        console.log("对不起只有管理员可以进入");
        return;
    }
    next();
});
//首页
router.get('/',function (req,res,next) {
    res.render('admin/index',{
        userInfo:req.userInfo
    });
});

/*用户管理*/
router.get('/user',function (req,res) {
    /*从数据库读取所有用户，然后分配给模板，让模板展示出来*/
    /*分页通过limit（Numeber）   limit 限制的数量  显示的数量
    * skip()：忽略数据的条数
    * 每页两条：
    * 第1页： 忽略（skip）0条  取1-2    --->（当前页-1）*limit=忽略的条数
    * 第2页：忽略(skip)2条     取3-4
    *
    * */

  /*  var page=2;*/
    var page=Number(req.query.page||1);
    var limit=2;
    var pages=0;
    User.count().then(function (count) {
        //总页数
        pages=Math.ceil(count/limit);
        //取值不超过最大页数
        page=Math.min(page,pages);
        //取值不 小于1
        page=Math.max(page,1);
        var skip=(page-1)*limit;
        User.find().limit(limit).skip(skip).then(function (users) {
            res.render('admin/user_index',{
                userInfo:req.userInfo,
                users:users,
                contT:count,
                pages:pages,
                limit:limit,
                page:page
            });
        });
    })
});
/*
*
*分类首页
* */
router.get('/category',function (req,res) {
    var page=Number(req.query.page||1);
    var limit=6;
    var pages=0;
    Category.count().then(function (count) {
        //总页数
        pages=Math.ceil(count/limit);
        //取值不超过最大页数
        page=Math.min(page,pages);
        //取值不 小于1
        page=Math.max(page,1);
        var skip=(page-1)*limit;
        Category.find().sort({_id:-1}).limit(limit).skip(skip).then(function (categories) {
            res.render('admin/cagegory_index',{
                userInfo:req.userInfo,
                categories:categories,
                contT:count,
                pages:pages,
                limit:limit,
                page:page
            });
        });
    })
})

/*
添加分类
* */
router.get('/category/add',function (req,res) {
    res.render('admin/cagegory_add',{
    userInfo:req.userInfo
    })
})
/*
*分类保存
*
* */
router.post('/category/add',function (req,res) {
    var name=req.body.name||'';
    if(name==''){
res.render('admin/error',{
            userInfo:req.userInfo,
            message:'名称不能为空'
        });
return;
    }
   //判断数据库是否已经存在相同的分类名称
    Category.findOne({
        name:name
    }).then(function (rs) {
        if(rs!=null){
            res.render('admin/error', {
                userInfo:req.userInfo,
                    message:'分类名称已经存在'
            });
            return Promise.reject();
        }else {
            //数据库中不存在可以保存
            return new Category({
                name:name
            }).save();
        }
    }).then(function () {
        res.render('admin/success',{
            userInfo:req.userInfo,
            message:'保存分类成功',
            url:'/admin/category'
        })
    })
})

/*
* 编辑分类
* */
router.get('/category/edit',function (req,res) {
    //获取需要修改的分类的信息，并用表单的形式展示出来

    var id=req.query.id||'';

    //获取要修改的信息
    Category.findOne({
        _id:id
    }).then(function (category) {

        if(category==null){
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:'分类信息不存在'
            });
            return Promise.reject();
        }
        else{//存在
res.render('admin/category_edit',{
    userInfo:req.userInfo,
    category:category
})
        }
    })
})

/*保存编辑
* */
router.post('/category/edit',function (req,res) {
    var id=req.query.id||'';
    //获取提交过来的分类名称
    var name=req.body.name||'';
    //从数据库查询
    Category.findOne({
        _id:id
    }).then(function (category) {
                    if(category==null){
                    res.render('admin/error',{
                userInfo:req.userInfo,
                message:'分类信息不存在'
                            });
                        return Promise.reject();
                    }
                    else{
            //当用户没有做任何修改提交时，提示修改成功
            if(name==category.name){
                res.render('admin/success',{
        userInfo:req.userInfo,
        message:'修改成功',
        url:'/admin/cagegory'
});
        return Promise.reject();
            }
         else{
          //要修改的分类是否已经在数据库中存在
                return    Category.findOne({
                        _id:{$ne:id},
                        name:name
                    });
             }
        }
    }).then(function (sameCagtegory) {
        if(sameCagtegory){
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:'已存在相同的分类名称'
            });
            return Promise.reject();
        }else{
      return   Category.update(
                    {_id:id},
                    {name:name}
                    )
                }
            }).then(function () {
        res.render('admin/success',{
            userInfo:req.userInfo,
            message:'修改成功',
            url:'/admin/category'
        })
    })
})
/*分类删除
* */
router.get('/category/delete',function (req,res) {
var id=req.query.id||'';
Category.remove({
    _id:id
}).then(function () {
    res.render('admin/success',{
        userInfo:req.userInfo,
        message:'删除成功',
        url:'/admin/category'
    });
})
});

/*
* 内容首页
* */
router.get('/content',function (req,res) {
    var page=Number(req.query.page||1);
    var limit=6;
    var pages=0;
    Content.count().then(function (count) {
        //总页数
        pages=Math.ceil(count/limit);
        //取值不超过最大页数
        page=Math.min(page,pages);
        //取值不 小于1
        page=Math.max(page,1);
        var skip=(page-1)*limit;
        Content.find().sort({_id:-1}).limit(limit).populate(['category','user']).skip(skip).then(function (contents) {

            res.render('admin/content_index',{
                userInfo:req.userInfo,
                contents:contents,
                contT:count,
                pages:pages,
                limit:limit,
                page:page
            });
        });
    })
});
/*
添加内容
* */
//sort  排序  -1： 降序
//             1： 升序
router.get('/content/add',function (req,res) {
    Category.find().sort({_id:-1}).then(function (categories) {
        res.render('admin/content_add',{
            userInfo:req.userInfo,
            categories:categories//把分类分配给模板
        })
    });

});
/*
* 内容保存
* */
router.post('/content/add',function (req,res) {

    if(req.body.category==''){
res.render('admin/error',{
    userInfo:req.userInfo,
    message:'内容分类不能为空'
})
        return;
    }
    if(req.body.title==''){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'内容标题不能为空'
        })
        return;
    }
//保存数据到数据库
    new Content({
        category:req.body.category,
        title:req.body.title,
        user:req.userInfo._id.toString(),
        description:req.body.description,
        content:req.body.content
    }).save().then(function (rs) {

        res.render('admin/success',{
            userInfo:req.userInfo,
            message:'内容保存成功',
            url:'/admin/content'
        })
    });
});

/*
* 内容修改
* */
router.get('/content/edit',function (req,res) {
    var id=req.query.id||'';
var categories=[];
    Category.find().sort({_id:-1}).then(function (rs) {
        categories=rs;
      return  Content.findOne({_id:id}).populate('category')
    }).then(function (content) {
        if(content==''){
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:'当前内容不存在'
            });
            return Promise.reject();
        }else{
            res.render('admin/content_edit',{
                userInfo:req.userInfo,
                content:content,
                categories:categories
            })
        }
    });
});
/*
* 内容修改保存
* */
router.post('/content/edit',function (req,res) {
    var id=req.query.id||'';
    if(req.body.category==''){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'内容分类不能为空'
        })
        return;
    }
    if(req.body.title==''){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'内容标题不能为空'
        })
        return;
    }
    Content.update({
        _id:id
    },{
        category:req.body.category,
        title:req.body.title,
        description:req.body.description,
        content:req.body.content
    }).then(function () {
        res.render('admin/success',{
       userInfo:req.userInfo,
            message:'内容保存成功',
            url:'/admin/content'
        })
    })
});

/*
内容删除
* */
router.get('/content/delete',function (req,res) {
    var id=req.query.id||'';
    Content.remove({_id:id}).then(function (rs) {
     res.render('admin/success',{
         userInfo:req.userInfo,
         message:'删除成功',
         url:'/admin/content'
     })
    })
})

module.exports=router;