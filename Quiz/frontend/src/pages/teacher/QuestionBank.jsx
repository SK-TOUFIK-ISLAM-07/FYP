import React, { useEffect, useState } from "react";
import api from "../../utils/api";

export default function QuestionBank() {
  const [items, setItems] = useState([]);
  const [filters, setFilters] = useState({
    subject: "",
    type: "",
    difficulty: "",
  });
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    subject: "",
    type: "mcq",
    text: "",
    options: ["", "", "", ""],
    correctOption: 0,
    marks: 1,
    difficulty: "medium",
  });

  const load = async () => {
    const q = new URLSearchParams(filters);
    const res = await api
      .get(`/questions?${q.toString()}`)
      .catch(() => ({ data: [] }));
    setItems(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (e) => {
    e.preventDefault();

    try {
      if (editing) {
        await api.put(`/questions/${editing}`, form);
        setEditing(null);
      } else {
        await api.post("/questions", form);
      }

      setForm({
        subject: "",
        type: "mcq",
        text: "",
        options: ["", "", "", ""],
        correctOption: 0,
        marks: 1,
        difficulty: "medium",
      });

      await load();
      window.__showToast && window.__showToast("Saved", "success");
    } catch (err) {
      window.__showToast && window.__showToast("Error", "error");
    }
  };

  const startEdit = (q) => {
    setEditing(q._id);
    setForm({
      subject: q.subject || "",
      type: q.type || "mcq",
      text: q.text || "",
      options: q.options && q.options.length ? q.options : ["", "", "", ""],
      correctOption: q.correctOption || 0,
      marks: q.marks || 1,
      difficulty: q.difficulty || "medium",
    });
  };

  const del = async (id) => {
    if (!confirm("Delete this question?")) return;
    await api.delete(`/questions/${id}`);
    load();
  };

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {/* LEFT — QUESTION LIST */}
      <div className="md:col-span-2">
        <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Question Bank</h3>

            <div className="flex gap-2">
              <select
                className="border rounded-lg p-2"
                value={filters.subject}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, subject: e.target.value }))
                }
              >
                <option value="">All Subjects</option>
                <option>Math</option>
                <option>Physics</option>
                <option>Computer Science</option>
              </select>

              <select
                className="border rounded-lg p-2"
                value={filters.type}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, type: e.target.value }))
                }
              >
                <option value="">All Types</option>
                <option value="mcq">MCQ</option>
                <option value="saq">SAQ</option>
              </select>

              <button
                onClick={load}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
              >
                Filter
              </button>
            </div>
          </div>

          {/* List */}
          <div className="space-y-4">
            {items.map((q) => (
              <div
                key={q._id}
                className="p-4 bg-gray-50 border rounded-xl flex justify-between items-start"
              >
                <div>
                  <div className="font-medium text-gray-800">{q.text}</div>
                  <div className="text-xs text-gray-600">
                    {q.subject} · {q.type.toUpperCase()} · {q.difficulty}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(q)}
                    className="px-3 py-1 bg-blue-600 text-white rounded-lg"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => del(q._id)}
                    className="px-3 py-1 bg-red-600 text-white rounded-lg"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT — ADD / EDIT FORM */}
      <div>
        <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
          <h3 className="font-semibold mb-4 text-gray-800">
            {editing ? "Edit Question" : "Add Question"}
          </h3>

          <form onSubmit={submit} className="space-y-3">
            <input
              className="w-full p-3 border rounded-lg"
              placeholder="Subject"
              value={form.subject}
              onChange={(e) =>
                setForm((f) => ({ ...f, subject: e.target.value }))
              }
            />

            <select
              className="w-full p-3 border rounded-lg"
              value={form.type}
              onChange={(e) =>
                setForm((f) => ({ ...f, type: e.target.value }))
              }
            >
              <option value="mcq">MCQ</option>
              <option value="saq">SAQ</option>
            </select>

            <textarea
              className="w-full p-3 border rounded-lg"
              placeholder="Question text"
              value={form.text}
              onChange={(e) =>
                setForm((f) => ({ ...f, text: e.target.value }))
              }
            />

            {/* MCQ OPTIONS */}
            {form.type === "mcq" &&
              form.options.map((op, i) => (
                <input
                  key={i}
                  className="w-full p-2 border rounded-lg"
                  placeholder={`Option ${i + 1}`}
                  value={form.options[i]}
                  onChange={(e) => {
                    const arr = [...form.options];
                    arr[i] = e.target.value;
                    setForm((f) => ({ ...f, options: arr }));
                  }}
                />
              ))}

            {/* CORRECT INDEX */}
            {form.type === "mcq" && (
              <div className="flex items-center gap-2">
                <label className="text-sm">Correct index</label>
                <input
                  type="number"
                  min="0"
                  max={form.options.length - 1}
                  value={form.correctOption}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      correctOption: Number(e.target.value),
                    }))
                  }
                  className="w-24 p-2 border rounded-lg"
                />
              </div>
            )}

            <div className="flex gap-2">
              <input
                className="w-24 p-2 border rounded-lg"
                type="number"
                value={form.marks}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    marks: Number(e.target.value),
                  }))
                }
              />

              <select
                className="p-2 border rounded-lg"
                value={form.difficulty}
                onChange={(e) =>
                  setForm((f) => ({ ...f, difficulty: e.target.value }))
                }
              >
                <option value="easy">easy</option>
                <option value="medium">medium</option>
                <option value="hard">hard</option>
              </select>

              <button className="px-4 py-2 bg-green-600 text-white rounded-lg">
                {editing ? "Update" : "Create"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
