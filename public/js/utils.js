var $cookie = {
    get: function(n) {
        var m = document.cookie.match(new RegExp("(^| )" + n + "=([^;]*)(;|$)"));
        return !m ? "" : decodeURIComponent(m[2])
    },
    set: function(name, value, hour, domain, path) {
        var expire = new Date();
        expire.setTime(expire.getTime() + (hour ? 3600000 * hour : 30 * 24 * 60 * 60 * 1000));
        document.cookie = name + "=" + value + "; expires=" + expire.toGMTString() + "; path=" + (path ? path : "/") + "; " + (domain ? ("domain=" + domain + ";") : "")
    },
    del: function(name, domain, path) {
        document.cookie = name + "=; expires=Mon, 26 Jul 1997 05:00:00 GMT; path=" + (path ? path : "/") + "; " + (domain ? ("domain=" + domain + ";") : "")
    }
};

var $getAuth = function(callback){
    $.ajax({
        url:"/getAuth",
        method:"GET",
        success:function(res){
            console.log(res);
            if(res.code == 1){

            }else{
                callback();
            }
        },
        error:function(err){
            console.log(err);
        }
    })
}

var $config = {
    loginPage:"/html/login.html",
    //获取url的参数
    GetQueryString:function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);return null;
    }
}

var toast = function(msg){
    setTimeout(function(){
        document.getElementsByClassName('toast-wrap')[0].getElementsByClassName('toast-msg')[0].innerHTML=msg;
        var toastTag = document.getElementsByClassName('toast-wrap')[0];
        toastTag.className = toastTag.className.replace('toastAnimate','');
        setTimeout(function(){
            toastTag.className = toastTag.className + ' toastAnimate';
            setTimeout(function(){
                toastTag.className = toastTag.className.replace('toastAnimate','');
            },2000)
        }, 100);
    },500);
}
