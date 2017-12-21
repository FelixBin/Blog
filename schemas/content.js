/**
 * Created by 与你在巅峰相会 on 2017/7/3.
 */
var mongoose=require('mongoose');
//内容表结构
module.exports=new  mongoose.Schema({
    //关联字段--内容分类id
    category:{
        //类型
        type:mongoose.Schema.Types.ObjectId,
        //引用 models
        ref:'Category'
    },
    //用户
    user:{
        //类型
        type:mongoose.Schema.Types.ObjectId,
        //引用 models
        ref:'User'
    },
    //点击量
    views:{
        type:Number,
        default:0
    },
    //添加时间
    addTime:{
        type:Date,
 default:new Date()
    },
    //内容标题
    title:String,
    //简介
    description:{
    type:  String,
        default:''
    },
    //内容
    content:{
    type:String,
        default:''
    },
    comments:{
        type:Array,
        default:[]
    }
})