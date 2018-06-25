const mongoose = require("mongoose");

const db = require("./db.js");

const roomStatusSchema = new mongoose.Schema({
    "roomId":{type:String},
    "join":[{
        userId:{type:String}
    }]
})

const RoomStatus = mongoose.model("roomStatusModel",roomStatusSchema);
module.exports = RoomStatus;
