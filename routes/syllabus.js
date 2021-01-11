const express = require("express");
const router = express.Router();
const {
  addSyllabus,
  getAllSyllabus,
  getSyllabus,
  deleteSyllabus,
  getUserSyllabus,
  updateSyllabus,
} = require("../controllers/syllabus");
const { isAllowed } = require("../controllers/user");

//all of actual routes
router.post("/addSyllabus", isAllowed, addSyllabus);
router.get("/getAllSyllabus", getAllSyllabus);
router.get("/getSyllabus/:course/:semester", getSyllabus);
router.get("/deleteSyllabus/:id", isAllowed, deleteSyllabus);
router.get("/userSyllabus/:userId", getUserSyllabus);
router.put("/updateSyllabus/:syllabusId", isAllowed, updateSyllabus);
module.exports = router;
