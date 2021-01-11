const mongoose= require("mongoose");
const { ObjectId } = mongoose.Schema;
const datesheetSchema=new mongoose.Schema({
    
        title: {
            type: String,
            trim: true,
            required: true,
            maxlength: 32,
            unique: true
        },
        course:{
            type:String,
            trim:true,
            required: true,
            maxlength: 32,
            unique: true
        },
        semester:{
            type:Number,
            required: true,
        },
        photos:[{ type: ObjectId,
                  ref: "Photo"}],

        createdBy:{
            type:ObjectId,
            ref:"User",
            required:true
        },
      
},
{ timestamps: true });

module.exports = mongoose.model("DateSheet", datesheetSchema);