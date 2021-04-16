const mongoose = require("mongoose");

const photoSchema = new mongoose.Schema(
  {
    
    img: {
      type:String 
    },
  },
  { timestamps: true }
);

photoSchema.virtual('path').get(function (){
  if(this.img != null ){
      return `data:image/jpeg;charset=utf-8;base64,${this.img.toString('base64')}`;
  }
})

module.exports = mongoose.model("Photo", photoSchema);