const express = require("express")
const Photo = require("../models/photo")
const formidable= require("formidable")
const fs = require("fs")
exports.createPhoto=(req,res)=>{
    
        let form = new formidable.IncomingForm()
          form.keepExtensions=true
          form.parse(req,(err,fields,file)=>{
              if(err){
                  return res.status(400).json({
                      error:"problem with image"
                  })
              }
              const {img}=fields;
      
              let photo = new Photo(fields)
      
              if(file.img){
                photo.img=fs.readFileSync(file.img.path);
                photo.img.contentType=file.type
              }
      
              photo.save((err,photo)=>{
                if(err){
                    return res.status(400).json({
                        error:"Saving tshirt in DB failed"
                    })
                }
                return res.json(photo.img)
            })
            })

}

exports.getPhoto=(req,res)=>{
    Photo.findOne({_id:req.params.photoId}).exec((err,photo)=>{
        if(err)
            return res.status(400).json({
                message:"No photo exist"
            })
        if(photo)
            return res.json(photo.img)
    })
}

exports.deletePhoto=(req,res)=>{
    const id=req.params.id
    Photo.deleteOne({_id:id}).exec((err,photo)=>{
        if(err){
            return res.status(400).json({
                message:"unable to delete"
            });
        }
        return res.json({
            message:"Successfully deleted"
        })
    })
}