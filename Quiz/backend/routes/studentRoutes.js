const router = require("express").Router();
const auth = require("../middleware/auth");
const role = require("../middleware/roles");
const { startExam, submitExam, getMarks } = require("../controllers/studentController");

router.post("/exam/:id/start", auth, role("student"), startExam || function(req,res){res.status(404).json({message:'Not implemented'})});
router.post("/submit", auth, role("student"), submitExam);
router.get("/marks", auth, role("student"), getMarks);

module.exports = router;
