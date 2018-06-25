const RoomStatus = require("../model/RoomStatus.js");

exports.apiSocket = (socket)=> {

    //获取当前时间
    function getTimeNow(){
        let nowTime = new Date();
        let hours = nowTime.getHours();
        let minute = nowTime.getMinutes();
        let second = nowTime.getSeconds();
        let h = hours<10?"0"+hours:hours;
        let min = minute<10?"0"+minute:minute;
        let s = second<10?"0"+second:second;
        return h + ":" + min + ":" + s;
    }

    //新用户链接，进行推送
    socket.on('join', function (info) {
        //当前链接数
        let count = io.eio.clientsCount;
        let ri = info.ri;
        RoomStatus.find({roomId:ri},(err,result)=>{
            if(result && result.length>0){
                RoomStatus.find({roomId:ri},{
                    $push:{ "join":{userId:info.userId} }
                },(err,result)=>{
                    console.log("success");
                });
            }
        })

        // 通知房间内人员
        io.emit('userConnect', {
            userCount:count,
            info:"用户 " + info.username + " 加入了房间"
        });
     });

    //用户发出消息
    socket.on("fabiao",function(msg){
       let time = getTimeNow();
       let nowTime = msg.nowTime;
       let inputVal = msg.inputVal;
       let userName = msg.userName;

       io.emit("pinglun",{
          inputVal:inputVal,
          userName:userName,
          time:time,
          nowTime:nowTime
       });
    });

   //点赞
    socket.on("dianzan",function(msg){
        let nowtime = msg.nowtime;
        let dianzan = msg.dianzan;

        dianzan ++ ;//点赞
        io.emit("dianzanTotal",{
           nowtime:nowtime,
           dianzan:dianzan
       });
    });

    //退出聊天
    socket.on("exit",function(msg){
        var n = msg.username;
        console.log('用户 ' + n + ' 退出了房间');
        io.emit("userExit",{
            username:n
        })
    })
};
