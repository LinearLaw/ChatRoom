(function(){
    $getAuth(function(){
        location.href = $config.loginPage;
        return;
    })
    var userInfo = $config.getUserInfo();
    var pageSize = 10;
    var pageNum = 1;

    function roomListItemModel(o){
        var h = `<div class="roomListItem">
            <div class="media">
                <div class="media-left">
                    <a href="#">
                      <img class="media-object" src="../img/yll.jpg" alt="...">
                    </a>
                </div>
                <div class="media-body">
                    <h4 class="media-heading">Room Title</h4>
                    <p>Room description.Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.</p>
                </div>
            </div>
        </div>`
        return h;
    }
    /*
     * @desc 获取room list
     */
    function getRoomList(){
        var a = {
            pageNum:pageSize ,
            pageSize:pageNum ,
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

    $("#createRoomNow").click(function(){
        createRoom();
    })


})()
