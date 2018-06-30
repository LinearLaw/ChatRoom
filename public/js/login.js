 (function(window){
    var reg = {
        a:/^[A-Za-z0-9]{6,16}$/,
        p:/^[A-Za-z0-9]{6,16}$/
    };

    function initInput(){
        $("#login_field").val("");
        $("#password").val("");
        $("#signup_field").val("");
        $("#signup_a").val("");
        $("#signup_p").val("");
        $("#signup_pr").val("");
    }

    function errorMsgHide(){
        $("#js-flash-container").hide();
        $("#js-flash-container_2").hide();
    }
    /**
     * @desc 登录
     */
    function login(){
        var a = $("#login_field").val();
        var p = $("#password").val();
        if(!a || !p){
            $("#js-flash-container").show();
            $TipsDialog({text:"Account and password must fill in."});
            return;
        }
        if(!reg.a.test(a)||!reg.p.test(p)){
            $("#js-flash-container").show();
            $TipsDialog({
                timeout: 2000,
                text:"Account or password format error.6-16 words,</br> accept uppercase/lowercase letters and numbers"
            });
            return;
        }
        var s = {
            userAccount:a,
            pwd:p
        }
        $.ajax({
            url:"/doLogin",
            method:"POST",
            data:s,
            success:function(res){
                console.log("success",res);
                if(res.code == 1){
                    $TipsDialog({text:"Login Success!"});
                    $cookie.set("UIN",JSON.stringify(res.data));
                    location.href = "/html/list.html";
                }else{
                    if(res.code == 2){
                        $TipsDialog({text:"Account not exist."});return;
                    }
                    if(res.code == 3){
                        $TipsDialog({text:"Account or password error."});return;
                    }
                    $TipsDialog({text:"Interval Server Error."});
                }
            },
            error:function(err){
                console.log(err);
                $TipsDialog({text:"Interval Server Error."});
            }
        })
    }

    //登录按钮
    $(".submit-btn").click(function(){
        login();
    })

    //回车，登录
    $(document).keyup(function(event){
        if(!$(".signUpBox").hasClass("active")){
            switch(event.keyCode) {
                case 13:
                    login();
                    return;
            }
        }
    })

    //关闭登录的错误提示框
    $(".close-msg").click(function(){
        errorMsgHide();
    })
    //关闭注册的错误提示框
    $(".signup-msg").click(function(){
        errorMsgHide();
    })
    //关闭注册弹框
    $(".close-signup").click(function(){
        initInput();
        errorMsgHide();
        $(".signUpBox").removeClass("active");
        $(".signUpBox").css("opacity",0);
        setTimeout(function(){
            $(".signUpBox").hide();
            $(".signUpBox").css({
                "opacity":1
            });
        },300)
    })

    //弹出注册框
    $(".sign-up-pop").click(function(){
        initInput();
        $(".signUpBox").show();
        $(".signUpBox").addClass("active");
        $(".signUpBox").css({
            "animation":"action_skew 0.3s linear",
        })
    })

    //注册按钮
    $(".signup-btn").click(function(){
        var n = $("#signup_field").val();
        var a = $("#signup_a").val();
        var p = $("#signup_p").val();
        var rp = $("#signup_pr").val();
        if(!a || !p || !n || !rp){
            $("#js-flash-container_2").show();
            $TipsDialog({
                text:"Account/password/confirm password</br>All must fill in."
            });
            return;
        }
        if(!reg.a.test(a)||!reg.p.test(p) || !reg.p.test(rp)){
            $("#js-flash-container_2").show();
            $TipsDialog({
                timeout: 2000,
                text:"Account or password format error.6-16 words,</br> accept uppercase/lowercase letters and numbers"
            });
            return;
        }
        if(rp!=p){
            $("#js-flash-container_2").show();
            $TipsDialog({
                text:"The password entered twice is inconsistent"
            });
            return;
        }
        var s = {
            username:n,
            userAccount:a,
            pwd:p
        }
        $.ajax({
            url:"/doRegist",
            method:"POST",
            data:s,
            success:function(res){
                $(".signUpBox").hide();
                $(".signUpBox").removeClass("active");
                console.log(res);
                if(res.code == 1){
                    $TipsDialog({text:"Success regist ! Use your account to login now !"});
                }else{
                    if(res.code == 2){
                        $TipsDialog({text:"Account already exist."});return;
                    }
                    if(res.code == 3){
                        $TipsDialog({text:"Account or password error."});return;
                    }
                    $TipsDialog({text:"Interval Server Error."});
                }
            },
            error:function(err){
                console.log(err);
                $TipsDialog({text:"Interval Server Error."});
            }
        })
    })

})(window);
