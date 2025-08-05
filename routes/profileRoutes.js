// const express = require('express');
// const router = express.Router();

// const {getProfile}=require('../controllers/ProfileController');

// router.get('/:email', getProfile);

// module.exports = router;
// //

const express = require('express');
const router = express.Router();
const { getProfile } = require('../controllers/ProfileController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/', verifyToken, getProfile);

module.exports = router;
