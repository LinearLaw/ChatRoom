exports.userData = (mongoose) => { 
    
    //创建会议
	let beginMeetingSchema = new mongoose.Schema({
		userName: {type:String},
	    titleImgSrc : {type:String},
	    meetingTitle: {type:String},
	    meetingTime: {type:String},
        meetingContent: {type:String},
        joinPeople: {type:String}
	});

    global.beginMeeting = mongoose.model("beginMeeting",beginMeetingSchema);

    //评论
    let commentSchema = new mongoose.Schema({	 
	    userName: {type:String},
	    inputVal: {type:String}
	});

	global.comment = mongoose.model("comment",commentSchema);


	//删除会议
	let meetingSchema = new mongoose.Schema({
	    meetingRoom : {type:String,require:true}
	});

    global.meeting = mongoose.model("meeting",meetingSchema);


    //存储parentId
    let parentIdSchema = new mongoose.Schema({
		parentId: {type:String},
		userName: {type:String},
		userId: {type:String}
	});

    global.parentIdCreate = mongoose.model("parentId",parentIdSchema);

}