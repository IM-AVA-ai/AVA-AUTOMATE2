"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"


interface DatePickerDemoProps {
    value: Date | null;
    onChange: (date?: Date) => void;
    className?: string
  }

export function DatePickerDemo({ value, onChange, className }: DatePickerDemoProps) {

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          data-empty={!value}
          className={cn(
            "w-full border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white",
            "justify-start text-left font-normal",
            "data-[empty=true]:text-muted-foreground",
            className
          )}
        >
          <CalendarIcon />
          {value ? format(value, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={value as Date} onSelect={onChange} />
      </PopoverContent>
    </Popover>
  )
}