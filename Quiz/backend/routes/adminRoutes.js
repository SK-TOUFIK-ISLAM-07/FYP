const router = require("express").Router();
const auth = require("../middleware/auth");
const role = require("../middleware/roles");
const { getUsers, analytics } = require("../controllers/adminController");

router.get("/users", auth, role("admin"), getUsers);
router.get("/analytics", auth, role("admin"), analytics);

module.exports = router;
