import React, { createContext, useContext, useEffect, useState } from 'react'
import api from '../utils/api'
import socket from '../utils/socket'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const nav = useNavigate()

  // Load user from localStorage
  useEffect(() => {
    const u = localStorage.getItem('user')

    if (u) {
      const parsed = JSON.parse(u)
      setUser(parsed)

      const token = localStorage.getItem('token')
      if (token) {
        socket.auth = { token }
        socket.connect()

        // Join user-specific room
        const id = parsed._id || parsed.id
        if (parsed.role === 'student') socket.emit('joinRoom', `student_${id}`)
        if (parsed.role === 'teacher') socket.emit('joinRoom', `teacher_${id}`)
        if (parsed.role === 'admin') socket.emit('joinRoom', `admin_${id}`)
      }
    }

    setLoading(false)
    return () => {}
  }, [])

  // Login handler
  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password })

    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    setUser(data.user)

    socket.auth = { token: data.token }
    socket.connect()

    const id = data.user._id || data.user.id
    if (data.user.role === 'student') socket.emit('joinRoom', `student_${id}`)
    if (data.user.role === 'teacher') socket.emit('joinRoom', `teacher_${id}`)
    if (data.user.role === 'admin') socket.emit('joinRoom', `admin_${id}`)

    return data.user
  }

  // Register handler
  const register = async ({ name, email, password, role }) => {
    await api.post('/auth/register', { name, email, password, role })

    const res = await api.post('/auth/login', { email, password })

    localStorage.setItem('token', res.data.token)
    localStorage.setItem('user', JSON.stringify(res.data.user))
    setUser(res.data.user)

    socket.auth = { token: res.data.token }
    socket.connect()

    const id = res.data.user._id || res.data.user.id
    if (res.data.user.role === 'student') socket.emit('joinRoom', `student_${id}`)
    if (res.data.user.role === 'teacher') socket.emit('joinRoom', `teacher_${id}`)
    if (res.data.user.role === 'admin') socket.emit('joinRoom', `admin_${id}`)

    return res.data.user
  }

  // Logout
  const logout = () => {
    socket.disconnect()
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    nav('/login')
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
