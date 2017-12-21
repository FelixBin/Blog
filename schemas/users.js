/**
 * Created by 与你在巅峰相会 on 2017/6/19.
 */
var mongoose=require('mongoose');


//用户的表结构

module.exports =new mongoose.Schema({
    //用户名
    username:String,
    //密码
    password:String,
    isAdmin:{
        type:Boolean,
        default:false
    }
});
//module.exports //向外提供（向外提供）