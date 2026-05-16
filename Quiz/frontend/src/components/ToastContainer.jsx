import React, { useState } from 'react'
import Toast from './Toast'

let idCounter = 1
export default function ToastContainer() {
  const [toasts, setToasts] = useState([])

  const show = (message, type = 'info') => {
    const t = { id: idCounter++, message, type }
    setToasts(s => [...s, t])
  }

  const remove = (id) => setToasts(s => s.filter(t => t.id !== id))

  if (!window.__showToast) window.__showToast = show

  return (
    <div className="fixed right-6 bottom-6 space-y-3 z-50">
      {toasts.map(t => (
        <div key={t.id} className="transform transition duration-200 ease-in-out hover:translate-y-0.5">
          <Toast {...t} onClose={remove} />
        </div>
      ))}
    </div>
  )
}
