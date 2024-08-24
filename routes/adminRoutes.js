const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

router.get("/user/:user_id", adminController.getAdminProfileByUserId);
router.get("/:id", adminController.getAdminProfileById);
router.get("/", adminController.getAllAdminProfiles);

router.post("/", adminController.createAdminProfile);

router.put("/:id", adminController.updateAdminProfile);

router.delete("/:id", adminController.deleteAdminProfile);

module.exports = router;
