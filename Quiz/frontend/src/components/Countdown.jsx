import React, { useEffect, useState } from 'react'

export default function Countdown({ target }) {
  const [remaining, setRemaining] = useState(0)

  useEffect(()=> {
    const t = new Date(target).getTime()
    const id = setInterval(()=> {
      const now = Date.now()
      const diff = Math.max(0, t - now)
      setRemaining(diff)
    }, 1000)
    return ()=> clearInterval(id)
  }, [target])

  const sec = Math.floor(remaining / 1000)
  const d = Math.floor(sec / 86400)
  const h = Math.floor((sec % 86400) / 3600)
  const m = Math.floor((sec % 3600) / 60)
  const s = sec % 60

  if (remaining <= 0) return (
    <div className="inline-flex items-center gap-2 text-sm text-gray-600">
      <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a1 1 0 011 1v1.07a7 7 0 11-2 0V3a1 1 0 011-1zM8 10a2 2 0 104 0 2 2 0 00-4 0z"/></svg>
      <span className="font-medium">Starting soon</span>
    </div>
  )

  return (
    <div className="inline-flex items-center gap-2 text-sm text-gray-700 bg-white/80 border border-gray-200 rounded-md px-3 py-1 shadow-sm">
      <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l2 2"/><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.36 6.36l-.7-.7M6.34 6.34l-.7-.7m12.02 0l-.7.7M6.34 17.66l-.7.7"/></svg>
      <span className="font-medium">
        {d>0 ? `${d}d ` : ''}{String(h).padStart(2,'0')}:{String(m).padStart(2,'0')}:{String(s).padStart(2,'0')}
      </span>
    </div>
  )
}
