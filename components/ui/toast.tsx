import * as React from "react"
import { VariantProps, cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-4 pr-6 shadow-lg transition-all",
  {
    variants: {
      variant: {
        default: "bg-white text-black border",
        destructive:
          "destructive group bg-red-600 text-white border-red-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Toast = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
  return (
    <div ref={ref} className={cn(toastVariants({ variant }), className)} {...props} />
  )
})
Toast.displayName = "Toast"

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>

const useToast = () => {
  const [toasts, setToasts] = React.useState<ToastProps[]>([])

  const toast = (props: ToastProps) => {
    setToasts([...toasts, props])
    setTimeout(() => {
      setToasts((prev) => prev.slice(1))
    }, 3000)
  }

  const ToastContainer = () => (
    <div className="fixed bottom-4 right-4 space-y-2 z-50">
      {toasts.map((t, i) => (
        <Toast key={i} {...t} />
      ))}
    </div>
  )

  return { toast, ToastContainer }
}

export { Toast, useToast }
