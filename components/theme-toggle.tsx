"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent/50">
        <Sun className="h-4 w-4 text-muted-foreground" />
        <Switch disabled checked={false} />
        <Moon className="h-4 w-4 text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent/50 border border-border/50">
      <Sun className={`h-4 w-4 transition-colors ${theme === "light" ? "text-primary" : "text-muted-foreground"}`} />
      <Switch
        checked={theme === "dark"}
        onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
        aria-label="Toggle theme"
      />
      <Moon className={`h-4 w-4 transition-colors ${theme === "dark" ? "text-primary" : "text-muted-foreground"}`} />
      <span className="sr-only">Toggle theme</span>
    </div>
  )
}
