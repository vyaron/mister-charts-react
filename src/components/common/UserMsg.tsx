import { useEffect, useState, useCallback } from 'react'

// Event-based messaging system
const listeners: Set<(msg: string) => void> = new Set()

export function showUserMsg(msg: string) {
  listeners.forEach((listener) => listener(msg))
}

export function UserMsg() {
  const [message, setMessage] = useState('')
  const [visible, setVisible] = useState(false)

  const handleMessage = useCallback((msg: string) => {
    setMessage(msg)
    setVisible(true)
    setTimeout(() => setVisible(false), 2000)
  }, [])

  useEffect(() => {
    listeners.add(handleMessage)
    return () => {
      listeners.delete(handleMessage)
    }
  }, [handleMessage])

  return (
    <div className={`user-msg ${visible ? 'visible' : ''}`}>
      {message}
    </div>
  )
}
