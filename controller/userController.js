const path = require("path");
const User = require("../model/User.js");

exports.doRegist = (req,res)=>{
    //{ username:"" , pwd:"" , userAccount:"" }
    let acc = req.body.userAccount;
    let pwd = config.md5Create.pwdCreate(req.body.pwd);
    let name = req.body.username;
    if(!acc || !pwd || !name){
        res.send({
            code:4,
            msg:"send data error, need userAccount/pwd/username"
        });
        return;
    }
    if(!config.reg.test(acc) || !config.reg.test(req.body.pwd)){
        res.send({
            code:3,
            msg:"Account or password error"
        })
        return;
    }
    User.find({username:name},(err,result)=>{
        try{
            if(result && result.length>0){
                res.send({
                    code:2,
                    msg:"Account already exist"
                })
            }else{
                let userId = config.idCreate.appleSignal();
                let createTime = new Date().getTime();
                let userObj = {
                    "username"  :   name,
                    "userId" :userId,
                    "userAccount" :acc,
                    "userPwd":pwd,
                    "userAvatar":"",
                    "createTime":createTime
                }
                let newUser = new User(userObj);
                newUser.save((err)=>{
                    res.send({
                        code:1,
                        msg:"success",
                    })
                });
            }
        }catch(err){
            res.send({
                code:-1,
                msg:"Interval Server Error",
                data:err
            })
        }
    })

}

exports.doLogin = (req,res)=>{
    //{ userAccount:"" , pwd:"" }
    let acc = req.body.userAccount;
    let pwd = config.md5Create.pwdCreate(req.body.pwd);
    if(!acc || !pwd ){
        res.send({
            code:4,
            msg:"send data error, need userAccount/pwd"
        });
        return;
    }
    if(!config.reg.test(acc) || !config.reg.test(req.body.pwd)){
        res.send({
            code:3,
            msg:"Account or password error"
        })
        return;
    }
    User.find({userAccount:acc},(err,result)=>{
        if(result && result.length>0){
            if(result[0].userPwd == pwd){
                let userId = result[0].userId;
                let token = config.md5Create.tokenCreate(userId);
                req.session.UID = userId;
                req.session.TID = token;
                res.send({
                    code:1,
                    msg:"login success",
                    data:{
                        username:result[0].username,
                        userId:result[0].userId,
                        userAvatar:result[0].userAvatar,
                        createTime:result[0].createTime
                    }
                })
            }else{
                res.send({
                    code:3,
                    msg:"Account or password error"
                })
            }
        }else{
            res.send({
                code:2,
                msg:"Account not exist"
            })
        }
    })
}

//验证登录状态
exports.getAuth = (req,res)=>{
    if(!req.session.UID || !req.session.TID){
        res.send({
            code:-1,
            msg:"login status lose efficacy"
        })
    }else{
        res.send({
            code:1,
            msg:"auth pass"
        })
    }
}

//更改用户信息
exports.changeUserInfo = (req,res)=>{
    // { userId:""/*必须*/, username:"" , userAvatar:"",userPwd:"" }
    if(!req.body.userId){
        res.send({
            code:4,
            msg:"send data error , need userId"
        });
        return;
    }
    if(!req.body.username && !req.body.userAvatar ){
        res.send({
            code:4,
            msg:"send data error , need username|userAvatar"
        });
        return;
    }

    new Promise((resolve,reject)=>{
        User.find({userId:req.body.userId},(err,result)=>{
            if(result && result.length>0){
                resolve(result[0]);
            }else{
                res.send({
                    code:3,
                    msg:"no such user"
                });
                return;
            }
        })
    }).then((userRes)=>{
        let set = {$set:{
            username:req.body.username || userRes.username,
            userAvatar:req.body.userAvatar || userRes.userAvatar
        }};
        var oAvatar = userRes.userAvatar;
        return new Promise((resolve,reject)=>{
            User.update({userId:req.body.userId},set,(err,result)=>{
                // if(req.body.userAvatar){
                //     resolve(oAvatar);
                // }else{
                    res.send({
                        code:1,
                        msg:"success"
                    });
                // };
            });
        })
    })
    // .then((oAvatar)=>{
    //     var p = path.resolve(__dirname,"..")+"/public"+oAvatar;
    //     fs.unlink(p,(err,re)=>{
    //         console.log(err);
    //     });
    //     res.send({
    //         code:1,
    //         msg:"success"
    //     });
    // })
}

//更改密码
exports.changePwd = (req,res)=>{
    //{ userId:"", cp:"" , np:"" }
    if(!req.body.userId || !req.body.cp || !req.body.np){
        res.send({
            code:4,
            msg:"send data error , need userId/currentPwd(cp)/newPwd(np)"
        });
        return;
    }
    new Promise((resolve,reject)=>{
        User.find({userId:req.body.userId},(err,result)=>{
            if(result && result.length>0){
                let sendCp = config.md5Create.pwdCreate(req.body.cp);
                if(result[0]["userPwd"] == sendCp){
                    resolve(sendCp);
                }else{
                    res.send({
                        code:3,
                        msg:"Password error"
                    })
                    return;
                }
            }else{
                res.send({
                    code:3,
                    msg:"no such user"
                });
                return;
            }
        })
    }).then((sendCp)=>{
        let newCp = config.md5Create.pwdCreate(req.body.np);
        User.update({userId:req.body.userId},{ $set:{userPwd:newCp} },(err,result)=>{
            res.send({
                code:1,
                msg:"success"
            })
        })
    })  
}
