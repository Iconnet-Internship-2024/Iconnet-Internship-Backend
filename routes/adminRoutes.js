const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get('/', adminController.getAllAdminProfiles);
router.get('/:id', adminController.getAdminProfileById);
router.get('/:user_id', adminController.getAdminProfileByUserId);
router.post('/', adminController.createAdminProfile);
router.put('/:id', adminController.updateAdminProfile);
router.delete('/:id', adminController.deleteAdminProfile);

module.exports = router;
