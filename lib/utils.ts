
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge" // ✅ correcto

export function cn(...inputs: any[]) {
  return twMerge(clsx(inputs))
}

