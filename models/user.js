const mongoose= require("mongoose");

const userSchema=new mongoose.Schema({
    name:{
        type: String,
        required: true,
        maxlength: 32,
        trim: true
    },
    password:{
        type: String,
        required: true
    },
    isAdmin:{
        type:Boolean
    }

},
{timestamps:true});



module.exports = mongoose.model("User", userSchema);