const express = require("express")
const router = express.Router()
const {addNotice,getNotice,getAllNotice,deleteNotice,getUserNotice,updateNotice}=require("../controllers/notice")
const {isAllowed}=require("../controllers/user")

//all of actual routes
router.post("/addNotice",isAllowed,addNotice)
router.get("/getNotice/:department",getNotice)
router.get("/getAllNotice",getAllNotice)
router.get("/deleteNotice/:id",isAllowed,deleteNotice)
router.get("/userNotice/:userId",getUserNotice)
router.put("/updateNotice/:noticeId",isAllowed,updateNotice)
module.exports=router