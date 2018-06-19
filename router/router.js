const express = require("express");
const path = require("path");

let router = express.Router();

//Router
router.get("/room/:roomid",function(req,res){
  var roomID = req.params.roomid;
  var p = path.join(__dirname, "../public/html/chatRoom.html")
  res.sendFile(p);
});



module.exports = router;
