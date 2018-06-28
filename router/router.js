const express = require("express");
const path = require("path");

let router = express.Router();

const userCtrl = require("../controller/userController.js");
const roomCtrl = require("../controller/roomController.js");
const cmtCtrl = require("../controller/commentController.js");
const fileCtrl = require("../controller/fileController.js");

// Login router
router.get("/getAuth",userCtrl.getAuth);
router.post("/doLogin",userCtrl.doLogin);
router.post("/doRegist",userCtrl.doRegist);


//room Router
router.get("/getRoomList",roomCtrl.getRoomList);
router.get("/getRoomInfo",roomCtrl.getRoomInfo);
router.post("/exitRoom",roomCtrl.exitRoom);
router.post("/createRoom",roomCtrl.createRoom);


//comment router
router.get("/getCommentList",cmtCtrl.getCommentList);
router.post("/reportComment",cmtCtrl.reportComment);
router.post("/deleteComment",cmtCtrl.deleteComment);


//file Router
router.post("/uploadPic",fileCtrl.uploadPic);


//UI Router
router.get("/room/:roomid",function(req,res){
    var roomID = req.params.roomid;
    var p = path.join(__dirname, "../public/html/index.html");
    res.sendFile(p);
});



module.exports = router;
