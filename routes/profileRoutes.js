
const express = require('express');
const router = express.Router();
const { getStudentProfile, getWardenProfile } = require('../controllers/ProfileController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/student/:studentId', verifyToken, getStudentProfile);
router.get('/warden/:wardenId', verifyToken, getWardenProfile);
module.exports = router;





