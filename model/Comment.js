const mongoose = require("mongoose");

const db = require("./db.js");

const commentSchema = new mongoose.Schema({
    userId:{type:String},
    username:{type:String},
    userAvatar:{type:String},
    roomId:{type:String},
    commentId:{type:String},
    content:{type:String},
    createTime:{type:Number},
})

const Comment = mongoose.model("commentModel",commentSchema);
module.exports = Comment;
