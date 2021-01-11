const express = require("express");
const Photo = require("../models/photo");
const User = require("../models/user");
const formidable = require("formidable");
const Datesheet = require("../models/datesheet");
const fetch = require("node-fetch");
const jwt_decode = require("jwt-decode");
const fs = require("fs");

exports.addDatesheet = (req, res) => {
  const form = new formidable.IncomingForm();
  form.multiples = true;
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      next(err);
      return;
    }
    const { title, course, semester } = fields;

    const datesheet = new Datesheet(fields);

    //saving user reference
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt_decode(token);
    datesheet.createdBy = decoded._id;

    let arr = [];
    for (let i = 0; i < files.photos.length; i++) {
      let photo = new Photo();
      if (files.photos[i]) {
        photo.img = fs.readFileSync(files.photos[i].path);
        photo.img.contentType = files.photos[i].type;
      }

      photo.save((err, photo) => {
        if (err) {
          return res.status(400).json({
            error: "Saving tshirt in DB failed",
          });
        }
      });
      arr.push(photo.id);
    }
    datesheet.photos = arr;
    datesheet.save((err, datesheet) => {
      if (err) return res.send(err);
      return res.send(datesheet);
    });
  });
};

exports.getAllDatesheet = (req, res) => {

  Datesheet.find({}, (err, datesheet) => {
    res.send(datesheet);
  }).sort({ createdAt: -1 });
};
exports.getDatesheet = (req, res) => {
  Datesheet.find({
    course: req.params.course,
    semester: req.params.semester,
  }).exec((err, datesheet) => {
    if (err) {
      return res.json({
        error: "Error",
      });
    }
    return res.send(datesheet);
  });
};

exports.deleteDatesheet = (req, res) => {
  const id = req.params.id;
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt_decode(token);
  if (id === decoded.createdBy) {
    Datesheet.deleteOne({ _id: id }, (err) => {
      if (err) return res.send("Cannot delete");
      return res.json({
        message: "Seccesfull deletion",
      });
    });
  } else return res.send("You are not allowed to delete");
};
exports.updateDatesheet = (req, res) => {
  Datesheet.findById({ _id: req.params.datesheetId }).exec((err, datesheet) => {
    if (err)
      return res.status(400).json({
        message: "Unable to update Datesheet",
      });
    for (let i = 0; i < datesheet.photos.length; i++) {
      Photo.deleteOne({ _id: datesheet.photos[i] }).exec((err, photo) => {
        if (err) {
          return res.status(400).json({
            message: "unable to delete",
          });
        }
      });
    }
  });

  const form = new formidable.IncomingForm();
  form.multiples = true;
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      next(err);
      return;
    }
    const { title, course, semester } = fields;

    let arr = [];
    for (let i = 0; i < files.photos.length; i++) {
      let photo = new Photo();
      if (files.photos[i]) {
        photo.img = fs.readFileSync(files.photos[i].path);
        photo.img.contentType = files.photos[i].type;
      }

      photo.save((err, photo) => {
        if (err) {
          return res.status(400).json({
            error: "Saving tshirt in DB failed",
          });
        }
      });
      arr.push(photo.id);
    }
    console.log(arr);
    Datesheet.updateOne(
      {
        _id: req.params.datesheetId,
      },
      {
        $set: {
          title: title,
          course: course,
          semester: semester,
          photos: arr,
        },
      }
    ).exec((err, datesheet) => {
      if (err) {
        return res.status(400).json({
          message: "Unable to update Datesheet",
        });
      }
      return res.json(datesheet);
    });
  });
};
exports.getUserDatesheet = (req, res) => {
  Datesheet.find({ createdBy: req.params.userId }).exec((err, datesheet) => {
    if (err) {
      return res.status(400).json({
        message: "Unable to find any datesheet",
      });
    }
    return res.send(datesheet);
  });
};
