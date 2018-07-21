(function(){
    $commonRequest.getAuth(function(){
        location.href = $config.loginPage;
        return;
    })
    var pageSize = 10;
    var pageNum = 1;

    function initInput(){
        $("#romeName").val("");
        $("#roomDesc").val("");
        $("#roomAvatar").data("origin","");
        $("#roomAvatar").attr("src","");
        $("#roomAvatar").parent().removeClass("active");
    }

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
                        g.data[index]["curUI"]=userInfo.userId
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
     * @desc 创建room
     */
    function createRoom(){
        var roomName = $("#romeName").val().trim();
        var roomDesc = $("#roomDesc").val().trim();
        var roomAvatar = $("#roomAvatar").data("origin");
        if(!roomName){return;}
        if(!roomDesc){return;}
        if(!roomAvatar){return;}
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
                if(res.code == 1){
                    $TipsDialog({text:"Create Room Success!"});
                    $(".roomListContainer").html("");
                    pageNum = 1;
                    getRoomList();
                    initInput();                    
                    $('#myModal').modal("hide");
                }else{
                    $TipsDialog({text:"Create Room Failed ! Try Again ?"});
                }
                $config.loading("hide");
            },
            error:function(err){
                console.log(err);
                $config.loading("hide");     
                $TipsDialog({text:"Create Room Failed ! Try Again ?"});           
            }
        })
    }

    getRoomList();
    $(".welcomeName").html(userInfo.username + "");
    if(!!userInfo.userAvatar){
        $("#headerAvatar").attr("src",nowLocale + userInfo.userAvatar).parent().addClass("active");
    }

    $(".closeRoomCreate").click(function(){
        initInput();
    });

    /**
     * @desc 删除房间
     */
    $(".roomListContainer").on("click",".deleteItem",function(event){
        var rid = $(event.currentTarget).data("i");
        var s = {
            roomId:rid,
            userId:userInfo.userId
        }
        $.ajax({
            url:"/delRoom",
            method:"POST",
            data:s,
            success:function(res){
                console.log(res);
                if(res.code == 1){
                    $TipsDialog({text:"Delete Room Success!"});
                    $(".roomListContainer").html("");
                    pageNum = 1;
                    getRoomList();
                }else{
                    if(res.code == 2){
                        $TipsDialog({text:"This room you have no auth to delete"});
                        return;
                    }
                    $TipsDialog({text:"Error"});
                }
            },
            error:function(err){
                $TipsDialog({text:"Error"});
                console.log(err);
            }
        })
    })

    /**
     * @desc 创建Room提交数据
     */
    $("#createRoomNow").click(function(){
        var o = {
            titleImgSrc:$("#roomAvatar").attr("src"),
            type:$("#roomAvatar").data("imgtype"),
            imgUse:0
        }
        $config.loading();
        $commonRequest.uploadImg(o,function(data){
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
        console.log(f);
        r.readAsDataURL(f);
        r.onload=function (e) {
            $("#roomAvatar").attr("src",this.result).data("imgtype",f.type).parent().addClass("active");
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
            $("#headerAvatar").attr("src",this.result).data("type",f.type).parent().addClass("active");
            // 上传图片
            var o = {
                titleImgSrc:$("#headerAvatar").attr("src"),
                type:f.type,
                imgUse:1
            }

            //上传图片到服务器
            $commonRequest.uploadImg(o,function(data){
                // $("#headerAvatar").attr("src",nowLocale + data);
                $("#headerAvatar").data("origin",data);
                //更新个人信息
                $commonRequest.updateUserInfo({
                    userId:userInfo.userId,
                    userAvatar:data
                },function(da){
                    $TipsDialog({text:"Success!"});
                    var _in = JSON.parse( $cookie.get("UIN") )
                    _in["userAvatar"] = data;
                    $cookie.set("UIN",JSON.stringify(_in));
                    // location.reload();
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
                $TipsDialog({text:"No More Data."});
                pageNum--;
                if(pageNum<=1){pageNum=1;}
            });
        },100);
    });
})()
