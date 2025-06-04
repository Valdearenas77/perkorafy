"use client"

import * as React from "react"
import { Check, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const Select = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof PopoverTrigger>
>(({ className, children, ...props }, ref) => (
  <Popover>
    <PopoverTrigger ref={ref} className={className} {...props}>
      {children}
    </PopoverTrigger>
  </Popover>
))
Select.displayName = "Select"

const SelectTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<"button">
>(({ className, children, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    {...props}
  >
    {children}
    <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
  </button>
))
SelectTrigger.displayName = "SelectTrigger"

const SelectValue = ({ children }: { children: React.ReactNode }) => {
  return <span>{children}</span>
}
SelectValue.displayName = "SelectValue"

const SelectContent = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => (
  <PopoverContent className={cn("p-0", className)}>
    <Command>{children}</Command>
  </PopoverContent>
)
SelectContent.displayName = "SelectContent"

const SelectItem = ({
  children,
  onSelect,
  className,
  selected,
}: {
  children: React.ReactNode
  onSelect: () => void
  className?: string
  selected?: boolean
}) => (
  <CommandItem
    onSelect={onSelect}
    className={cn("flex items-center justify-between", className)}
  >
    {children}
    {selected && <Check className="h-4 w-4" />}
  </CommandItem>
)
SelectItem.displayName = "SelectItem"

export {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
}
