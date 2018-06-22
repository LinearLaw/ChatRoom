const express = require("express");
const path = require("path");

let router = express.Router();

const userCtrl = require("../controller/userController.js");
const roomCtrl = require("../controller/roomController.js");

// Login router
router.post("/doLogin",userCtrl.doLogin);
router.post("/doRegist",userCtrl.doRegist);
router.get("/getAuth",userCtrl.getAuth);

//room Router
router.post("/exitRoom",roomCtrl.exitRoom);
router.post("/createRoom",roomCtrl.createRoom);
router.get("/getRoomList",roomCtrl.getRoomList);

//UI Router
// router.get("/room/:roomid",function(req,res){
//     var roomID = req.params.roomid;
//     var p = path.join(__dirname, "../public/html/list.html");
//     res.sendFile(p);
// });


module.exports = router;
