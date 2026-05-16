// frontend/src/pages/teacher/CreateExam.jsx
import React, { useState, useEffect } from "react";
import api from "../../utils/api";

export default function CreateExam() {
  const [mode, setMode] = useState("manual");
  const [subject, setSubject] = useState("");
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState("");
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");

  const [questions, setQuestions] = useState([]);
  const [selected, setSelected] = useState([]);
  const [autoCounts, setAutoCounts] = useState({ easy: 0, medium: 0, hard: 0 });

  useEffect(() => {
    if (subject.trim()) {
      api
        .get(`/questions?subject=${encodeURIComponent(subject)}`)
        .then((res) => setQuestions(res.data))
        .catch(() => setQuestions([]));
    } else {
      setQuestions([]);
    }
  }, [subject]);

  const toggleQuestion = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const createExam = async () => {
    if (!title || !subject || !duration)
      return alert("Please fill required fields");

    const payload = {
      title,
      subject,
      durationMinutes: Number(duration),
      startAt: startAt ? new Date(startAt).toISOString() : null,
      endAt: endAt ? new Date(endAt).toISOString() : null,
      mode,
    };

    if (mode === "manual") payload.questionIds = selected;
    else
      payload.autoCounts = {
        easy: Number(autoCounts.easy),
        medium: Number(autoCounts.medium),
        hard: Number(autoCounts.hard),
      };

    try {
      await api.post("/exams/create", payload);
      alert("Exam created");

      setTitle("");
      setSubject("");
      setDuration("");
      setStartAt("");
      setEndAt("");
      setSelected([]);
      setAutoCounts({ easy: 0, medium: 0, hard: 0 });
      setQuestions([]);
    } catch (e) {
      alert(e?.response?.data?.message || "Create failed");
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md space-y-4 border border-gray-200">
      <h3 className="text-xl font-semibold text-gray-800">Create Exam</h3>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Exam Title"
        className="w-full p-3 border rounded-lg"
      />
      <input
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        placeholder="Subject"
        className="w-full p-3 border rounded-lg"
      />
      <input
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
        placeholder="Duration (minutes)"
        className="w-full p-3 border rounded-lg"
      />

      <input
        type="datetime-local"
        value={startAt}
        onChange={(e) => setStartAt(e.target.value)}
        className="w-full p-3 border rounded-lg"
      />
      <input
        type="datetime-local"
        value={endAt}
        onChange={(e) => setEndAt(e.target.value)}
        className="w-full p-3 border rounded-lg"
      />

      {/* MODE SELECT */}
      <div className="flex gap-6 mt-2 text-sm">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            checked={mode === "manual"}
            onChange={() => setMode("manual")}
          />
          Manual
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            checked={mode === "auto"}
            onChange={() => setMode("auto")}
          />
          Auto
        </label>
      </div>

      {/* MANUAL MODE */}
      {mode === "manual" && (
        <div className="space-y-3">
          {questions.length === 0 ? (
            <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
              No questions available for this subject.
            </div>
          ) : (
            questions.map((q) => (
              <div
                key={q._id}
                className="flex justify-between items-center p-3 bg-gray-50 border rounded-lg"
              >
                <div className="text-gray-700">{q.text}</div>
                <input
                  type="checkbox"
                  checked={selected.includes(q._id)}
                  onChange={() => toggleQuestion(q._id)}
                />
              </div>
            ))
          )}
        </div>
      )}

      {/* AUTO MODE */}
      {mode === "auto" && (
        <div className="grid grid-cols-3 gap-4">
          {["easy", "medium", "hard"].map((lvl) => (
            <div key={lvl}>
              <div className="text-sm font-medium capitalize text-gray-600 mb-1">
                {lvl} ({questions.filter((q) => q.difficulty === lvl).length})
              </div>
              <input
                className="w-full p-2 border rounded-lg"
                value={autoCounts[lvl]}
                onChange={(e) =>
                  setAutoCounts({ ...autoCounts, [lvl]: e.target.value })
                }
              />
            </div>
          ))}
        </div>
      )}

      {/* ACTION */}
      <button
        onClick={createExam}
        className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
      >
        Create Exam
      </button>
    </div>
  );
}
