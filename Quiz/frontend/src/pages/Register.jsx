import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const { register } = useAuth()
  const nav = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('student')
  const [err, setErr] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setErr('')
    try {
      const u = await register({ name, email, password, role })
      if (u.role === 'student') nav('/student/dashboard')
      else if (u.role === 'teacher') nav('/teacher/dashboard')
      else nav('/admin/dashboard')
    } catch (e) {
      setErr(e?.response?.data?.message || 'Registration failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow p-8">
        <h1 className="text-2xl font-bold mb-4 text-center">Create account</h1>
        {err && <div className="text-red-600 mb-3 text-center">{err}</div>}
        <form onSubmit={submit} className="space-y-3">
          <input className="w-full border rounded p-3" placeholder="Full name" value={name} onChange={e=>setName(e.target.value)} />
          <input className="w-full border rounded p-3" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
          <input className="w-full border rounded p-3" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
          <select className="w-full border rounded p-3" value={role} onChange={e=>setRole(e.target.value)}>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="admin">Admin</option>
          </select>
          <button className="w-full bg-indigo-600 text-white p-3 rounded">Sign up</button>
        </form>
        <p className="text-center text-sm mt-4">Already have an account? <Link to="/login" className="text-indigo-600">Login</Link></p>
      </div>
    </div>
  )
}
