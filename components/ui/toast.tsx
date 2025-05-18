import * as React from "react"
import { cn } from "@/lib/utils"

export interface ToastProps {
  title: string
  variant?: "default" | "destructive"
}

export const Toast = ({ title, variant = "default" }: ToastProps) => {
  return (
    <div
      className={cn(
        "p-4 rounded-md shadow-md text-white text-sm font-medium",
        variant === "destructive" ? "bg-red-600" : "bg-green-600"
      )}
    >
      {title}
    </div>
  )
}
