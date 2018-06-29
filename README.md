#   Chat Area

    Chat Room ，聊天室。
    NodeJS + socket.io + express + mongoose + jQuery

##  功能

    1、登录注册
    2、创建聊天房间
    3、聊天房间，互传消息。

##  启动项目

    windows下：前提需要安装mongodb和nodeJS，并写入系统环境变量
        启动数据库
            Start_MongoDB.bat，双击打开，并将黑窗挂起；

        安装依赖
            npm i

        启动服务
            node app.js

    linux下：前提需要安装nodejs和mongodb，并挂起mongodb service
        安装依赖
            npm i

        sh文件获取权限
            chmod u+x start.sh

        启动服务
            sudo ./start.sh

    当前设置端口号9000

##  socket.io

    socket.io有两种方式，单socket和多socket，
    在多socket的模式下，需要制定房间的roomId，将消息推送到指定的roomId内。

    （1）、单socket方式io推送
        io.emit('userConnect', {
            userCount:count,
            info:"用户 " + info.userName + " 加入了房间"
        });

        Tips：所有创建的socket都会收到这条消息。

    （2）、多socket方式io推送
        let ri = roomId;
        io.to(ri).emit('userConnect', {
            userCount:count,
            info:"用户 " + info.username + " 加入了房间"
        });

        Tips：消息将会推送到指定的roomId所在的房间内，其他房间不会接受消息。

##  登录注册

    （1）、注册时，密码使用md5多层加密存储到数据库；

    （2）、登录时，使用express-session作为中间件，对来源的request添加session标识，
        往req.session中加入key和对应value，每次前端请求将会带上这些内容。
        前端表现在以加密方式存储了一个cookie，每次请求前端都会带上cookie，cookie的内容是加密的，
        后端可以读取里面的内容，前端无法获取。

        Tips：这种方式需要在同域条件下进行，跨域下需要配置cookie的domain，将IP地址写为静态IP，
        否则，cookie将变得无法获取。
        Tips：若后端配置反向代理，则不需要配置cookie的domain，可用。

##  普通业务（GET & POST）

    (1)、get
        get请求的数据直接使用req.query即可访问。

    (2)、post
        post参数在这里使用了body-parser作为中间件。
        req.body可以访问到请求的数据。

        Tips：在Chat Room处理上传文件时，采用的依然是body-parser，
        这是因为前端使用了fileReader将图片文件处理成base64格式的字符串数据，
        字符串数据直接在req.body中带到后端，node使用fs进行写出，并向前端暴露url。

    (3)、不同的content-type的处理

        application/x-www-form-urlencoded ：form格式的数据
        multipart/form-data ：带有二进制数据和json数据
        application/json ：json数据
        text/xml ：xml格式的数据

        1、body-parser
            body-parser用来处理form和json格式的数据。
            如果数据中带有二进制数据，body-parser无法处理

        2、multer
            multer专门用来处理 [ 带有二进制数据和json数据 ] 的数据
            即 content-type = multipart/form-data

        3、formidable
            formidable既可以处理form和json格式的数据，也可以处理带有文件的数据。
            也就是说，formidable兼具了body-parser和multer的功能。
