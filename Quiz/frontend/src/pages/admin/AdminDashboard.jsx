import React, { useEffect, useRef, useState } from 'react'
import api from '../../utils/api'
import { Chart, BarController, BarElement, CategoryScale, LinearScale } from 'chart.js'
Chart.register(BarController, BarElement, CategoryScale, LinearScale)

export default function AdminDashboard() {
  const [users, setUsers] = useState([])
  const [stats, setStats] = useState([])
  const chartRef = useRef()

  useEffect(() => {
    (async () => {
      const { data: u } = await api.get('/admin/users').catch(()=>({data:[]}))
      setUsers(u)
      const { data } = await api.get('/admin/analytics').catch(()=>({ data: { perExam: [] } }))
      setStats(data.perExam || [])
      if (chartRef.current && data.perExam) {
        const labels = data.perExam.map(p => p.examTitle)
        const values = data.perExam.map(p => Math.round((p.avgMarks||0) * 100)/100)
        new Chart(chartRef.current.getContext('2d'), {
          type: 'bar',
          data: { 
            labels, 
            datasets: [{ 
              label: 'Avg Marks', 
              data: values, 
              backgroundColor: 'rgba(79,70,229,0.7)' 
            }] 
          },
          options: { responsive: true, maintainAspectRatio: false }
        })
      }
    })()
  }, [])

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 to-purple-100 p-6 md:p-10">

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">Overview of users and exam analytics</p>
      </div>

      <div className="space-y-8">

        {/* Users Section */}
        <section className="bg-white/90 backdrop-blur-xl border border-indigo-100 shadow-xl rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-5">Registered Users</h2>

          {users.length === 0 ? (
            <div className="text-gray-500 text-center py-6">No users found</div>
          ) : (
            <div className="space-y-3">
              {users.map(u => (
                <div 
                  key={u._id} 
                  className="border border-gray-200 bg-gray-50 hover:bg-gray-100 transition rounded-xl p-4 shadow-sm"
                >
                  <div className="font-medium text-gray-800">
                    {u.name}
                    <span className="text-sm text-gray-500 ml-2">({u.role})</span>
                  </div>
                  <div className="text-sm text-gray-600">{u.email}</div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Analytics Section */}
        <section className="bg-white/90 backdrop-blur-xl border border-indigo-100 shadow-xl rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-5">Exam Analytics</h2>

          <div className="h-80 bg-white rounded-xl border shadow-inner p-4">
            <canvas ref={chartRef}></canvas>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-8">
            {stats.map(s => (
              <div 
                key={s.examTitle} 
                className="bg-white border border-gray-200 rounded-xl shadow p-5 hover:shadow-md transition"
              >
                <div className="font-semibold text-gray-800">
                  {s.examTitle}
                  <span className="text-sm text-gray-500 ml-1">({s.subject})</span>
                </div>

                <div className="mt-2 text-gray-700">Avg Marks: 
                  <span className="font-medium"> {Math.round((s.avgMarks||0)*100)/100}</span>
                </div>

                <div className="text-gray-700">Total Attempts: 
                  <span className="font-medium"> {s.count}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  )
}
