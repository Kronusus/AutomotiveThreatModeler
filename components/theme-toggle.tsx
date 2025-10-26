"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Switch } from "@/components/ui/switch";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-border bg-background/50">
        <Sun className="h-4 w-4 text-muted-foreground" />
        <Switch disabled checked={false} />
        <Moon className="h-4 w-4 text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-border bg-background/50 hover:bg-accent/50 transition-colors">
      <Sun className={`h-4 w-4 transition-all ${theme === "light" ? "text-yellow-500 scale-110" : "text-muted-foreground/60"}`} />
      <Switch
        checked={theme === "dark"}
        onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
        aria-label="Toggle theme"
      />
      <Moon className={`h-4 w-4 transition-all ${theme === "dark" ? "text-blue-400 scale-110" : "text-muted-foreground/60"}`} />
      <span className="sr-only">Toggle theme</span>
    </div>
  )
}
