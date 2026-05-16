import React, { useState } from "react";
import api from "../../utils/api";

export default function UploadQuestion() {
  const [subject, setSubject] = useState("");
  const [type, setType] = useState("mcq");
  const [text, setText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctIndex, setCorrectIndex] = useState(0);
  const [marks, setMarks] = useState(1);
  const [msg, setMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      await api.post("/questions", {
        subject,
        type,
        text,
        options: type === "mcq" ? options : [],
        correctOption: correctIndex,
        marks,
      });
      setMsg("Question uploaded");
      setSubject("");
      setType("mcq");
      setText("");
      setOptions(["", "", "", ""]);
      setCorrectIndex(0);
    } catch (e) {
      setMsg(e?.response?.data?.message || "Error");
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Upload Question
      </h2>

      {msg && <div className="mb-3 text-sm text-green-600">{msg}</div>}

      <form onSubmit={submit} className="space-y-4">
        <input
          className="w-full border rounded-lg p-3"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />

        <select
          className="w-full border rounded-lg p-3"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="mcq">MCQ</option>
          <option value="saq">SAQ</option>
        </select>

        <textarea
          className="w-full border rounded-lg p-3"
          placeholder="Question text"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        {type === "mcq" &&
          options.map((o, i) => (
            <div key={i} className="flex gap-3 items-center">
              <input
                className="flex-1 border rounded-lg p-3"
                placeholder={`Option ${i + 1}`}
                value={o}
                onChange={(e) => {
                  const a = [...options];
                  a[i] = e.target.value;
                  setOptions(a);
                }}
              />

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="correct"
                  checked={correctIndex === i}
                  onChange={() => setCorrectIndex(i)}
                />
                Correct
              </label>
            </div>
          ))}

        <div className="flex gap-3">
          <input
            className="w-24 border rounded-lg p-3"
            type="number"
            value={marks}
            onChange={(e) => setMarks(Number(e.target.value))}
          />
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
