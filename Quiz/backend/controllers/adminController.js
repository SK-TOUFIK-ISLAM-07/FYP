const User = require("../models/User");
const Submission = require("../models/Submission");
const Exam = require("../models/Exam");

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e.message });
  }
};

exports.analytics = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: "student" });
    const totalTeachers = await User.countDocuments({ role: "teacher" });
    const totalExams = await Exam.countDocuments();

    const perExam = await Submission.aggregate([
      { $match: { published: true } },
      {
        $group: {
          _id: "$exam",
          avgMarks: { $avg: "$totalMarks" },
          count: { $sum: 1 },
          maxMarks: { $max: "$totalMarks" },
          minMarks: { $min: "$totalMarks" }
        }
      },
      {
        $lookup: {
          from: "exams",
          localField: "_id",
          foreignField: "_id",
          as: "exam"
        }
      },
      { $unwind: "$exam" },
      {
        $project: {
          examTitle: "$exam.title",
          subject: "$exam.subject",
          avgMarks: 1,
          count: 1,
          maxMarks: 1,
          minMarks: 1
        }
      }
    ]);

    res.json({
      totalStudents,
      totalTeachers,
      totalExams,
      perExam
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e.message });
  }
};
