import React, { useEffect, useState } from "react";
import api from "../../utils/api";

export default function MarksPage() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    api.get("/student/marks").then((res) => setRows(res.data));
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-5 text-gray-800">Your Marks</h2>

      <div className="space-y-4">
        {rows.map((r) => (
          <div
            key={r._id}
            className="p-5 bg-white border border-gray-200 rounded-xl shadow hover:shadow-md transition"
          >
            <p className="text-lg font-medium text-gray-800">{r.exam?.title}</p>
            <p className="text-gray-600">{r.exam?.subject}</p>

            <div className="mt-2 flex items-center gap-3">
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${
                  r.published
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {r.published ? "Published" : "Pending"}
              </span>

              <div className="text-gray-700">
                Marks:{" "}
                <b>{r.published ? r.totalMarks : "--"}</b>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
