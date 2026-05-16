// backend/controllers/studentController.js
const Exam = require("../models/Exam");
const Submission = require("../models/Submission");
const Question = require("../models/Question");

// Submit Exam
exports.submitExam = async (req, res) => {
  try {
    const { examId, answers } = req.body;

    const exam = await Exam.findById(examId);
    if (!exam) return res.status(404).json({ message: "Exam not found" });

    // Prevent double submissions
    const existing = await Submission.findOne({ exam: examId, student: req.user._id });
    if (existing) return res.status(400).json({ message: "Already submitted" });

    let normalized = [];
    let autoTotal = 0;

    for (let a of answers) {
      const q = await Question.findById(a.question);
      if (!q) continue;

      let auto = 0;
      if (q.type === "mcq") {
        // compare by chosenOptionValue if provided (robust for shuffling)
        if (a.chosenOptionValue && q.options[q.correctOption] === a.chosenOptionValue) {
          auto = q.marks || 0;
        } else if (typeof a.chosenIndex === 'number' && a.chosenIndex === q.correctOption) {
          // fallback if client sent index matching DB ordering (rare)
          auto = q.marks || 0;
        }
      }
      autoTotal += auto;

      normalized.push({
        question: q._id,
        chosenIndex: a.chosenIndex !== undefined ? a.chosenIndex : null,
        chosenOptionValue: a.chosenOptionValue || null,
        textAnswer: a.textAnswer || "",
        autoMarks: auto,
        manualMarks: 0
      });
    }

    const submission = await Submission.create({
      exam: examId,
      student: req.user._id,
      studentName: req.user.name,
      answers: normalized,
      totalMarks: autoTotal,
      submittedAt: new Date(),
      graded: false,
      published: false
    });

    // optionally notify teacher via io (if attached)
    try {
      const io = req.app.get('io');
      if (io && exam.createdBy) {
        io.to(`teacher_${exam.createdBy.toString()}`).emit('newSubmission', { submissionId: submission._id });
      }
    } catch (e) { /* ignore */ }

    res.json(submission);
  } catch (err) {
    console.error('submitExam err', err);
    res.status(500).json({ message: err.message });
  }
};

exports.getMarks = async (req, res) => {
  try {
    const subs = await Submission.find({ student: req.user._id }).populate('exam').sort({ submittedAt: -1 });
    const out = subs.map(s => ({
      _id: s._id,
      exam: s.exam ? { _id: s.exam._id, title: s.exam.title, subject: s.exam.subject } : null,
      published: s.published,
      totalMarks: s.totalMarks,
      graded: s.graded,
      submittedAt: s.submittedAt
    }));
    res.json(out);
  } catch (err) {
    console.error('getMarks err', err);
    res.status(500).json({ message: err.message });
  }
};
