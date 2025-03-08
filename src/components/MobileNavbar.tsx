
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";

export function MobileNavbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 h-12 bg-background border-b z-40 md:hidden">
      <div className="container h-full flex items-center justify-between px-4">
        <div className="flex-1"></div>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          asChild
        >
          <SidebarTrigger>
            <Menu className="h-5 w-5" />
          </SidebarTrigger>
        </Button>
      </div>
    </nav>
  );
}
