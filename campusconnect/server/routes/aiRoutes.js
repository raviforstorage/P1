const express = require('express');
const { askAI } = require('../controllers/aiController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.post('/ask', requireAuth, askAI);

module.exports = router;
