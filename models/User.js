/**
 * Created by 与你在巅峰相会 on 2017/6/20.
 */
var mongoose=require('mongoose');
var userSchema=require('../schemas/users');
//模型的创建 通过mongoose的model方法
module.exports= mongoose.model('User',userSchema);//第一个参数是model的名字 第二个参数是数据的来源

//返回的是一个构造函数