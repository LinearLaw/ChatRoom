const Comment = require("../model/Comment.js");
const User = require("../model/User.js");

exports.getCommentList = (req,res)=>{
    //{ userId:""  ,  roomId:"" }
    let r = req.query.roomId;
    let u = req.query.userId;
    if(!r || !u){
        res.send({
            code:4,
            msg:"send data error , need userId/roomId"
        });
        return;
    }
    Comment.find({roomId:r}).sort({"_id":1}).limit(50).exec((err,result)=>{
        res.send({
            code:1,
            msg:"success",
            data:result
        })
    })
}

exports.reportComment = (req,res)=>{
    //{ content:"",userId:"",userAvatar:"" ,username:"", roomId:"" }
    if(!req.body.roomId || !req.body.userId ){
        res.send({
            code:4,
            msg:"send data error, need userId/roomId"
        })
        return;
    }
    if(!req.body.content || !req.body.username){
        res.send({
            code:4,
            msg:"send data error, need content/username"
        })
        return;
    }
    User.find({userId:req.body.userId},(err,result)=>{
        if(result && result.length>0){
            let commentId = config.idCreate.orangeSignal();
            let createTime = new Date().getTime();
            let cmtObj = {
                userId:req.body.userId,
                username:req.body.username,
                userAvatar:req.body.userAvatar||"",
                roomId:req.body.roomId,
                content:req.body.content,

                commentId:commentId,
                createTime:createTime,
            }
            let newCmt = new Comment(cmtObj);
            newCmt.save((err)=>{
                res.send({
                    code:1,
                    msg:"success",
                    data:cmtObj
                })
            })

        }else{
            res.send({
                code:2,
                msg:"User not exist"
            })
        }
    })
}

exports.deleteComment = (req,res)=>{
    //{ userId:"" , "commnetId" }
    if(!req.body.userId || !req.body.commentId){
        res.send({
            code:4,
            msg:"send data error, need userId/commentId"
        });
        return;
    }
    new Promise((resolve,reject)=>{
        Comment.find({commentId:req.body.commentId},(err,result)=>{
            if(result && result.length>0){
                if(result[0]["userId"] == req.body.userId){
                    resolve();
                }else{
                    res.send({
                        code:2,
                        msg:"User have no auth to delete this comment."
                    });
                    return;
                }
            }else{
                res.send({
                    code:3,
                    msg:"no such comment"
                });
                return;
            }
        })
    }).then((err)=>{
        Comment.remove({commentId:req.body.commentId},(err)=>{
            res.send({
                code:1,
                msg:"success"
            })
        })
    })
}
