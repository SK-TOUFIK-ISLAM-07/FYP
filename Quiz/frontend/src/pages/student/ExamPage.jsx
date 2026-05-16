// frontend/src/pages/student/ExamPage.jsx
import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import ExamTimer from "../../components/ExamTimer";
import { useNavigate } from "react-router-dom";

export default function ExamPage() {
  const examId = new URLSearchParams(window.location.search).get("examId");
  const nav = useNavigate();

  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [started, setStarted] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // nothing here intentionally
  }, []);

  const startExam = async () => {
    if (!examId) return alert("No examId provided");
    try {
      const { data } = await api.post(`/exams/${examId}/start`);
      setExam(data.exam);
      setQuestions(data.questions);
      setStarted(true);

      window.history.pushState(null, "", window.location.href);
      window.addEventListener("popstate", () =>
        window.history.pushState(null, "", window.location.href)
      );
      window.addEventListener("beforeunload", beforeUnloadHandler);
    } catch (e) {
      alert(e?.response?.data?.message || "Could not start exam");
    }
  };

  const beforeUnloadHandler = (e) => {
    e.preventDefault();
    e.returnValue = "";
  };

  const setAns = (qid, idx, chosenOptionValue = null, text = null) => {
    setAnswers((prev) => ({
      ...prev,
      [qid]: {
        chosenIndex:
          typeof idx === "number" ? idx : prev[qid]?.chosenIndex ?? null,
        chosenOptionValue:
          chosenOptionValue ?? prev[qid]?.chosenOptionValue ?? null,
        textAnswer:
          text !== null ? text : prev[qid]?.textAnswer ?? "",
      },
    }));
  };

  const submitExam = async () => {
    if (submitted) return;
    setSubmitted(true);

    const payload = Object.entries(answers).map(([qid, v]) => ({
      question: qid,
      chosenIndex: v.chosenIndex,
      chosenOptionValue: v.chosenOptionValue,
      textAnswer: v.textAnswer,
    }));

    try {
      await api.post("/student/submit", { examId: exam.id, answers: payload });
      alert("Submitted Successfully!");
      nav("/student/available");
    } catch (e) {
      alert(e?.response?.data?.message || "Submit failed");
      setSubmitted(false);
    } finally {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    }
  };

  if (!started) {
    return (
      <div className="p-6 bg-white rounded-xl shadow-md max-w-md mx-auto mt-10">
        <h3 className="text-xl font-semibold text-gray-800">Start Exam</h3>
        <button
          onClick={startExam}
          className="mt-4 px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          Start Exam
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">
          {exam?.title} — {exam?.subject}
        </h2>
        <ExamTimer
          durationMinutes={exam?.durationMinutes || 60}
          onExpire={submitExam}
        />
      </div>

      {/* Questions */}
      {questions.map((q, i) => (
        <div key={q._id} className="bg-white p-5 rounded-xl shadow-md">
          <div className="font-medium mb-3 text-gray-800">
            {i + 1}. {q.text}
          </div>

          {q.type === "mcq" ? (
            q.options.map((opt, idx) => (
              <label
                key={idx}
                className="block text-gray-700 cursor-pointer mb-1"
              >
                <input
                  type="radio"
                  name={q._id}
                  className="mr-2"
                  onChange={() => setAns(q._id, idx, opt, null)}
                />
                {opt}
              </label>
            ))
          ) : (
            <textarea
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-indigo-500"
              onChange={(e) => setAns(q._id, null, null, e.target.value)}
            />
          )}
        </div>
      ))}

      <button
        disabled={submitted}
        onClick={submitExam}
        className={`px-5 py-2 rounded-lg text-white font-medium ${
          submitted
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-600 hover:bg-green-700"
        }`}
      >
        {submitted ? "Submitted" : "Submit"}
      </button>
    </div>
  );
}
