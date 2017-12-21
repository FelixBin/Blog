/**
 * Created by 与你在巅峰相会 on 2017/7/3.
 */
var mongoose=require('mongoose');
var contentSchema=require('../schemas/content');

module.exports=mongoose.model('Content',contentSchema);