import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Exercises from "./pages/Exercises";
import { ThemeProvider } from "./providers/ThemeProvider";
import { MobileNavbar } from "./components/MobileNavbar";
import { SidebarProvider, SidebarInset, useSidebar } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

const queryClient = new QueryClient();

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const { openMobile } = useSidebar();

  return (
    <div className="flex h-screen w-full">
      {/* Sidebar: always visible on desktop, slide in/out on mobile */}
      <div
        className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 md:static md:translate-x-0 ${
          openMobile ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <AppSidebar/>
      </div>

      {/* Main content */}
      <SidebarInset className="flex-1 overflow-y-auto p-6 md:p-6 pt-[calc(theme(spacing.6)_+_theme(spacing.14))]">
        {children}
      </SidebarInset>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <SidebarProvider>
            <div className="md:hidden">
              <MobileNavbar />
            </div>
            <AppLayout>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/exercises/:category/:subcategory" element={<Exercises />} />
              </Routes>
            </AppLayout>
          </SidebarProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
