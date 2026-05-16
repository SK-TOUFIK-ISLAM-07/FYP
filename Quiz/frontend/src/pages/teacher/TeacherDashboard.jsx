import React from "react";
import { Link } from "react-router-dom";

export default function TeacherDashboard() {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Link
        to="/teacher/questions"
        className="p-6 bg-white border border-gray-200 rounded-xl shadow hover:shadow-lg transition block"
      >
        <div className="text-lg font-semibold text-gray-800">Question Bank</div>
        <div className="text-sm text-gray-600">Manage your questions</div>
      </Link>

      <Link
        to="/teacher/create-exam"
        className="p-6 bg-white border border-gray-200 rounded-xl shadow hover:shadow-lg transition block"
      >
        <div className="text-lg font-semibold text-gray-800">Create Exam</div>
        <div className="text-sm text-gray-600">
          Manual or Auto selection
        </div>
      </Link>
    </div>
  );
}
