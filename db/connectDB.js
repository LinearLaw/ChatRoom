/*exports.connectDB = (mongoose) => { 

   let db = mongoose.connect("mongodb://127.0.0.1:27017/xh_meeting",(err)=>{
      if(err){
        console.log("数据库连接失败！");
      }else{
         console.log("数据库连接成功！");
      }
   });
   
};

*/
exports.connectDB = (mongoose) => { 

   let db = mongoose.connect("mongodb\://xhmeeting\:123456@20.97.6.66\:6001/xh_meeting",(err)=>{
      if(err){
        console.log("数据库连接失败！");
      }else{
         console.log("数据库连接成功！");
      }
   });

};

