$commonRequest.getAuth(function(){
    location.href = $config.loginPage;
    return;
})

var socket = io();

var ri = $config.getRoomId() || "admin";
$(".userInfo").show();
$(".userInfoName").html("User Name: "+userInfo.username);

getRoomInfo();
getRoomHistory();


/************************** EVENT **********************************/
//按回车自动提交
$(document).keyup(function(event){
    switch(event.keyCode) {
        case 13:
            report();
            return;
    }
});

//点击按钮，返回列表页
$(".backToList").click(function(){
    location.href = "/html/list.html";
});

//发出消息，用户离开room
$(window).bind('beforeunload', function(){
    socket.emit("exit",{
        username:userInfo.username,
        userId:userInfo.userId,
        ri:ri
    })
})

/************************** Function **********************************/
/**
 * @desc 获取room的历史记录
 */
function getRoomHistory(){
    $.ajax({
        url:"/getCommentList",
        type:"GET",
        data:{roomId:ri,userId:userInfo.userId},
        success:function(res){
            console.log(res);
            if(res.code == 1){
                var html = "";
                res.data.map(function(item,index){
                    var userSingleWord = item.username.slice(item.username.length-1 , item.username.length);
                    var userA = item.userAvatar?nowLocale + item.userAvatar:"";
                    var data = {
                        userSingleWord:userSingleWord,
                        userName:item.username + "",
                        userAvatar:userA,
                        time:$config.getTime(item.createTime).timeText,
                        content:item.content,
                        nowTime:item.createTime
                    }
                    html = html + template("cmtTpl",data);
                });
                $(".comment-area").append(html);
                $(".comment-area").scrollTop($(".comment-area")[0].scrollHeight);
            }
        },
        error:function(err){
            console.log(err);
        }
    })
}

/**
 * @desc 按钮点击发表评论
 */
function report(e) {
    var nowTime = new Date().getTime();
    var inputVal = $(".form-comment input").val().trim();
    if (inputVal == "") {
        // toast('请输入发表内容');
        return;
    };
    socket.emit("fabiao", {
        "userId":userInfo.userId,
        "userName": userInfo.username,
        "userAvatar":userInfo.userAvatar,
        "inputVal": inputVal,
        "nowTime": nowTime
    });
    $(".form-comment input").val("");
};

function plContent(){
    $(".form-btn input").focus();
}
/**
 * @desc get room info
 */
function getRoomInfo(){
    $.ajax({
        url:"/getRoomInfo",
        type:"GET",
        data:{roomId:ri,userId:userInfo.userId},
        success:function(res){
            console.log(res);
            if(res.code == 1){
                res.data["timeText"] = $config.getTime(res.data.createTime).timeText;
                var html = template("roomInfo",res.data);
                var html_2 = template("roomModalTpl",res.data)
                $(".roomInfo").html(html);
                $(".roomInfoBody").html(html_2);
                $(".roomInfoModalTitle").html(res.data.roomName);
                $(".roomInfoNum").html("Room [ "+res.data.roomName + " ]");
            }
        },
        error:function(err){
            console.log(err);
        }
    })
}

//发出消息，点赞
function dianzan(this_) {
    var nowtime = $(this_).attr("nowtime");
    socket.emit("dianzan", {
        "nowtime": nowtime,
        "dianzan": parseInt($(this_).find("em").text()),
    });
};

/************************** Socket **********************************/
//发出消息，连接推送
socket.on('connect', function () {
    socket.emit('join', {
        username:userInfo.username,
        userId:userInfo.userId,
        ri:ri
    });
});

//收到消息，评论
socket.on("pinglun", function (msg) {
    var userName = msg.userName;
    var userSingleWord = userName.slice(userName.length-1 , userName.length);
    var userA = msg.userAvatar?nowLocale + msg.userAvatar:"";
    var data = {
        userSingleWord:userSingleWord,
        userName:msg.userName + "",
        userAvatar:userA,
        time:msg.time,
        content:msg.inputVal,
        nowTime:msg.nowTime
    }
    var html = template("cmtTpl",data);
    var count = $(".comment-area").children(".comment-item").length;
    //释放内存
    if(count>100){
        $(".comment-area").children(".comment-item").eq(0).remove();
    }
    $(".comment-area").append(html);
    $(".comment-area").scrollTop($(".comment-area")[0].scrollHeight);
});




var dianzanLimit = 100000000;
//收到消息，点赞数据更新
socket.on("dianzanTotal", function (msg) {
    var nowtime = msg.nowtime;
    var dianzan = msg.dianzan;
    if(parseInt(dianzan) >= dianzanLimit){
        $(".dianzan[nowtime=" + nowtime + "]").find("em").text(dianzanLimit - 1 + " +");
    }else{
        $(".dianzan[nowtime=" + nowtime + "]").find("em").text(dianzan);
    }
});

//收到消息，当前已连接
socket.on("userConnect",function(msg){
    var count = msg.userCount;
    var info = msg.info;
    var obj = {
            infoTop:msg.info + "，当前用户 ",
            infoMiddle:msg.userCount,
            infoBottom:" 人"
    }
    var html = template("onePsnLink",obj);
    $(".comment-area").append(html);
    $(".comment-area").scrollTop($(".comment-area")[0].scrollHeight);
    $(".iconUserCount").text(count);
})

//收到消息，用户退出房间
socket.on("userExit",function(msg){
    var obj = {
        infoTop:"用户 ",
        infoMiddle:msg.userName,
        infoBottom:" 退出了房间"
    }
    var html = template("onePsnLink",obj);
    $(".comment-area").append(html);
    $(".comment-area").scrollTop($(".comment-area")[0].scrollHeight);
})
