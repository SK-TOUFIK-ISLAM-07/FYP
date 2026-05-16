import React from "react";
import { Link } from "react-router-dom";

export default function StudentDashboard() {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Link
        to="/student/available"
        className="p-6 bg-white border border-gray-200 rounded-xl shadow hover:shadow-lg transition block"
      >
        <div className="text-lg font-semibold text-gray-800">
          Available Exams
        </div>
        <div className="text-sm text-gray-600">See scheduled exams</div>
      </Link>

      <Link
        to="/student/marks"
        className="p-6 bg-white border border-gray-200 rounded-xl shadow hover:shadow-lg transition block"
      >
        <div className="text-lg font-semibold text-gray-800">
          View Results
        </div>
        <div className="text-sm text-gray-600">Your published marks</div>
      </Link>
    </div>
  );
}
