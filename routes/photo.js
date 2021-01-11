const express = require("express")
const router = express.Router()
const {createPhoto,deletePhoto,getPhoto}=require("../controllers/photo")

//all of actual routes
router.post("/addPhoto",createPhoto)
router.get("/getPhoto/:photoId",getPhoto)
router.delete("/deletePhoto/:id",deletePhoto)
module.exports=router