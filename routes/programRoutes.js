const express = require("express");
const router = express.Router();
const programController = require("../controllers/programController");

router.get("/:id", programController.getProgramById);
router.get("/", programController.getAllPrograms);

router.post("/", programController.addProgram);

router.put("/:id", programController.updateProgram);

router.delete("/:id", programController.deleteProgram);

module.exports = router;
