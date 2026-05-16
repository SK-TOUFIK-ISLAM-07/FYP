import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setErr('')
    try {
      const u = await login(email, password)
      if (u.role === 'student') nav('/student/dashboard')
      else if (u.role === 'teacher') nav('/teacher/dashboard')
      else nav('/admin/dashboard')
    } catch (e) {
      setErr(e?.response?.data?.message || 'Login failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-indigo-100 to-purple-100 px-4">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl p-8 border border-indigo-100">

        {/* Header Section */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">
            Quiz Portal Login
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Access your test dashboard as Student, Teacher, or Admin
          </p>
        </div>

        {/* Error Message */}
        {err && (
          <div className="text-red-600 mb-4 text-center font-medium bg-red-50 p-2 rounded">
            {err}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={submit} className="space-y-4">
          <input
            className="w-full border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 rounded-lg p-3 text-gray-800 placeholder-gray-500 transition"
            placeholder="Email"
            value={email}
            onChange={e=>setEmail(e.target.value)}
          />

          <input
            className="w-full border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 rounded-lg p-3 text-gray-800 placeholder-gray-500 transition"
            type="password"
            placeholder="Password"
            value={password}
            onChange={e=>setPassword(e.target.value)}
          />

          <button
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-lg font-semibold shadow-md transition"
          >
            Login
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm mt-5 text-gray-600">
          No account?
          <Link className="text-indigo-600 font-medium hover:underline ml-1" to="/register">
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}
