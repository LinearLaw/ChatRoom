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

var $commonRequest = {
    //获取授权
    getAuth:function(callback){
        $.ajax({
            url:"/getAuth", method:"GET",
            success:function(res){/* console.log(res);*/if(res.code == 1){  }else{callback();}},
            error:function(err){  console.log(err); }
        })
    },
    //上传图片
    uploadImg:function(obj,cb){
        if(obj.imgUse != 1){
            obj.imgUse = 0;
        }
        $.ajax({
            url:'/uploadPic?userId='+userInfo.userId, method:'post',
            data:{ titleImgSrc:obj.titleImgSrc , type:obj.type , imgUse:obj.imgUse },
            success:function(res){
                if(res.code == 1){
                    cb(res.data);
                }else{
                    console.log("error");
                    $config.loading("hide");
                }
            },
            error:function(){  console.log("error");$config.loading("hide");}
        })
    },
    //更新个人信息
    updateUserInfo:function(info,cb){
        $.ajax({
            url:'/changeUserInfo', method:'post',
            data:info,
            success:function(res){
                if(res.code == 1){
                    cb(res.data);
                }else{
                    console.log("error");
                }
            },
            error:function(){  console.log("error");  }
        })
    }
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
        var splited = location.href.split('/');
        var roomId = splited[splited.length - 1];
        return roomId;
    },
    //从cookie中取用户信息
    getUserInfo:function(){
        if(!$cookie.get("UIN") ){
            if(location.href.indexOf($config.loginPage)!=-1){
                return;
            }else{
                location.href = $config.loginPage;
                return;
            }
        }
        return JSON.parse($cookie.get("UIN"));
    },
    //传入时间戳，生成时间字符串
    getTime:function(time){
        var timeObj=time?new Date(time):new Date();var y=timeObj.getFullYear();var mo=timeObj.getMonth()+1;var da=timeObj.getDate();var ho=timeObj.getHours();var mi=timeObj.getMinutes();var se=timeObj.getSeconds();
        var o = {y:y ,m:mo>=10?mo:"0"+mo ,d:da>=10?da:"0"+da ,h:ho>=10?ho:"0"+ho ,mi:mi>=10?mi:"0"+mi ,s:se>=10?se:"0"+se };
        var text =  y + "-" + o.m + "-"+o.d+" "+ o.h + ":" + o.mi + ":"+o.s;
        return {
            timeObj:o,
            timeText:text
        }
    },
    /**
     * @desc loading封装，需要多引入一个common.css
     *      用法  loading()和loading("show")都是显示
     *          loading("hide")是隐藏
     */
    loading:function(str){
        var tpl = ' <div class="loadingShadow" style="display:none;"><div class="shadow"></div><div class="loadingBox"><p class="glyphicon glyphicon-refresh"></p><p class="loadingText">Loading...</p></div></div>';
        if($(".loadingShadow").length<=0){
            $("body").append(tpl);
        };
        if(!str){
            $(".loadingShadow").show();
        }else if(str == "show"){
            $(".loadingShadow").show();
        }else{
            $(".loadingShadow").hide();
        }
    }
}
// 提示信息 ， $TipsDialog({text:"",timeout:1500,opacity:0.8});
;(function($, window, undefined){
    var doc = $(document),
        style = document.createElement('style');
    var TipsDialog = function(params){this.settings = $.extend(TipsDialog.defaults, params || {});this._init();};
    TipsDialog.prototype = {
        _init: function(){this._create();},
        _create: function(){this.tipsDialogDom =`<div class="TipsMongo"><div class="tipsContent">${this.settings.text}</div></div>`;this._show();},
        _show: function(){$('body').append($(this.tipsDialogDom));doc.find('.TipsMongo').css({'position': 'fixed','top'    : '0','left'   : '0','bottom' : '0','right'  : '0','z-index': '9999'});doc.find('.TipsMongo .tipsContent').css({'color': 'white','font-size': '15px','padding': '0.5rem 1rem','position': 'absolute','top': '50%','left': '50%','text-align':'center','background-color': `rgba(0, 0, 0, ${this.settings.opacity})`,'border-radius': '10px','transform': 'translateX(-50%) translateY(-50%)'});style.type = 'text/css';style.innerHTML = '';document.getElementsByTagName('head')[0].appendChild(style);var animationDesc = style.innerHTML + '@-webkit-keyframes aniShow { from {opacity: 0;} to {opacity: 1;}';document.styleSheets[document.styleSheets.length-1].insertRule( animationDesc , document.styleSheets[document.styleSheets.length-1].rules.length);doc.find('.TipsMongo .tipsContent').css('animationName', 'aniShow');doc.find('.TipsMongo .tipsContent').css('animationDuration', 1 + 's');doc.find('.TipsMongo .tipsContent').css('animationFillMode', 'forwards');var that = this;setTimeout(function(){that._close();}, this.settings.timeout);},
        _close: function(){doc.find('.TipsMongo').remove();}
    };
    TipsDialog.defaults = {timeout: 1500,text: '我是tips',opacity: 0.8};
    var tipsDialog = function(options) {return new TipsDialog(options);}
    window.$TipsDialog = $.tipsDialog = $.tipsDialog = tipsDialog;
})(window.jQuery , window);


//验证

var userInfo = $config.getUserInfo();
var nowLocale = $url('protocol',location.href)+"://"+$url('hostname',location.href)+":"+$url('port',location.href);
