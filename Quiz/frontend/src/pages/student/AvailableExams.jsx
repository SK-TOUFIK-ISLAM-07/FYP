// frontend/src/pages/student/AvailableExams.jsx
import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import { useNavigate } from "react-router-dom";
import Countdown from "../../components/Countdown";

export default function AvailableExams() {
  const [exams, setExams] = useState([]);
  const nav = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/exams/available");
        setExams(res.data);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {exams.map((e) => (
        <div
          key={e._id}
          className="bg-white shadow-md border border-gray-200 rounded-xl p-5 hover:shadow-lg transition"
        >
          <div className="flex justify-between items-start">
            <div>
              <div className="text-lg font-semibold text-gray-800">{e.title}</div>
              <div className="text-sm text-gray-500">
                {e.subject} • {e.teacherName || "Instructor"}
              </div>
            </div>

            <span
              className={`text-xs font-medium px-2 py-1 rounded ${
                e.status === "upcoming"
                  ? "bg-yellow-100 text-yellow-700"
                  : e.status === "live"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {e.status.toUpperCase()}
            </span>
          </div>

          <div className="mt-4 text-sm text-gray-600 space-y-1">
            {e.startAt && <div>Start: {new Date(e.startAt).toLocaleString()}</div>}
            {e.endAt && <div>End: {new Date(e.endAt).toLocaleString()}</div>}
            <div>Duration: {e.durationMinutes} min</div>
            <div>Questions: {e.totalQuestions}</div>
          </div>

          <div className="mt-4 flex justify-between items-center">
            <div>{e.status === "upcoming" && e.startAt && <Countdown target={e.startAt} />}</div>

            <button
              disabled={e.submitted || e.status !== "live"}
              onClick={() => {
                if (!e.submitted && e.status === "live")
                  nav(`/student/exam?examId=${e._id}`);
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                e.submitted
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : e.status === "live"
                  ? "bg-indigo-600 text-white hover:bg-indigo-700"
                  : "bg-gray-300 text-gray-700 cursor-not-allowed"
              }`}
            >
              {e.submitted
                ? "Already Submitted"
                : e.status === "live"
                ? "Start Exam"
                : e.status.toUpperCase()}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
