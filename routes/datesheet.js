const express = require("express")
const router = express.Router()
const {addDatesheet,getAllDatesheet,getDatesheet,deleteDatesheet,getUserDatesheet,updateDatesheet}=require("../controllers/datesheet")
const {isAllowed,getUserById}=require("../controllers/user")


//router params
router.param("userId",getUserById)

//all of actual routes
router.post('/addDatesheet',isAllowed,addDatesheet)
router.get("/getAllDatesheet",getAllDatesheet)
router.get("/getDatesheet/:course/:semester",getDatesheet)
router.delete("/deleteDatesheet/:id",isAllowed ,deleteDatesheet)
router.get("/userDatesheet/:userId",getUserDatesheet)
router.put("/updateDatesheet/:datesheetId" ,isAllowed, updateDatesheet)
module.exports=router