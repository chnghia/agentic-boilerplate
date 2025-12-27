import { MoonIcon, SunIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/functional/theme-provider"

export function ModeToggle() {
    const { resolvedTheme, setTheme } = useTheme()

    return (
        <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
        >
            {resolvedTheme === "dark" ? <SunIcon /> : <MoonIcon />}
        </Button>
    )
}

export default ModeToggle;