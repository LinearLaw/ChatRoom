const express = require("express");
const app = express();
const http = require("http").Server(app);
global.io = require("socket.io")(http);

const mongoose = require("mongoose");
const bodyParser = require('body-parser');

//multer , 上传文件的中间件
const multer = require('multer');
//cors，跨域资源的中间件
const cors = require('cors');

global.session = require('express-session');
const cookieParser = require('cookie-parser');
global.request = require('request');
global.fs = require('fs');
global.path = require('path');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ limit: '50mb',extended: true }));

app.use(multer());
app.use(cors());

//连接数据库
// let connectDB = require("./db/connectDB.js");
// connectDB.connectDB(mongoose);

// //创建表
// let userData = require("./db/userData.js");
// userData.userData(mongoose);

//推送
let apiSocket = require("./api/apiSocket.js");

io.on("connection",function(socket){
    apiSocket.apiSocket(socket);
    let count = io.eio.clientsCount;
    io.emit("userConnect",{
        userCount:count
    })
});


http.listen(9000,()=>{
    console.log("端口号9000，服务已就绪。");
})
