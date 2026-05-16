import React, { useState } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const MENUS = {
  student: [
    { to: '/student/dashboard', label: 'Dashboard', icon: '🏠' },
    { to: '/student/available', label: 'Available Exams', icon: '📝' },
    { to: '/student/marks', label: 'Results', icon: '📊' }
  ],
  teacher: [
    { to: '/teacher/dashboard', label: 'Dashboard', icon: '🏠' },
    { to: '/teacher/questions', label: 'Question Bank', icon: '📚' },
    { to: '/teacher/create-exam', label: 'Create Exam', icon: '➕' },
    { to: '/teacher/responses', label: 'Responses', icon: '📥' }
  ],
  admin: [
    { to: '/admin/dashboard', label: 'Dashboard', icon: '🏠' }
  ]
}

export default function DashboardLayout({ role }) {
  const [open, setOpen] = useState(true)
  const { user, logout } = useAuth()
  const location = useLocation()

  return (
    <div className="min-h-screen flex bg-gray-100">

      {/* SIDEBAR */}
      <aside
        className={`${open ? 'w-64' : 'w-20'} 
        bg-white shadow-xl border-r transition-all duration-300 flex flex-col relative`}
      >
        {/* Logo & Toggle */}
        <div className="flex items-center justify-between p-4 border-b bg-white">
          <div className="flex items-center gap-2">
            <div className="text-indigo-600 font-bold text-xl">🧭</div>
            {open && (
              <span className="text-lg font-bold tracking-wide text-gray-700">
                Online Exam
              </span>
            )}
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="p-2 rounded-lg hover:bg-gray-100 transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2"
              viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {MENUS[role].map(m => {
            const active = location.pathname === m.to
            return (
              <Link
                key={m.to}
                to={m.to}
                className={`
                  flex items-center gap-3 px-3 py-3 rounded-lg font-medium transition
                  ${active 
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'
                  }
                `}
              >
                <span className="text-xl">{m.icon}</span>
                {open && <span>{m.label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Footer (small on collapsed) */}
        <div className="p-4 border-t text-xs text-gray-500">
          {open ? "© 2025 Exam System" : "©25"}
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col">

        {/* NAVBAR */}
        <header className="bg-white shadow-sm border-b px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="text-lg font-semibold text-gray-800 capitalize">
            {role} Panel
          </div>

          <div className="flex items-center gap-4">

            {/* User info */}
            <div className="text-right hidden md:block">
              <div className="font-medium text-gray-700">{user?.name}</div>
              <div className="text-xs text-gray-500">({user?.role})</div>
            </div>

            {/* Avatar */}
            <div className="w-10 h-10 flex items-center justify-center bg-indigo-100 text-indigo-700 rounded-full font-semibold text-sm">
              {user?.name?.substring(0, 1).toUpperCase()}
            </div>

            {/* Logout Button */}
            <button
              onClick={logout}
              className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium shadow hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        </header>

        {/* CONTENT */}
        <main className="p-6">
          <div className="mx-auto w-full max-w-6xl">
            <Outlet />
          </div>
        </main>

      </div>
    </div>
  )
}
