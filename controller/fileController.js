const path = require("path");
exports.uploadPic = (req,res)=>{
    try{
        const localIp = config.idCreate.getIp();//IP地址
        const port = config.port;//端口号

        let signal = config.idCreate.orangeSignal();
        let base64Data = req.body.titleImgSrc;
        let pos = base64Data.indexOf("4")+2;

        //去掉Base64:开头的标识字符
        let base64 = base64Data.substring(pos, base64Data.length - pos);
        let fileType = ".jpg";
        if(req.body.type.indexOf("gif")!=-1){
            fileType = ".gif";
        }
        if(req.body.type.indexOf("png")!=-1){
            fileType = ".png";
        }
        if(base64Data){
            const dataBuffer = new Buffer(base64,'base64');
            const dir = path.resolve(__dirname,"..") +'/public/imgData/'+signal;
            fs.writeFile(dir + fileType,dataBuffer, (err)=>{
                let imgPath = "/imgData/" + signal + fileType;
                res.send({
                    code:1,
                    data:imgPath
                })
            })
        }else{
            res.send({
                code:2,
                msg:"No such files"
            })


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
