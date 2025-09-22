
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/providers/ThemeProvider";
import { Button } from "@/components/ui/button";
import { SidebarFooter } from "@/components/ui/sidebar";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <SidebarFooter className="border-t border-sidebar-border mt-auto">
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleTheme}
        className="flex w-full justify-between py-2 px-0"
      >
        <span>Toggle theme</span>
        {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
      </Button>
    </SidebarFooter>
  );
}
