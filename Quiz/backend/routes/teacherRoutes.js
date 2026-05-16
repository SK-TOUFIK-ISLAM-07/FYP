const router = require("express").Router();
const auth = require("../middleware/auth");
const role = require("../middleware/roles");
const {
  getResponses,
  publishMarks
} = require("../controllers/teacherController");

// Get responses of all students for teacher
router.get("/responses", auth, role("teacher"), getResponses);

// Publish marks (final marks)
router.post("/:submissionId/publish", auth, role("teacher"), publishMarks);

module.exports = router;
