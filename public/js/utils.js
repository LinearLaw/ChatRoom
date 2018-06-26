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
    },
    //获取roomId
    getRoomId:function(){
        var url = location.href;
        var splited = url.split('/');
        var roomId = splited[splited.length - 1];
        return roomId;
    },
    getUserInfo:function(){
        if(!$cookie.get("UIN") ){
            location.href = $config.loginPage;
            return false;
        }
        return JSON.parse($cookie.get("UIN"));
    },
    getTime:function(time){
        var timeObj = time?new Date(time):new Date();
        var y = timeObj.getFullYear();
        var mo = timeObj.getMonth() + 1;
        var da = timeObj.getDate();
        var ho = timeObj.getHours();
        var mi = timeObj.getMinutes();
        var se = timeObj.getSeconds();

        var mon = mo>=10?mo:"0"+mo;
        var d = da>=10?da:"0"+da;
        var h = ho>=10?ho:"0"+ho;
        var m = mi>=10?mi:"0"+mi;
        var s = se>=10?se:"0"+se;
        var text =  y + "-" + mon + "-"+d+" "+ h + ":" + m + ":"+s
        return {
            timeObj:{y:y , m:m , d:d , h:h , mi:mi , s:s},
            timeText:text
        }
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
