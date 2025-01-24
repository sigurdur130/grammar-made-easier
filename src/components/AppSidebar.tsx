import { useQuery } from "@tanstack/react-query";
import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
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
  SidebarMenuSkeleton,
} from "@/components/ui/sidebar";
import { useState } from "react";

export function AppSidebar() {
  const navigate = useNavigate();
  const [openCategories, setOpenCategories] = useState<string[]>([]);

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["wordCategories"],
    queryFn: async () => {
      console.log("Fetching word categories...");
      const { data, error } = await supabase
        .from("word_categories")
        .select("word_category");
      if (error) {
        console.error("Error fetching categories:", error);
        throw error;
      }
      console.log("Fetched categories:", data);
      return data;
    },
  });

  const { data: subcategories, isLoading: subcategoriesLoading } = useQuery({
    queryKey: ["subcategories"],
    queryFn: async () => {
      console.log("Fetching subcategories...");
      const { data, error } = await supabase
        .from("subcategories")
        .select("subcategory, word_category");
      if (error) {
        console.error("Error fetching subcategories:", error);
        throw error;
      }
      console.log("Fetched subcategories:", data);
      return data;
    },
  });

  const toggleCategory = (category: string) => {
    setOpenCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  if (categoriesLoading || subcategoriesLoading) {
    return (
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {[1, 2, 3].map((i) => (
                  <SidebarMenuSkeleton key={i} showIcon />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    );
  }

  if (!categories?.length) {
    console.log("No categories found");
    return (
      <Sidebar>
        <SidebarContent>
          <div className="p-4 text-sm text-muted-foreground">
            No categories available
          </div>
        </SidebarContent>
      </Sidebar>
    );
  }

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {categories?.map((category) => (
                <SidebarMenuItem key={category.word_category}>
                  <SidebarMenuButton
                    onClick={() => toggleCategory(category.word_category)}
                    className={openCategories.includes(category.word_category) ? "bg-accent" : ""}
                  >
                    <span>{category.word_category}</span>
                    <ChevronDown 
                      className={`ml-auto h-4 w-4 transition-transform duration-300 ease-in-out ${
                        openCategories.includes(category.word_category) ? "rotate-180" : ""
                      }`}
                    />
                  </SidebarMenuButton>
                  <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    openCategories.includes(category.word_category) ? "max-h-96" : "max-h-0"
                  }`}>
                    <SidebarMenuSub>
                      {subcategories
                        ?.filter(
                          (sub) => sub.word_category === category.word_category
                        )
                        .map((sub) => (
                          <SidebarMenuSubButton
                            key={sub.subcategory}
                            onClick={() =>
                              navigate(
                                `/exercises/${category.word_category}/${sub.subcategory}`
                              )
                            }
                            className="cursor-pointer hover:underline"
                          >
                            {sub.subcategory}
                          </SidebarMenuSubButton>
                        ))}
                    </SidebarMenuSub>
                  </div>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}