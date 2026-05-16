import React, { useEffect } from 'react'

export default function Toast({ id, message, type = 'info', onClose }) {
  useEffect(() => {
    const t = setTimeout(() => onClose(id), 3500)
    return () => clearTimeout(t)
  }, [id, onClose])

  const bg = type === 'success' ? 'bg-green-600' : type === 'error' ? 'bg-red-600' : 'bg-gray-800'
  const icon = type === 'success'
    ? (<svg className="w-4 h-4 mr-2" viewBox="0 0 20 20" fill="none" stroke="currentColor"><path d="M5 10l3 3L15 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>)
    : type === 'error'
      ? (<svg className="w-4 h-4 mr-2" viewBox="0 0 20 20" fill="none" stroke="currentColor"><path d="M6 6l8 8M14 6l-8 8" strokeWidth="2" strokeLinecap="round"/></svg>)
      : (<svg className="w-4 h-4 mr-2" viewBox="0 0 20 20" fill="none" stroke="currentColor"><path d="M9 12l2 2 4-4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>)

  return (
    <div className={`${bg} text-white px-4 py-2 rounded-lg shadow-md flex items-center gap-2 max-w-xs`}>
      {icon}
      <div className="text-sm leading-tight">{message}</div>
    </div>
  )
}
