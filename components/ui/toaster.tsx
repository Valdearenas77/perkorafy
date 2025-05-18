"use client"

import { useToast } from "./toast"

export function Toaster() {
  const { ToastContainer } = useToast()
  return <ToastContainer />
}
