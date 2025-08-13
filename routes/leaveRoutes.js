const express = require('express');
const router = express.Router();
const verifyJWT = require('../middleware/verifyJWT');
const leaveController = require('../controllers/leaveController');

router.post('/apply',verifyJWT, leaveController.applyLeave);
router.get('/student/:studentId',verifyJWT, leaveController.getLeavesByStudent);
router.get('/all', verifyJWT, leaveController.getAllLeaves);
router.put('/warden-approval/:leaveId',verifyJWT,leaveController.updateWardenApproval);
router.delete('/delete/:leaveId', verifyJWT, leaveController.deleteLeave);

module.exports = router;





