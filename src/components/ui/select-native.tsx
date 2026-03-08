import * as React from "react"

import { cn } from "@/lib/utils"

function SelectNative({ className, ...props }: React.ComponentProps<"select">) {
  return (
    <select
      data-slot="select-native"
      className={cn(
        "border-input bg-background h-10 w-full rounded-md border px-3 py-2 text-sm shadow-xs focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none",
        className
      )}
      {...props}
    />
  )
}

export { SelectNative }
