const express = require("express");
const app = express();

const http = require("http").Server(app);
global.io = require("socket.io")(http);

const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const session = require("express-session");


//multer , 上传文件的中间件
const multer = require('multer');
//cors，跨域资源的中间件
const cors = require('cors');

//router
const router = require("./router/router.js");

//配置文件
global.config = require("./config/config.js");

global.session = require('express-session');
const cookieParser = require('cookie-parser');
global.request = require('request');
global.fs = require('fs');
global.path = require('path');

app.use(session(config.session));
//路由过滤
// app.use((req, res, next)=>{
//   if(req.path=="/html/index.html"){
//     res.send({ msg:"Error" });
//   }else{
//     next();
//   };
// });

//中间件挂载
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ limit: '50mb',extended: true }));
app.use(multer());
app.use(cors());

//挂载路由模块
app.use('/', router);

//socket服务推送
let apiSocket = require("./controller/socketController.js");
io.on("connection",function(socket){
    apiSocket.apiSocket(socket);
});

//监听服务
http.listen(9000,()=>{
    console.log("端口号9000，服务已就绪。");
})
