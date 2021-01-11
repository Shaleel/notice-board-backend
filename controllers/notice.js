const express = require("express")
const Photo = require("../models/photo")
const formidable= require("formidable")
const Notice = require("../models/notice")
const fs = require("fs")
const jwt_decode=require("jwt-decode")

exports.addNotice=(req,res)=>{

    const form = new formidable.IncomingForm()
    form.multiples=true;
    form.keepExtensions=true
    form.parse(req, (err, fields, files) => {
        if (err) {
          next(err);
          return;
        }
        const {title,department,date}=fields

        const notice= new Notice(fields)
        notice.date=new Date(date)

        //saving user reference
        const token=req.headers.authorization.split(' ')[1]
        const decoded=jwt_decode(token);
        notice.createdBy=decoded._id


        let arr=[]
        for(let i=0;i<files.photos.length;i++){
            let photo=new Photo()
            if(files.photos[i]){
                photo.img=fs.readFileSync(files.photos[i].path);
                photo.img.contentType=files.photos[i].type
              }
      
              photo.save((err,photo)=>{
                if(err){
                    return res.status(400).json({
                        error:"Saving tshirt in DB failed"
                    })
                }
            })
            arr.push(photo.id)
        }
        notice.photos=arr;
        notice.save((err,notice)=>{
            if(err){
                return res.status(400).json({
                    error:"Saving in DB failed"
                })
            }
            res.json(notice)
        })

      });
     
}

exports.getNotice=(req,res)=>{
    Notice.find({department:req.params.department}).sort({createdAt:-1})
    .exec((err,notices)=>{
        if(err){
            return res.json({
                error:"Error"
            })
        }

        return res.send(notices)
    })

    
}

exports.getAllNotice=(req,res)=>{
    Notice.find({}).sort({createdAt:-1}).then(notice=>{
        let photoArr=[]
        for(let i=0;i<notice.photos.length;i++){
           Photo.findOne({_id:notice.photos[i]}).exec((err,photo)=>{
               if(err)
                return res.json({
                    message:"Unable to find Notice"
                })
                photoArr.push(photo.img)
           }) 
        }
        notice.photos=photoArr
        return res.send(notice) 
    })
}

exports.deleteNotice=(req,res)=>{
    const id=req.params.id;
    const token=req.headers.authorization.split(' ')[1]
    const decoded=jwt_decode(token);
    if(id===decoded.createdBy){

            Notice.deleteOne({_id:id},(err)=>{
                if(err)
                    return res.send("Cannot delete")
                return res.json({
                    message:"Seccesfull deletion"
                })
            })
    }
    else return res.send("You are not allowed to delete")
}
exports.getUserNotice=(req,res)=>{
    Notice.find({createdBy:req.params.userId}).exec((err,notice)=>{
        if(err){
            return res.status(400).json({
                message:"Unable to find any datesheet"
            })

        }
        return res.send(notice)
    })
}
exports.updateNotice=(req,res)=>{
    
    Notice.findById({_id:req.params.noticeId}).exec((err,notice)=>{
        if(err)
            return res.status(400).json({
                message:"Unable to update Notice"
        })
        for(let i=0;i<notice.photos.length;i++){
            Photo.deleteOne({_id:notice.photos[i]});
        }
    })

    const form = new formidable.IncomingForm()
    form.multiples=true;
    form.keepExtensions=true
    form.parse(req, (err, fields, files) => {
        if (err) {
          next(err);
          return;
        }
        const {title,department,date}=fields
        
        let arr=[]
        for(let i=0;i<files.photos.length;i++){
            let photo=new Photo()
            if(files.photos[i]){
                photo.img=fs.readFileSync(files.photos[i].path);
                photo.img.contentType=files.photos[i].type
              }
      
              photo.save((err,photo)=>{
                if(err){
                    return res.status(400).json({
                        error:"Saving tshirt in DB failed"
                    })
                }
            })
            arr.push(photo.id)
        }
        Notice.updateOne({_id:req.params.noticeId ,$set:{
            title:title,
            department:department,
            date:date,
            photos:arr
        }}).exec((err,datesheet)=>{
            if(err){
                return res.status(400).json({
                    message:"Unable to update Notice"
                })
            }
            return res.json(datesheet)
    
        })
    })

    
}
