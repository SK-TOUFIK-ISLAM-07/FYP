import React, { useEffect, useState } from "react";
import api from "../../utils/api";

export default function Responses() {
  const [rows, setRows] = useState([]);

  const load = async () => {
    try {
      const { data } = await api.get("/teacher/responses");
      setRows(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateAnswerMark = (submissionId, answerIndex, value) => {
    setRows((prev) =>
      prev.map((s) => {
        if (s._id !== submissionId) return s;
        const answers = s.answers.map((a, i) =>
          i === answerIndex ? { ...a, manualMarks: Number(value) } : a
        );
        return { ...s, answers };
      })
    );
  };

  const publish = async (submission) => {
    try {
      await api.post(`/teacher/${submission._id}/publish`, {
        answers: submission.answers,
      });
      alert("Published");
      load();
    } catch (e) {
      console.error(e);
      alert(e?.response?.data?.message || "Publish failed");
    }
  };

  return (
    <div className="space-y-6">
      {rows.length === 0 && (
        <div className="text-gray-500">No submissions available.</div>
      )}

      {rows.map((s) => (
        <div
          key={s._id}
          className="bg-white p-6 rounded-xl shadow border border-gray-200"
        >
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <div className="text-lg font-semibold text-gray-800">
                {s.studentName || s.student?.name}
              </div>
              <div className="text-sm text-gray-600">
                {s.exam?.title} • {s.exam?.subject}
              </div>
            </div>

            <div>
              {s.published ? (
                <button
                  disabled
                  className="px-4 py-2 bg-gray-400 text-white rounded-lg"
                >
                  Marks Uploaded
                </button>
              ) : (
                <button
                  onClick={() => publish(s)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Publish Marks
                </button>
              )}
            </div>
          </div>

          {/* Answers */}
          <div className="mt-4 space-y-4">
            {s.answers.map((a, idx) => (
              <div
                key={idx}
                className="p-4 bg-gray-50 border rounded-lg shadow-sm"
              >
                <div className="font-medium text-gray-800">
                  {idx + 1}. {a.question?.text}
                </div>

                <div className="text-sm mt-1 text-gray-700">
                  <b>Answer:</b>{" "}
                  {a.textAnswer?.trim()
                    ? a.textAnswer
                    : a.chosenOptionValue
                    ? a.chosenOptionValue
                    : "Not Answered"}
                </div>

                <div className="mt-3 flex items-center gap-3">
                  <label className="text-sm text-gray-600">Manual marks:</label>
                  <input
                    type="number"
                    className="w-24 p-2 border rounded-lg"
                    value={a.manualMarks ?? ""}
                    onChange={(e) =>
                      updateAnswerMark(s._id, idx, e.target.value)
                    }
                  />
                  <span className="text-sm text-gray-500">
                    Auto: {a.autoMarks || 0}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
