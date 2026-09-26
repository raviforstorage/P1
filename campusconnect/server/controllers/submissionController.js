const Submission = require('../models/Submission');
const User = require('../models/User');

// Student: submit a new doubt. Ownership is taken from the verified JWT
// (req.user), never from the request body.
async function createSubmission(req, res) {
  try {
    const { subject, text } = req.body;
    if (!subject || !text) {
      return res.status(400).json({ message: 'Subject and question text are required.' });
    }
    const submission = await Submission.create({
      student: req.user.id,
      studentName: req.user.name,
      studentEmail: req.user.email,
      subject: subject.trim(),
      text: text.trim(),
    });
    res.status(201).json({ submission });
  } catch (err) {
    res.status(500).json({ message: 'Could not submit doubt.', error: err.message });
  }
}

// Student: only their own submissions.
async function getMySubmissions(req, res) {
  try {
    const submissions = await Submission.find({ student: req.user.id }).sort({ createdAt: -1 });
    res.json({ submissions });
  } catch (err) {
    res.status(500).json({ message: 'Could not load your doubts.', error: err.message });
  }
}

// Admin: every submission in the system.
async function getAllSubmissions(req, res) {
  try {
    const submissions = await Submission.find().sort({ createdAt: -1 });
    res.json({ submissions });
  } catch (err) {
    res.status(500).json({ message: 'Could not load submissions.', error: err.message });
  }
}

// Admin: write a reply and mark the doubt resolved.
async function respondToSubmission(req, res) {
  try {
    const { reply } = req.body;
    const submission = await Submission.findById(req.params.id);
    if (!submission) return res.status(404).json({ message: 'Submission not found.' });

    submission.reply = (reply || '').trim();
    submission.status = 'Resolved';
    await submission.save();
    res.json({ submission });
  } catch (err) {
    res.status(500).json({ message: 'Could not save reply.', error: err.message });
  }
}

// Admin: list registered students with a doubt count each.
async function getStudents(req, res) {
  try {
    const students = await User.find({ role: 'student' }).select('name email createdAt');
    const counts = await Submission.aggregate([{ $group: { _id: '$student', count: { $sum: 1 } } }]);
    const countMap = Object.fromEntries(counts.map((c) => [c._id.toString(), c.count]));

    const result = students.map((s) => ({
      id: s._id,
      name: s.name,
      email: s.email,
      doubtsPosted: countMap[s._id.toString()] || 0,
    }));
    res.json({ students: result });
  } catch (err) {
    res.status(500).json({ message: 'Could not load students.', error: err.message });
  }
}

// Admin: summary counters for the dashboard stat cards.
async function getStats(req, res) {
  try {
    const [total, pending, studentCount] = await Promise.all([
      Submission.countDocuments(),
      Submission.countDocuments({ status: 'Pending' }),
      User.countDocuments({ role: 'student' }),
    ]);
    res.json({ total, pending, studentCount });
  } catch (err) {
    res.status(500).json({ message: 'Could not load stats.', error: err.message });
  }
}

module.exports = {
  createSubmission,
  getMySubmissions,
  getAllSubmissions,
  respondToSubmission,
  getStudents,
  getStats,
};
