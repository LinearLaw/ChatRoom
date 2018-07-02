(function(){


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
                type:f.type
            }
            //上传图片到服务器
            $commonRequest.uploadImg(o,function(data){
                $("#headerAvatar").attr("src",nowLocale + data);
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
        var pwd = $("#pwdInput").val().trim();
        var pwd_2 = $("#pwdInput_2").val().trim();
        if(!pwd || !pwd_2){
            $TipsDialog({text:"Please input password/confirm password."});
            return;
        }
        if(pwd != pwd_2){
            $TipsDialog({text:"Password should same with confirm password."});
            return;
        }

    });
    


})()