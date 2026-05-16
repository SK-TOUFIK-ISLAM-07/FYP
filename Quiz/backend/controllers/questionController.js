const Question = require('../models/Question');

exports.createQuestion = async (req, res) => {
  try {
    const { subject, type, text, options, correctOption, marks, difficulty } = req.body;
    if (!subject || !type || !text) return res.status(400).json({ message: 'Missing fields' });

    const q = await Question.create({
      teacher: req.user._id,
      subject,
      type,
      text,
      options: type === 'mcq' ? options || [] : [],
      correctOption: type === 'mcq' ? correctOption : undefined,
      marks: marks || 1,
      difficulty: difficulty || 'medium'
    });
    res.json(q);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

exports.listQuestions = async (req, res) => {
  try {
    const query = { teacher: req.user._id };
    if (req.query.subject) query.subject = req.query.subject;
    if (req.query.type) query.type = req.query.type;
    if (req.query.difficulty) query.difficulty = req.query.difficulty;

    const list = await Question.find(query).sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

exports.updateQuestion = async (req, res) => {
  try {
    const q = await Question.findOneAndUpdate({ _id: req.params.id, teacher: req.user._id }, req.body, { new: true });
    if (!q) return res.status(404).json({ message: 'Not found' });
    res.json(q);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

exports.deleteQuestion = async (req, res) => {
  try {
    const q = await Question.findOneAndDelete({ _id: req.params.id, teacher: req.user._id });
    if (!q) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
