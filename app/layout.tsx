import "@/styles/globals.css"
import { Toaster } from "sonner"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        {children}
        <Toaster /> {/* Esto permite mostrar los toast */}
      </body>
    </html>
  )
}
