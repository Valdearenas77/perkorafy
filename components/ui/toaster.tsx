"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { Toast, ToastProps } from "./toast"

let listeners: ((toast: ToastProps) => void)[] = []

export const useToast = () => {
  return {
    toast: (toast: ToastProps) => {
      listeners.forEach((fn) => fn(toast))
    },
  }
}

export const Toaster = () => {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  useEffect(() => {
    const handler = (toast: ToastProps) => {
      setToasts((current) => [...current, toast])
      setTimeout(() => {
        setToasts((current) => current.slice(1))
      }, 3000)
    }

    listeners.push(handler)
    return () => {
      listeners = listeners.filter((l) => l !== handler)
    }
  }, [])

  return createPortal(
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((t, i) => (
        <Toast key={i} {...t} />
      ))}
    </div>,
    document.body
  )
}
