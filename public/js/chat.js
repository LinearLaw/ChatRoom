$getAuth(function(){
    location.href = $config.loginPage;
    return;
})

var userName; // 用户名
var socket = io();
var userInfo;
function setUserInfo(){
    if(!$cookie.get("UIN") ){
        location.href = $config.loginPage;
        return;
    }
    userInfo = JSON.parse($cookie.get("UIN"));
    $(".userInfo").show();
    $(".userInfoName").html("ID: "+userInfo.username);
}
setUserInfo();



// 输入名字
$(".el-button--primary").click(function(){
    var inputVal = $(".userName").val().trim();
    if (inputVal == "") {
        toast('请输入发表内容');
        return;
    };
    $(".shadowBox").hide();
    userName = inputVal;
    $(".userInfo").show();
    $(".userInfoName").html("ID: "+userName);
})

//按回车自动提交
$(document).keyup(function(event){
    switch(event.keyCode) {
        case 13:
            report();
            return;
    }
})

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
        "userName": userInfo.username,
        "inputVal": inputVal,
        "nowTime": nowTime
    });
    $(".form-comment input").val("");
};

function plContent(){

}

//连接推送
socket.on('connect', function () {
    var ri = GetQueryString("ri") || "admin";
    socket.emit('join', {
        username:userInfo.username,
        userId:userInfo.userId,
        ri:ri
    });
});

//广播评论
socket.on("pinglun", function (msg) {
    var userName = msg.userName + "";
    var content = msg.inputVal;
    var time = msg.time;
    var nowTime = msg.nowTime;
    var userSingleWord = userName.slice(userName.length-1 , userName.length);

    var html = '<div class="comment-item" nowtime="' + nowTime + '">' +
                    '<a href="#" class="avatar noAvatar">' +
                        // '<img src="../img/audio03.png" alt="">' +
                        '<span>'+ userSingleWord +'</span>'+
                    '</a>' +
                    '<div class="content">' +
                        '<div class="from">' +
                            '<span class="name">' + userName + '</span>' +
                            '<span class="date">' + time + '</span>' +
                        '</div>' +
                        '<div class="message">' + content +
                            '<div class="sayContent">' +
                                '<span class="dianzan" onclick="dianzan(this)" nowtime="' + nowTime + '">' +
                                    '<img class="thumpBtn" src="../img/icon/zan.png" alt="">'+
                                    '<em>0</em>' +
                                '</span>' +
                                // '<span class="plContent" onclick="plContent(this)">' +
                                //     '<img src="">' +
                                //     '<em>评论</em>' +
                                // '</span>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                '</div>';
    var count = $(".comment-area").children(".comment-item").length;
    //释放内存
    if(count>100){
        $(".comment-area").children(".comment-item").eq(0).remove();
    }
    $(".comment-area").append(html);
    $(".comment-area").scrollTop($(".comment-area")[0].scrollHeight);
});


//发出点赞socket
function dianzan(this_) {
    var nowtime = $(this_).attr("nowtime");
    socket.emit("dianzan", {
        "nowtime": nowtime,
        "dianzan": parseInt($(this_).find("em").text()),
    });
};

var dianzanLimit = 100000000;
//接收点赞推送
socket.on("dianzanTotal", function (msg) {
    var nowtime = msg.nowtime;
    var dianzan = msg.dianzan;
    if(parseInt(dianzan) >= dianzanLimit){
        $(".comment-item[nowtime=" + nowtime + "]").find(".dianzan em").text(dianzanLimit - 1 + " +");
    }else{
        $(".comment-item[nowtime=" + nowtime + "]").find(".dianzan em").text(dianzan);
    }
});

//退出聊天室
socket.on("deleteHourse",function(msg){
    //msg = { userName }

})

//获取当前连接数
socket.on("userConnect",function(msg){
    var count = msg.userCount;
    var info = msg.info;
    var html = '<div class="comment-item">'+
                '<div class="exitChatBox">'+
                    '<span class="exitChat">'+
                        '<span>' + info + ' , </span>'+
                        '<span>当前用户 </span>'+
                        '<span class="exitName">'+count+'</span>'+
                        '<span> 人</span>'+
                    '</span>'+
                '</div>'+
            '</div>'
    $(".comment-area").append(html);
    $(".comment-area").scrollTop($(".comment-area")[0].scrollHeight);
})

//用户离开room
$(window).bind('beforeunload', function(){
    socket.emit("exit",{
        username:userInfo.username
    })
})
socket.on("userExit",function(msg){
    let n = msg.username;
    var html = '<div class="comment-item">'+
                '<div class="exitChatBox">'+
                    '<span class="exitChat">'+
                        '<span>用户 ' + n + ' 退出了房间</span>'+
                    '</span>'+
                '</div>'+
            '</div>';
    $(".comment-area").append(html);
    $(".comment-area").scrollTop($(".comment-area")[0].scrollHeight);
})
