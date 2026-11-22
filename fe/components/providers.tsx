"use client";

import { ThemeProvider } from "next-themes";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { AuthSessionSync } from "@/components/auth-session-sync";
import { WorkspaceProvider } from "@/lib/store";
import { CommandMenu } from "@/components/command-menu";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <TooltipProvider>
        <WorkspaceProvider>
          <AuthSessionSync />
          {children}
          <CommandMenu />
          <Toaster position="top-right" />
        </WorkspaceProvider>
      </TooltipProvider>
    </ThemeProvider>
  );
}
