"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import {
  AlarmClock,
  CheckCircle,
  FileCheckCorner,
  LayoutDashboard,
  LogOut,
  MessageCircleQuestionMark,
  Moon,
  Settings,
  Sun,
  Users2,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "../logo";
import { useFeedbackModal } from "../modals/feedback-modal/use-feedback-modal";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export const AppSidebar: React.FC<{
  subscription: {
    isTrial: boolean;
  };
  user: {
    image?: string;
    name: string;
    email: string;
  };
}> = ({ subscription, user }) => {
  const { openDialog: openFeedbackDialog } = useFeedbackModal();
  const path = usePathname();
  const router = useRouter();
  const { open } = useSidebar();
  const { setTheme, theme } = useTheme();

  return (
    <Sidebar id="onborda-sidebar" collapsible="icon">
      <SidebarContent>
        <SidebarHeader>
          <Logo variant="white" />
        </SidebarHeader>
        <SidebarSeparator />
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => router.push("/app")}
                className={cn(
                  "cursor-pointer",
                  path === "/app"
                    ? "text-foreground bg-secondary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/40",
                )}
              >
                <LayoutDashboard />
                <span>Overview</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => router.push("/app/requests")}
                className={cn(
                  "cursor-pointer",
                  path.startsWith("/app/requests")
                    ? "text-foreground bg-secondary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/40",
                )}
              >
                <CheckCircle />
                <span>Requests</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => router.push("/app/templates")}
                className={cn(
                  "cursor-pointer",
                  path.startsWith("/app/templates")
                    ? "text-foreground bg-secondary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/40",
                )}
              >
                <FileCheckCorner />
                <span>Templates</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => router.push("/app/clients")}
                className={cn(
                  "cursor-pointer",
                  path.startsWith("/app/clients")
                    ? "text-foreground bg-secondary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/40",
                )}
              >
                <Users2 />
                <span>Clients</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => router.push("/app/reminders")}
                className={cn(
                  "cursor-pointer",
                  path.startsWith("/app/reminders")
                    ? "text-foreground bg-secondary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/40",
                )}
              >
                <AlarmClock />
                <span>Automated Reminders</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {open && (
          <SidebarFooter className="mt-auto pb-0">
            {/* {subscription.isTrial && (
              <>
                <Card className="w-full bg-blue-200 border-blue-300/50">
                  <CardHeader>
                    <CardTitle className="text-sm">Free Plan</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button
                      onClick={() => router.push(`/app/billing`)}
                      className="mt-2 w-full"
                    >
                      Upgrade Now
                    </Button>
                  </CardContent>
                </Card>
                <Separator />
              </>
            )} */}
            <SidebarMenu>
              <SidebarMenuItem className="mb-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton className="cursor-pointer w-full h-auto">
                      <Avatar>
                        <AvatarImage src={user.image} alt={user.name} />
                        <AvatarFallback>
                          {user.name.substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-sm">
                          {user.name || "Your Profile"}
                        </div>
                        <div className="text-[10px] text-muted-foreground truncate max-w-40">
                          {user.email}
                        </div>
                      </div>
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className=" max-h-none"
                    align="end"
                    forceMount
                  >
                    <DropdownMenuItem>
                      <Avatar>
                        <AvatarImage src={user.image} alt={user.name} />
                        <AvatarFallback>
                          {user.name.substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-sm">
                          {user.name || "Your Profile"}
                        </div>
                        <div className="text-[10px] text-muted-foreground truncate max-w-40">
                          {user.email}
                        </div>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem
                        onClick={() => router.push(`/app/settings`)}
                      >
                        <Settings /> Settings
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openFeedbackDialog()}>
                        <MessageCircleQuestionMark /> Support
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          setTheme(theme === "dark" ? "light" : "dark")
                        }
                      >
                        {theme === "light" ? <Moon /> : <Sun />} Switch to{" "}
                        {theme === "light" ? "Dark" : "Light"} Mode
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => signOut({ callbackUrl: "/" })}
                      >
                        <LogOut /> Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        )}
      </SidebarContent>
    </Sidebar>
  );
};
