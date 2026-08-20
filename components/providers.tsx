"use client";

import { TooltipProvider } from "@/components/ui/tooltip";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { AuthModal } from "./modals/auth-modal/auth-modal";

export const GeneralProviders: React.FC<React.PropsWithChildren> = ({
  children,
}) => (
  <SessionProvider>
    <TooltipProvider>
      <TooltipProvider>{children}</TooltipProvider>
      <AuthModal />
      <Toaster className="![--width:400px]" />
    </TooltipProvider>
  </SessionProvider>
);

export const PublicProviders: React.FC<React.PropsWithChildren> = ({
  children,
}) => (
  <ThemeProvider
    attribute={"class"}
    defaultTheme="light"
    forcedTheme="light"
    enableSystem={false}
  >
    {children}
  </ThemeProvider>
);

export const DashboardProviders: React.FC<React.PropsWithChildren> = ({
  children,
}) => (
  <ThemeProvider attribute={"class"} defaultTheme="dark">
    {children}
  </ThemeProvider>
);
