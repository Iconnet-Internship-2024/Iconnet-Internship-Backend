const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authorize } = require("../middleware/authMiddleware");

router.get("/:user_id", userController.getUserById);
router.get("/", authorize([3]), userController.getAllUsers);

router.put("/updatePassword", userController.updatePassword);
router.put("/updateUsername", userController.updateUsername);

module.exports = router;
