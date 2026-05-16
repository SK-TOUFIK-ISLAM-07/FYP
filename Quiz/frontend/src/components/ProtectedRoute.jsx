import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children, allowed }) {
  const { user, loading } = useAuth()
  if (loading) return (
    <div className="min-h-[200px] flex items-center justify-center">
      <div className="flex items-center gap-3">
        <svg className="w-5 h-5 animate-spin text-indigo-600" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeOpacity="0.25"/><path d="M22 12a10 10 0 00-10-10" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/></svg>
        <span className="text-sm text-gray-600">Loading...</span>
      </div>
    </div>
  )
  if (!user) return <Navigate to="/login" replace />
  if (allowed && !allowed.includes(user.role)) return <Navigate to="/login" replace />
  return children
}
