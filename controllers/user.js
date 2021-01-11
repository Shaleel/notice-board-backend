const User=require("../models/user");
const jwt=require("jsonwebtoken")
const formidable= require("formidable")
const jwt_decode=require("jwt-decode")
const bcrypt=require("bcrypt")
const expressJwt = require("express-jwt");

exports.getUserById=(req,res,next,id)=>{
    User.findById(id).exec((err,user)=>{
        if(err|| !user){
            return res.status(400).json({
                error:"NO user was found in BD"
            })
        }
        req.profile = user
        next()
    })
 }

exports.signup= async (req,res)=>{
    const hashedPassword= await bcrypt.hash(req.body.password, 10)
    const user=new User({name:req.body.name,password:hashedPassword,isAdmin:req.body.isAdmin});
    
     user.save((err,user)=>{
        if(err)
        return res.status(400).json({
            message:"Error saving in db"
        })
        return res.send(user)
     })
     
}

exports.login=(req,res)=>{
    User.findOne({name:req.body.name},async (err,user)=>{
        if (err || !user) {
            return res.status(400).json({
              error: "USER does not exists"
            });
          }
     
        if(await bcrypt.compare(req.body.password, user.password)) {
            const token=jwt.sign({
                name:user.name,
                _id:user._id,
                isAdmin:user.isAdmin
            },
            process.env.SECRET)
            
            //saving in cookie
            res.cookie("token", token, { expire: new Date() + 9999 });

            const {name}=user;
            return res.json({
                token,user:{name}
            })
        }
        else 
            res.send('Not Allowed')
          
    })
  
}
exports.isAdmin=(req,res,next)=>{
    const token=req.headers.authorization.split(' ')[1]
    const decoded=jwt_decode(token);
    if(decoded.isAdmin)
        next()
    else return res.json({
        message:"You are not Admin"
    })
}

exports.isAllowed=(req,res,next)=>{
    
    if(req.headers.authorization){
        const header=req.headers.authorization.split(' ')
        //header consist of jwt token after " "
        if(header.length>1&&jwt.verify(header[1],process.env.SECRET))
            next()
    }
    else return res.json({message:"Not Allowed"})
    
}
exports.signout = (req, res) => {

    res.clearCookie("token")
    res.json({
      message: "User signout"
    });
  };

exports.deleteUser=(req,res)=>{
    User.deleteOne({_id:req.params.userId}).exec((err,user)=>{
        if(err)
            return res.status(400).json({
                message:"Unable to delete User"
            })
            return res.status(200).json({
                message:"User deleted Successfully"
            })
    })
}
exports.updateUser=async (req,res)=>{
    const hashedPassword= await bcrypt.hash(req.body.password, 10)
    User.findByIdAndUpdate({_id:req.body.userId},{$set:
    {
        name:req.body.name,
        password:hashedPassword
    }}).exec((err,user)=>{
        if(err)
            return res.status(400).json({
                message:"Unable to update User"
            })
        return res.status(200).json({
            message:"User updated Successfully"
        })
    })
}
