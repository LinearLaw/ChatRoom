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
        // var url = "/getRoomList?pageNum="+pageNum+"&pageSize="+pageSize+"&userId="+userInfo.userId;
        $.ajax({
            url:"/getRoomList",
            method:"GET",
            data:a,
            success:function(res){
                console.log(res);
                if(res.code == 1){
                    var g = res;
                    g.data.map(function(item,index){
                        g.data[index]["timeText"] = $config.getTime(item.createTime).timeText;
                        g.data[index]["originAvatar"] = nowLocale + g.data[index]["originAvatar"];
                    });
                    var h = template("roomList",g);
                    $(".roomListContainer").append(h);
                    // if(scb){scb();}
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
    function uploadImg(cb){
        var titleImgSrc = $("#roomAvatar").attr("src");
        $.ajax({
            url:'/uploadPic?userId='+userInfo.userId,
            method:'post',
            data:{
                titleImgSrc:titleImgSrc
            },
            success:function(res){
                console.log(res);
                if(res.code == 1){
                    $("#roomAvatar").attr("src",nowLocale + res.data);
                    $("#roomAvatar").data("origin",res.data);
                    cb();
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
                    alert("Create Room Success!");
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

    /**
     * @desc 创建Room提交数据
     */
    $("#createRoomNow").click(function(){
        uploadImg(function(){
            createRoom();
        })
    });

    //上传图片
    $("#avatarInput").on("change",function(){
        var r= new FileReader();
        f=$('#avatarInput')[0].files[0];
        console.log(f);
        r.readAsDataURL(f);
        r.onload=function (e) {
            $("#roomAvatar").attr("src",this.result);
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

    $("#logOutBtn").click(function(){
        $cookie.del("SID");
        $cookie.del("UIN");
        $("#logOutModal").modal("hide");
        location.reload();
    })

})()
