// backend/controllers/examController.js
const Exam = require('../models/Exam');
const Question = require('../models/Question');
const Submission = require('../models/Submission');
const { ObjectId } = require('mongodb');

const shuffle = (arr) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

exports.createExam = async (req, res) => {
  try {
    const {
      title,
      subject,
      durationMinutes,
      startAt,
      endAt,
      randomizeQuestions = true,
      randomizeOptions = true,
      mode,
      questionIds,
      autoCounts = {}
    } = req.body;

    if (!title || !subject || !mode)
      return res.status(400).json({ message: "Missing fields" });

    let questions = [];

    if (mode === "manual") {
      if (!questionIds || questionIds.length === 0)
        return res.status(400).json({ message: "Select at least 1 question" });

      // Use new ObjectId(...) for compatibility
      questions = questionIds.map(id => new ObjectId(id));
    } else if (mode === "auto") {
      const pick = async (difficulty, count) => {
        if (!count || Number(count) <= 0) return [];
        const list = await Question.aggregate([
          { $match: { teacher: req.user._id, subject, difficulty } },
          { $sample: { size: Number(count) } },
          { $project: { _id: 1 } }
        ]);
        return list.map(x => new ObjectId(x._id));
      };

      const easy = await pick('easy', autoCounts.easy);
      const medium = await pick('medium', autoCounts.medium);
      const hard = await pick('hard', autoCounts.hard);
      questions = [...easy, ...medium, ...hard];
    } else {
      return res.status(400).json({ message: "Invalid mode" });
    }

    const exam = await Exam.create({
      title,
      subject,
      questions,
      durationMinutes,
      startAt: startAt ? new Date(startAt) : null,
      endAt: endAt ? new Date(endAt) : null,
      randomizeQuestions,
      randomizeOptions,
      createdBy: req.user._id
    });

    res.json(exam);
  } catch (err) {
    console.error('createExam err', err);
    res.status(500).json({ message: err.message });
  }
};

exports.teacherExams = async (req, res) => {
  try {
    const exams = await Exam.find({ createdBy: req.user._id }).populate('questions').sort({ createdAt: -1 });
    const out = exams.map(e => ({
      _id: e._id,
      title: e.title,
      subject: e.subject,
      startAt: e.startAt,
      endAt: e.endAt,
      durationMinutes: e.durationMinutes,
      questionsCount: e.questions.length,
      createdAt: e.createdAt
    }));
    res.json(out);
  } catch (err) {
    console.error('teacherExams err', err);
    res.status(500).json({ message: err.message });
  }
};

exports.viewExam = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id).populate('questions');
    if (!exam) return res.status(404).json({ message: 'Not found' });
    res.json(exam);
  } catch (err) {
    console.error('viewExam err', err);
    res.status(500).json({ message: err.message });
  }
};

exports.availableExams = async (req, res) => {
  try {
    const now = new Date();

    const exams = await Exam.find()
      .populate('createdBy')
      .sort({ startAt: -1 })
      .limit(5)
      .lean();

    // For each exam, determine status and whether current student already submitted
    const out = await Promise.all(exams.map(async (e) => {
      let status = 'upcoming';
      if (e.startAt && now >= e.startAt && (!e.endAt || now <= e.endAt)) status = 'live';
      if (e.endAt && now > e.endAt) status = 'closed';

      const submitted = await Submission.findOne({ exam: e._id, student: req.user._id });

      return {
        _id: e._id,
        title: e.title,
        subject: e.subject,
        startAt: e.startAt,
        endAt: e.endAt,
        durationMinutes: e.durationMinutes,
        teacherName: e.createdBy?.name || null,
        status,
        submitted: !!submitted,
        totalQuestions: (e.questions || []).length
      };
    }));

    res.json(out);
  } catch (err) {
    console.error('availableExams err', err);
    res.status(500).json({ message: err.message });
  }
};

exports.startExam = async (req, res) => {
  try {
    const examId = req.params.id;
    const exam = await Exam.findById(examId).populate('questions');
    if (!exam) return res.status(404).json({ message: 'Exam not found' });

    // Prevent re-entry if already submitted
    const already = await Submission.findOne({ exam: examId, student: req.user._id });
    if (already) return res.status(400).json({ message: 'Already submitted' });

    const now = new Date();
    if (exam.startAt && now < exam.startAt) return res.status(400).json({ message: 'Exam not started' });
    if (exam.endAt && now > exam.endAt) return res.status(400).json({ message: 'Exam ended' });

    let questions = exam.questions.map(q => q.toObject());

    if (exam.randomizeQuestions) questions = shuffle(questions);

    if (exam.randomizeOptions) {
      questions = questions.map(q => {
        if (q.type === 'mcq' && Array.isArray(q.options)) {
          const opts = q.options.map((o, i) => ({ o, i }));
          shuffle(opts);
          q.options = opts.map(x => x.o);
          q.correctOption = opts.findIndex(x => x.i === q.correctOption);
        }
        return q;
      });
    }

    // Remove correctOption before sending
    const safe = questions.map(q => {
      const c = { ...q };
      delete c.correctOption;
      return c;
    });

    res.json({
      exam: { id: exam._id, title: exam.title, subject: exam.subject, durationMinutes: exam.durationMinutes },
      questions: safe
    });
  } catch (err) {
    console.error('startExam err', err);
    res.status(500).json({ message: err.message });
  }
};

exports.examStatus = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) return res.status(404).json({ message: 'Not found' });
    const now = new Date();
    let status = 'upcoming';
    if (exam.startAt && now >= exam.startAt && (!exam.endAt || now <= exam.endAt)) status = 'live';
    if (exam.endAt && now > exam.endAt) status = 'closed';
    res.json({ status, startAt: exam.startAt, endAt: exam.endAt });
  } catch (err) {
    console.error('examStatus err', err);
    res.status(500).json({ message: err.message });
  }
};

exports.allExams = async (req, res) => {
  try {
    const exams = await Exam.find().populate('createdBy').sort({ createdAt: -1 });
    res.json(exams);
  } catch (err) {
    console.error('allExams err', err);
    res.status(500).json({ message: err.message });
  }
};
