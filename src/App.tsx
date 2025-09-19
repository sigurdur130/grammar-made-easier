
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Exercises from "./pages/Exercises";
import { ThemeProvider } from "./providers/ThemeProvider";
import { MobileNavbar } from "./components/MobileNavbar";
import { SidebarProvider } from "./components/ui/sidebar";
import { AppSidebar } from "./components/AppSidebar";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="md:hidden">
            <SidebarProvider className="min-h-0">
              <MobileNavbar/>
              <AppSidebar/>
            </SidebarProvider>
          </div>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/exercises/:category/:subcategory" element={<Exercises />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
