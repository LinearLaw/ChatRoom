(function(){
    $commonRequest.getAuth(function(){
        location.href = $config.loginPage;
        return;
    })

    if(userInfo.userAvatar){
        $("#headerAvatar").attr("src",nowLocale + userInfo.userAvatar);
        $("#headerAvatar").data("origin",userInfo.userAvatar).parent().addClass("active");
    }
    if(userInfo.username){
        $("#nickName").val(userInfo.username);
    }

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
                    userAvatar:data,
                },function(da){
                    $TipsDialog({text:"Success!"});
                    var _in = JSON.parse( $cookie.get("UIN") )
                    _in["userAvatar"] = data;
                    $cookie.set("UIN",JSON.stringify(_in));
                })
            });
        };
    });


    /**
     * @desc 更改用户昵称
     */
    $(".updateAccount").click(function(){
        var username = $("#nickName").val().trim();
        if(!username){
            $TipsDialog({text:"Please input nick name."});
            return;
        }
        $commonRequest.updateUserInfo({
            userId:userInfo.userId,
            username:username
        },function(da){
            $TipsDialog({text:"Success!"});
            var _in = JSON.parse( $cookie.get("UIN") )
            _in["username"] = username;
            $cookie.set("UIN",JSON.stringify(_in));
        })
    });

    /**
     * @desc 更改密码
     */
    $(".updatePwd").click(function(){
        var curP = $("#pwdInput").val().trim();
        var newP = $("#newInput").val().trim();
        var newP_2 = $("#newInput_2").val().trim();
        if(!curP || !newP || !newP_2){
            $TipsDialog({text:"Please input password/confirm password."});
            return;
        }
        if(newP != newP_2){
            $TipsDialog({text:"Password should same with confirm password."});
            return;
        }
        var s = {
            cp:curP,
            np:newP,
            userId:userInfo.userId
        }
        $.ajax({
            url:"/changePwd",
            method:"POST",
            data:s,
            success:function(res){
                // console.log(res);
                if(res.code == 1){
                    $TipsDialog({text:"Success."});
                }else{
                    $TipsDialog({text:"Error."});
                }
            },
            error:function(err){
                $TipsDialog({text:"Interval Server Error."});
            }
        })
    });
    


})()