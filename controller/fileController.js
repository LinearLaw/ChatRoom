const path = require("path");
exports.uploadPic = (req,res)=>{
    try{
        const localIp = config.idCreate.getIp();//IP地址
        const port = config.port;//端口号

        //文件名称
        let signal = config.idCreate.orangeSignal();
        if(req.body.imgUse == 1){
            signal = req.query.userId;
            console.log(signal);
        }

        //文件后缀
        let fileType = ".jpg";
        if(req.body.type.indexOf("gif")!=-1){
            fileType = ".gif";
        }
        if(req.body.type.indexOf("png")!=-1){
            fileType = ".png";
        }

        //提取图片数据
        let base64Data = req.body.titleImgSrc;
        let pos = base64Data.indexOf("4")+2;
        let base64 = base64Data.substring(pos, base64Data.length - pos);//去掉Base64:开头的标识字符
        
        if(base64Data){
            const dataBuffer = new Buffer(base64,'base64');
            const dir = path.resolve(__dirname,"..") +'/public/imgData/'+signal;
            
            fs.unlink(dir + fileType,(err,re)=>{
                fs.writeFile(dir + fileType,dataBuffer, (err)=>{
                    let imgPath = "/imgData/" + signal + fileType;
                    res.send({
                        code:1,
                        data:imgPath
                    })
                })
            });
            
        }else{
            res.send({
                code:2,
                msg:"No such files"
            });
        }
    }catch(err){
        console.log(err);
        res.send({
            code:-1,
            msg:"Internal Server Error",
            data:err
        })
    }
}
