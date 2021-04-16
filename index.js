require("dotenv").config();
const express=require("express");
const formidable=require("formidable");
const fs=require("fs");
const app=express();
const cloudinary=require('cloudinary').v2
const mongoose=require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const notice = require("./models/notice");
const Photo = require("./models/photo");
const noticeRoute=require("./routes/notice")
const datesheetRoute=require("./routes/datesheet")
const syllabusRoute=require("./routes/syllabus")
const authRoute=require("./routes/auth")
const photoRoute=require("./routes/photo")
const PORT=3000;


//DB Connection
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false 
  })
  .then(() => {
    console.log("DB CONNECTED");
  });

  cloudinary.config({
    cloud_name: 'shaleel', 
    api_key: '344735224786678', 
    api_secret: '47-Nsacv7xr79-WT0I5_ajJpsAA' 
  })


//Middlewares
app.use(bodyParser.json({limit:'50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.use(cors());

//My Routes
//testing route only
app.use("/api",photoRoute)
////
app.use("/api",noticeRoute)
app.use("/api",syllabusRoute)
app.use("/api",datesheetRoute)
app.use("/api", authRoute)

app.get('/',(req,res)=>{
  return res.send('hello')
})
// starting a server
app.listen(process.env.PORT||8000,()=>{
    console.log("My First App");
});

