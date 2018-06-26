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
    console.log(req.query);
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
        // "status":"open"
    }).skip(s).limit(pageSize).exec((err,result)=>{
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
        }
        res.send({
            code:2,
            msg:"user have no auth to exit this room, or room not exist"
        })
    })
}
