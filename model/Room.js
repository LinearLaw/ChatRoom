const mongoose = require("mongoose");

const db = require("./db.js");

const roomSchema = new mongoose.Schema({
    "roomId":{type:String},
    "roomName":{type:String},
    "roomDesc":{type:String},
    "roomAvatar":{type:String},
    "userId":{type:String},
    "status":{type:String}, //open close
    "createTime":{type:Number},
    "exitTime":{type:Number}, // default 0
    "join":[{
        userId:{type:String},
        username:{type:String},
        userAvatar:{type:String} //预留
    }]
});

const Room = mongoose.model("roomModel",roomSchema);
module.exports = Room;
