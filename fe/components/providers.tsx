"use client";

import { ThemeProvider } from "next-themes";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { WorkspaceProvider } from "@/lib/store";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <TooltipProvider>
        <WorkspaceProvider>
          {children}
          <Toaster position="top-right" />
        </WorkspaceProvider>
      </TooltipProvider>
    </ThemeProvider>
  );
}
