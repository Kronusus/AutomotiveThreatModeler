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
      <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg border-2 border-input bg-background">
        <Sun className="h-5 w-5 text-muted-foreground" />
        <Switch disabled checked={false} />
        <Moon className="h-5 w-5 text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg border-2 border-input bg-background hover:bg-accent transition-colors">
      <Sun className={`h-5 w-5 transition-colors ${theme === "light" ? "text-yellow-500 font-bold" : "text-muted-foreground"}`} />
      <Switch
        checked={theme === "dark"}
        onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
        aria-label="Toggle theme"
      />
      <Moon className={`h-5 w-5 transition-colors ${theme === "dark" ? "text-blue-400 font-bold" : "text-muted-foreground"}`} />
      <span className="sr-only">Toggle theme</span>
    </div>
  )
}
