
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { Link } from "react-router-dom";

export function MobileNavbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 h-12 bg-background/90 backdrop-blur-sm border-b z-40 md:hidden">
      <div className="container h-full flex items-center justify-between px-4">
        <div className="flex-1">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-lg font-semibold">Grammar made easi(er)</span>
            <img src="/logo.png" alt="Logo" className="h-6 w-6" />
          </Link>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full absolute right-4"
          asChild
        >
          <SidebarTrigger>
            <Menu className="h-5 w-5"/>
          </SidebarTrigger>
        </Button>
      </div>
    </nav>
  );
}
