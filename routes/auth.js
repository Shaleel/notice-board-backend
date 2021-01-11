const express = require("express")
const router = express.Router()
const{signup,login,isAllowed,isAdmin,signout,deleteUser,updateUser}=require("../controllers/user")

//all of actual routes
router.post('/signup',isAllowed,isAdmin,signup)
router.post('/login',login)
router.get('/signout',signout)
router.delete('/deleteUser/:userId',isAllowed,isAdmin,deleteUser)
router.put('/updateUser',isAllowed,isAdmin,updateUser)
module.exports=router