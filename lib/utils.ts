import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: (string | undefined | false)[]): string {
  return inputs.filter(Boolean).join(" ")
}

