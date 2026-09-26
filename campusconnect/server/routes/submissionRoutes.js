const express = require('express');
const {
  createSubmission,
  getMySubmissions,
  getAllSubmissions,
  respondToSubmission,
  getStudents,
  getStats,
} = require('../controllers/submissionController');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

// Student routes
router.post('/', requireAuth, requireRole('student'), createSubmission);
router.get('/mine', requireAuth, requireRole('student'), getMySubmissions);

// Admin routes
router.get('/', requireAuth, requireRole('admin'), getAllSubmissions);
router.patch('/:id', requireAuth, requireRole('admin'), respondToSubmission);
router.get('/meta/students', requireAuth, requireRole('admin'), getStudents);
router.get('/meta/stats', requireAuth, requireRole('admin'), getStats);

module.exports = router;
