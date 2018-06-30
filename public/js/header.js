/**
 * @desc 公共的header方法
 */
(function(){
    //退出登录
    $("#logOutBtn").click(function(){
        $cookie.del("SID");
        $cookie.del("UIN");
        $("#logOutModal").modal("hide");
        location.reload();
    });

    

})()
