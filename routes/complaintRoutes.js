router.put('/:id/status', complaintController.updateComplaintStatus);

router.get('/student/:studentId', complaintController.getComplaintsByStudent);

module.exports = router;


const express = require('express');
const router = express.Router();