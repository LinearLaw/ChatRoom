const path = require("path");
const Room = require("../model/Room.js");
const User = require("../model/User.js")

exports.createRoom = (req,res)=>{
    //{ userId:"" , "roomName":"" , "roomDesc":"" , "roomAvatar":"" }
    if(!req.body.userId || !req.body.roomName
        || !req.body.roomDesc || !req.body.roomAvatar){
        res.send({
            code:4,
            msg:"send data error, need userId/roomName/roomDesc/roomAvatar"
        });
        return;
    }
    User.find({userId:req.body.userId},(err,result)=>{
        if(result && result.length>0){
            let roomId = config.idCreate.orangeSignal();
            let createTime = new Date().getTime();
            let roomObj = {
                "roomId":roomId,
                "roomName":req.body.roomName,
                "roomDesc":req.body.roomDesc,
                "roomAvatar":req.body.roomAvatar,
                "userId":req.body.userId,
                "status":"open", //open close
                "createTime":createTime,
                "exitTime":0, // default 0
                "join":[]
            }
            let newRoom = new Room(roomObj);
            newRoom.save((err)=>{
                res.send({
                    code:1,
                    msg:"success",
                    data:roomObj
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

exports.getRoomList = (req,res)=>{
    // { pageNum:1 , pageSize:10 , userId:"" }
    let pageNum = parseInt(req.query.pageNum) || 1;
    let pageSize = parseInt(req.query.pageSize) || 10;
    let userId = req.query.userId;
    if(!userId){
        res.send({
            code:4,
            msg:"send data error , need userId"
        })
        return;
    }
    let s = (pageNum - 1) * pageSize;
    Room.find({
        "status":"open"
    }).sort({'_id':-1}).skip(s).limit(pageSize).exec((err,result)=>{
        res.send({
            code:1,
            msg:"success",
            data:result,
            pageNum:pageNum,
            pageSize:pageSize,
            count:result.length
        })
    })
}
exports.getRoomInfo = (req,res)=>{
    // { roomId:"",userId:"" }
    let roomId = req.query.roomId;
    let userId = req.query.userId;
    if(!roomId){
        res.send({
            code:4,
            msg:"send data error , need roomId"
        });
        return;
    }
    if(!userId){
        res.send({
            code:4,
            msg:"send data error , need userId"
        });
        return;
    }
    new Promise(function(resolve, reject){
        Room.find({roomId:roomId},(err,result)=>{
            if(result && result.length>0){
                resolve(result[0]);
            }else{
                res.send({
                    code:3,
                    msg:"no such room"
                });
                reject();
            }
        });
    }).then((result)=>{
        User.find({userId:userId},(err,userRes)=>{
            if(userRes.length > 0){
                let username = userRes[0].username;
                let sendInfo = {
                    userId:result.userId,
                    createTime:result.createTime,
                    join:result.join,
                    roomAvatar:result.roomAvatar,
                    roomDesc:result.roomDesc,
                    roomId:result.roomId,
                    roomName:result.roomName,
                    status:result.status,
                    userId:result.userId,
                    username:username
                }
                res.send({
                    code:1,
                    msg:"success",
                    data:sendInfo
                })
            }else{
                res.send({
                    code:3,
                    msg:"no such user"
                })
            }
        })
    })
}

exports.delRoom = (req,res)=>{
    // {  roomId:rid,  userId:userInfo.userId  }
    if(!req.body.userId || !req.body.roomId){
        res.send({
            code:4,
            msg:"send data error, need userId/roomId"
        })
        return;
    }
    try{
        Room.find({"roomId":req.body.roomId},(err,result)=>{
            if(result && result.length>0){
                if(result[0]["userId"] && result[0]["userId"] == req.body.userId){
                    Room.remove({roomId:req.body.roomId},(err)=>{
                        if(err){
                            res.send({
                                code:-1,
                                msg:"Interval Server Error",
                                data:err
                            })
                        }else{
                            res.send({
                                code:1,
                                msg:"success"
                            });
                        }
                    })
                    var p = path.resolve(__dirname,"..")+"/public"+result[0]["roomAvatar"];
                    fs.unlink(p,(err,re)=>{
                        console.log(err);
                    });
                }
            }else{
                res.send({
                    code:2,
                    msg:"user have no auth to delete this room, or room not exist"
                })
            }
            
        })
    }catch(err){
        console.log(err);
    }
}

exports.exitRoom = (req,res)=>{
    //{ "userId":"" , "roomId":"" }
    if(!req.body.userId || !req.body.roomId){
        res.send({
            code:4,
            msg:"send data error, need userId/roomId"
        })
        return;
    }
    Room.find({"roomId":req.body.roomId},(err,result)=>{
        if(result && result.length>0){
            if(result[0]["userId"] && result[0]["userId"] == req.body.userId){
                let con = {"roomId":req.body.roomId};
                let set = {$set:{"status":"close"}};
                Room.update(con,set,(err)=>{
                    if(err){
                        res.send({
                            code:-1,
                            msg:"Interval Server Error",
                            data:err
                        })
                    }else{
                        res.send({
                            code:1,
                            msg:"success"
                        });
                    }
                    return;
                })
            }
        }else{
            res.send({
                code:2,
                msg:"user have no auth to exit this room, or room not exist"
            })
        }
        
    })
}
