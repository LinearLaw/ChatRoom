(function(){
    $getAuth(function(){
        location.href = $config.loginPage;
        return;
    })
    var userInfo = $config.getUserInfo();
    var pageSize = 10;
    var pageNum = 1;

    function roomListItemModel(o){

        var h = '<div class="roomListItem">'+
            '<div class="media">'+
                '<div class="media-left">'+
                    '<a href="/room/'+o.roomId+'">'+
                      '<img class="media-object" src="../img/yll.jpg" alt="...">'+
                    '</a>'+
                '</div>'+
                '<div class="media-body">'+
                    '<h4 class="media-heading">'+o.roomName+'</h4>'+
                    '<p>'+o.roomDesc+'</p>'+
                '</div>'+
            '</div>'+
        '</div>'
        return h;
    }
    /*
     * @desc 获取room list
     */
    function getRoomList(){
        var a = {
            pageNum:pageNum ,
            pageSize:pageSize ,
            userId:userInfo.userId
        }
        var url = "/getRoomList?pageNum="+pageNum+"&pageSize="+pageSize+"&userId="+userInfo.userId;
        $.ajax({
            url:"/getRoomList",
            method:"GET",
            data:a,
            success:function(res){
                console.log(res);
                if(res.code == 1){
                    var g = res.data;
                    var h = "";
                    g.map(function(item,index){
                        h = h + roomListItemModel(item);
                    })
                    $(".roomListContainer").html(h);
                }else{

                }
            },
            error:function(err){
                console.log(err);
            }
        })
    }

    /**
     * @desc 创建room
     */
    function createRoom(){
        var roomName = $("#romeName").val().trim();
        var roomDesc = $("#roomDesc").val().trim();
        var roomAvatar = $("#roomAvatar").attr("src");
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
                    $('#myModal').modal();
                }else{

                }
            },
            error:function(err){
                console.log(err);
            }
        })
    }
    getRoomList();
    $("#createRoomNow").click(function(){
        createRoom();
    })


})()
