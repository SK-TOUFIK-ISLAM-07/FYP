import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import DashboardLayout from './layouts/DashboardLayout'
import ToastContainer from './components/ToastContainer'

// auth pages
import Login from './pages/Login'
import Register from './pages/Register'

// student
import StudentDashboard from './pages/student/StudentDashboard'
import ExamPage from './pages/student/ExamPage'
import MarksPage from './pages/student/MarksPage'
import AvailableExams from './pages/student/AvailableExams'

// teacher
import TeacherDashboard from './pages/teacher/TeacherDashboard'
import UploadQuestion from './pages/teacher/UploadQuestion'
import Responses from './pages/teacher/Responses'
import QuestionBank from './pages/teacher/QuestionBank'
import CreateExam from './pages/teacher/CreateExam'

// admin
import AdminDashboard from './pages/admin/AdminDashboard'

export default function App() {
  return (
    <AuthProvider>
      <ToastContainer />

      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Student Routes */}
        <Route
          path="/student"
          element={
            <ProtectedRoute allowed={['student']}>
              <DashboardLayout role="student" />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" />} />
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="exam" element={<ExamPage />} />
          <Route path="available" element={<AvailableExams />} />
          <Route path="marks" element={<MarksPage />} />
        </Route>

        {/* Teacher Routes */}
        <Route
          path="/teacher"
          element={
            <ProtectedRoute allowed={['teacher']}>
              <DashboardLayout role="teacher" />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" />} />
          <Route path="dashboard" element={<TeacherDashboard />} />
          <Route path="upload-question" element={<UploadQuestion />} />
          <Route path="questions" element={<QuestionBank />} />
          <Route path="create-exam" element={<CreateExam />} />
          <Route path="responses" element={<Responses />} />
        </Route>

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowed={['admin']}>
              <DashboardLayout role="admin" />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" />} />
          <Route path="dashboard" element={<AdminDashboard />} />
        </Route>

        <Route path="*" element={<div className="p-6">404 Not Found</div>} />
      </Routes>
    </AuthProvider>
  )
}
