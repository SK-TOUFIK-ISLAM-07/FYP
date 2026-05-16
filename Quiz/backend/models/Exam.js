const mongoose = require("mongoose");

const ExamSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subject: { type: String, required: true },
    questions: [{ type: mongoose.Types.ObjectId, ref: "Question" }],
    durationMinutes: { type: Number, default: 60 },
    randomizeQuestions: { type: Boolean, default: true },
    randomizeOptions: { type: Boolean, default: true },
    startAt: { type: Date },
    endAt: { type: Date },
    createdBy: { type: mongoose.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Exam", ExamSchema);
