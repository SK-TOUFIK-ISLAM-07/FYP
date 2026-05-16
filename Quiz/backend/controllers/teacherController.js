// backend/controllers/teacherController.js
const Submission = require('../models/Submission');
const Exam = require('../models/Exam');

exports.getResponses = async (req, res) => {
  try {
    const exams = await Exam.find({ createdBy: req.user._id }).select('_id');
    const examIds = exams.map(e => e._id);
    const subs = await Submission.find({ exam: { $in: examIds } })
      .populate('exam')
      .populate('student')
      .populate({ path: 'answers.question', model: 'Question' })
      .sort({ submittedAt: -1 });

    res.json(subs);
  } catch (err) {
    console.error('getResponses err', err);
    res.status(500).json({ message: err.message });
  }
};

exports.publishMarks = async (req, res) => {
  try {
    const submissionId = req.params.submissionId;
    const sub = await Submission.findById(submissionId).populate('exam');
    if (!sub) return res.status(404).json({ message: 'Not found' });

    // authorize teacher
    const exam = await Exam.findById(sub.exam);
    if (!exam) return res.status(404).json({ message: 'Exam not found' });
    if (String(exam.createdBy) !== String(req.user._id)) return res.status(403).json({ message: 'Forbidden' });

    // Update manual marks from request body if provided
    if (Array.isArray(req.body.answers)) {
      sub.answers.forEach((a, idx) => {
        const provided = req.body.answers[idx];
        if (provided && provided.manualMarks !== undefined) {
          a.manualMarks = Number(provided.manualMarks) || 0;
        }
      });
    }

    // recompute total as auto + manual
    const totalAuto = sub.answers.reduce((s, a) => s + (a.autoMarks || 0), 0);
    const totalManual = sub.answers.reduce((s, a) => s + (a.manualMarks || 0), 0);
    sub.totalMarks = totalAuto + totalManual;
    sub.graded = true;
    sub.published = true;

    await sub.save();

    // notify student via socket if available
    try {
      const io = req.app.get('io');
      if (io) io.to(`student_${sub.student.toString()}`).emit('published', { submissionId: sub._id, totalMarks: sub.totalMarks });
    } catch (e) { /* ignore */ }

    res.json({ message: 'Published', submission: sub });
  } catch (err) {
    console.error('publishMarks err', err);
    res.status(500).json({ message: err.message });
  }
};
