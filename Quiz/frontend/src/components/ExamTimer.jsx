import React, { useEffect, useState } from 'react'

export default function ExamTimer({ durationMinutes, onExpire }) {
  const total = Math.max(1, Math.floor((durationMinutes || 60) * 60))
  const [remaining, setRemaining] = useState(total)

  useEffect(() => {
    setRemaining(total)
    const id = setInterval(() => {
      setRemaining(r => {
        if (r <= 1) {
          clearInterval(id)
          onExpire && onExpire()
          return 0
        }
        return r - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [durationMinutes])

  const mm = String(Math.floor(remaining / 60)).padStart(2, '0')
  const ss = String(remaining % 60).padStart(2, '0')

  return (
    <div className="inline-flex items-center gap-4 bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" aria-hidden />
        <div className="text-sm font-medium text-gray-700">Time left</div>
      </div>
      <div className="font-mono text-lg bg-gray-50 border border-gray-100 rounded px-3 py-1 shadow-inner">
        {mm}:{ss}
      </div>
    </div>
  )
}
