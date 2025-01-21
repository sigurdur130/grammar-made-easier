import { useQuery } from "@tanstack/react-query";
import { ChevronDown, Folder } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";

export function AppSidebar() {
  const { data: categories } = useQuery({
    queryKey: ["wordCategories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("word_categories")
        .select("word_category");
      if (error) throw error;
      return data;
    },
  });

  const { data: subcategories } = useQuery({
    queryKey: ["subcategories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subcategories")
        .select("subcategory, word_category");
      if (error) throw error;
      return data;
    },
  });

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {categories?.map((category) => (
                <SidebarMenuItem key={category.word_category}>
                  <SidebarMenuButton>
                    <Folder className="h-4 w-4" />
                    <span>{category.word_category}</span>
                    <ChevronDown className="ml-auto h-4 w-4" />
                  </SidebarMenuButton>
                  <SidebarMenuSub>
                    {subcategories
                      ?.filter(
                        (sub) => sub.word_category === category.word_category
                      )
                      .map((sub) => (
                        <SidebarMenuSubButton key={sub.subcategory}>
                          {sub.subcategory}
                        </SidebarMenuSubButton>
                      ))}
                  </SidebarMenuSub>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}