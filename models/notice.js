const mongoose= require("mongoose");
const {ObjectId}=mongoose.Schema;
const noticeSchema=new mongoose.Schema({
    
        title: {
            type: String,
            trim: true,
            required: true,
            maxlength: 32,
            unique: true
        },
        department:{
            type:String,
            trim:true,
            required: true,
            maxlength: 32,
            unique: true
        },
        date:{
            type:Date,
            required:true
        },
        photos:[{type: String }],
        createdBy:{
            type:ObjectId,
            ref:"User",
            required:true
        },
},
{ timestamps: true });

module.exports = mongoose.model("Notice", noticeSchema);