require("dotenv").config();
const express=require("express");
const formidable=require("formidable");
const fs=require("fs");
const app=express();
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


//Middlewares
app.use(bodyParser.json());
app.use(cors());

//My Routes
//testing route only
app.use("/api",photoRoute)
////
app.use("/api",noticeRoute)
app.use("/api",syllabusRoute)
app.use("/api",datesheetRoute)
app.use("/api", authRoute)


// starting a server
app.listen(process.env.PORT||8000,()=>{
    console.log("My First App");
});

