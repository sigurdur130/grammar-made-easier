
import { SidebarFooter } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { GraduationCap } from "lucide-react";

export function LearnWithTeacher() {
  return (
    <SidebarFooter className="border-t border-sidebar-border">
      <Button
        variant="ghost"
        size="sm"
        asChild
        className="flex w-full justify-between px-3 py-2 px-0"
      >
        <a 
          href="https://icelandicmadeeasier.com" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          <span>Learn with us</span>
          <GraduationCap className="h-5 w-5" />
        </a>
      </Button>
    </SidebarFooter>
  );
}
