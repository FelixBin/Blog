/**
 * Created by 与你在巅峰相会 on 2017/7/2.
 */
var mongoose=require('mongoose');

var userSchema=require('../schemas/category');

module.exports=mongoose.model('Category',userSchema);