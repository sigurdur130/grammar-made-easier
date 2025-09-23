
import { SidebarFooter } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { GraduationCap } from "lucide-react";

export function LearnWithTeacher() {
  return (
    <SidebarFooter className="">
      <Button
        variant="ghost"
        size="sm"
        asChild
        className="flex w-full justify-between"
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
