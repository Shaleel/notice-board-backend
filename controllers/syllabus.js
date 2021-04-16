const express = require("express")
const Photo = require("../models/photo")
const formidable= require("formidable")
const Syllabus = require("../models/syllabus")
const fs = require("fs")
const jwt_decode=require("jwt-decode")

exports.addSyllabus=(req,res)=>{
    const form = new formidable.IncomingForm()
    form.multiples=true;
    form.keepExtensions=true
    form.parse(req, (err, fields, files) => {
        if (err) {
          next(err);
          return;
        }
        const {title,course,semester}=fields

        const syllabus= new Syllabus(fields)
        //saving user reference
        //saving user reference
        const token=req.headers.authorization.split(' ')[1]
        const decoded=jwt_decode(token);
        syllabus.createdBy=decoded._id

        let arr=[]
        res.send(req.form)
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
        syllabus.photos=arr;
        syllabus.save((err,syllabus)=>{
            if(err)
                return console.log("Error Saving")
            return res.send(syllabus)
        })

      });
    
    
}

exports.getAllSyllabus=(req,res)=>{
    Syllabus.find({}).sort({createdAt:-1}).then(syllabus=>{
        res.send(syllabus)
    })
}
exports.getSyllabus=(req,res)=>{
    Syllabus.find({
        course:req.params.course,
        semester:req.params.semester
    }).exec((err,syllabus)=>{
        if(err){
            return res.json({
                error:"Error"
            })
        }
        return res.send(syllabus)
    })
}
exports.deleteSyllabus=(req,res)=>{
    const id=req.params.id;
    const token=req.headers.authorization.split(' ')[1]
    const decoded=jwt_decode(token);
    if(id===decoded.createdBy){
        Syllabus.findById({_id:id}).exec((err,syllabus)=>{
            if(err)
                return res.status(400).json({
                    message:"Unable to update Syllabus"
            })
            for(let i=0;i<syllabus.photos.length;i++){
                Photo.deleteOne({_id:notice.photos[i]});
            }
        })
            Syllabus.deleteOne({_id:id},(err)=>{
                if(err)
                    return res.send("Cannot delete")
                return res.json({
                    message:"Seccesfull deletion"
                })
            })
    }
    else return res.send("You are not allowed to delete")
}
exports.getUserSyllabus=(req,res)=>{
    Syllabus.find({createdBy:req.params.userId}).exec((err,syllabus)=>{
        if(err){
            return res.status(400).json({
                message:"Unable to find any datesheet"
            })

        }
        return res.send(syllabus)
    })
}
exports.updateSyllabus=(req,res)=>{
   
    Syllabus.findById({_id:req.params.syllabusId}).exec((err,syllabus)=>{
        if(err)
            return res.status(400).json({
                message:"Unable to update Syllabus"
        })
        for(let i=0;i<syllabus.photos.length;i++){
            Photo.deleteOne({_id:syllabus.photos[i]}).exec((err,photo)=>{
                if(err){
                    return res.status(400).json({
                        message:"unable to delete"
                    });
                }
                
            });
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
        const {title,course,semester}=fields

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
        console.log(arr)
        Datesheet.updateOne({
            _id:req.params.syllabusId 
        },
        {
            $set:{
                title:title,
                course:course,
                semester:semester,
                photos:arr,
                
        }}).exec((err,syllabus)=>{
            if(err){
                return res.status(400).json({
                    message:"Unable to update syllabus"
                })
            }
            return res.json(datesheet)
    
        })
    })



    
}