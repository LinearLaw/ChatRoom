(function(){
    $getAuth(function(){
        location.href = $config.loginPage;
        return;
    })
    var userInfo = $config.getUserInfo();
    var pageSize = 10;
    var pageNum = 1;
    var nowLocale = $url('protocol',location.href)+"://"+$url('hostname',location.href)+":"+$url('port',location.href);

    /*
     * @desc 获取room list
     */
    function getRoomList(scb,ecb){
        var a = {
            pageNum:pageNum ,
            pageSize:pageSize ,
            userId:userInfo.userId
        }
        $.ajax({
            url:"/getRoomList",
            method:"GET",
            data:a,
            success:function(res){
                // console.log(res);
                if(res.code == 1){
                    var g = res;
                    g.data.map(function(item,index){
                        g.data[index]["timeText"] = $config.getTime(item.createTime).timeText;
                        g.data[index]["originAvatar"] = nowLocale + g.data[index]["roomAvatar"];
                    });
                    var h = template("roomList",g);
                    $(".roomListContainer").append(h);
                    if(res.data.length<=0 && ecb){ecb();}
                }else{
                    if(ecb){ecb();}
                }
            },
            error:function(err){
                console.log(err);
                if(ecb){ecb();}
            }
        })
    }
    /**
     * @desc 上传图片
     */
    function uploadImg(titleImgSrc,cb){
        $.ajax({
            url:'/uploadPic?userId='+userInfo.userId,
            method:'post',
            data:{
                titleImgSrc:titleImgSrc
            },
            success:function(res){
                console.log(res);
                if(res.code == 1){
                    cb(res.data);
                }else{
                    console.log("error");
                }
            },
            error:function(){
                console.log("error");
            }
        })
    };
    function updateUserInfo(info,cb){
        $.ajax({
            url:'/changeUserInfo',
            method:'post',
            data:info,
            success:function(res){
                console.log(res);
                if(res.code == 1){
                    cb(res.data);
                }else{
                    console.log("error");
                }
            },
            error:function(){
                console.log("error");
            }
        })
    }
    /**
     * @desc 创建room
     */
    function createRoom(){
        var roomName = $("#romeName").val().trim();
        var roomDesc = $("#roomDesc").val().trim();
        var roomAvatar = $("#roomAvatar").data("origin");
        if(!roomName){
            return;
        }
        if(!roomDesc){
            return;
        }
        if(!roomAvatar){
            return;
        }
        var o = {
            "userId":userInfo.userId,
            "roomName":roomName ,
            "roomDesc":roomDesc ,
            "roomAvatar":roomAvatar
        }
        $.ajax({
            url:"/createRoom",
            method:"POST",
            data:o,
            success:function(res){
                console.log(res);
                if(res.code == 1){
                    $TipsDialog({text:"Create Room Success!"});
                    $(".roomListContainer").html("");
                    pageNum = 1;
                    getRoomList();
                    $('#myModal').modal("hide");
                }else{

                }
            },
            error:function(err){
                console.log(err);
            }
        })
    }

    getRoomList();
    $(".welcomeName").html(userInfo.username + "");
    if(!!userInfo.userAvatar){
        $("#headerAvatar").attr("src",nowLocale + userInfo.userAvatar).parent().addClass("active");
    }
    /**
     * @desc 创建Room提交数据
     */
    $("#createRoomNow").click(function(){
        var titleImgSrc = $("#roomAvatar").attr("src");
        uploadImg(titleImgSrc,function(data){
            $("#roomAvatar").attr("src",nowLocale + data);
            $("#roomAvatar").data("origin",data);
            createRoom();
        });
    });

    /**
     * @desc room上传图片
     */
    $("#avatarInput").on("change",function(){
        var r= new FileReader();
        f=$('#avatarInput')[0].files[0];
        r.readAsDataURL(f);
        r.onload=function (e) {
            $("#roomAvatar").attr("src",this.result).parent().addClass("active");
        };
    });

    /**
     * @desc 个人上传图片
     */
    $("#avatarInputHeader").on("change",function(){
        var r= new FileReader();
        f=$('#avatarInputHeader')[0].files[0];
        r.readAsDataURL(f);
        r.onload=function (e) {
            $("#headerAvatar").attr("src",this.result).parent().addClass("active");
            // 上传图片
            var titleImgSrc = $("#headerAvatar").attr("src");
            uploadImg(titleImgSrc,function(data){
                $("#headerAvatar").attr("src",nowLocale + data);
                $("#headerAvatar").data("origin",data);
                updateUserInfo({
                    userId:userInfo.userId,
                    userAvatar:data
                },function(da){
                    var _in = JSON.parse( $cookie.get("UIN") )
                    _in["userAvatar"] = data;
                    $cookie.set("UIN",JSON.stringify(_in));
                })
            });
        };
    });

    /**
     * @desc 加载下一页
     */
    $(".refreshList").click(function(e){
        $(e.currentTarget).children(".glyphicon").removeClass("roundFresh");
        setTimeout(function(){
            $(e.currentTarget).children(".glyphicon").addClass("roundFresh");
            pageNum++;
            getRoomList(function(){},function(){
                pageNum--;
                if(pageNum<=1){pageNum=1;}
            });
        },100);
    });

})()
