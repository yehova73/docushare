"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  ChevronRight,
  Clock,
  FileCheck,
  FileEdit,
  FileText,
  FolderKanban,
  Globe2,
  Inbox,
  LayoutDashboard,
  LogOut,
  MessageCircleQuestionMark,
  Moon,
  Settings,
  Sun,
  Users,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import Link from "next/link";
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";

const data = {
  navMain: [
    {
      title: "Overview",
      url: "/app",
      items: [],
      icon: <LayoutDashboard />,
    },
    {
      title: "Clients",
      url: "/app/clients",
      items: [],
      icon: <Users />,
    },
    {
      title: "Requests",
      url: "#",
      icon: <FileCheck />,
      items: [
        {
          title: "Open Requests",
          url: "/app/requests",
          icon: <Inbox />,
        },
        {
          title: "Draft Requests",
          url: "/app/requests/drafts",
          icon: <FileEdit />,
        },
      ],
    },
    {
      title: "Templates",
      url: "#",
      icon: <FileText />,
      items: [
        {
          title: "Your Templates",
          url: "/app/templates",
          icon: <FolderKanban />,
        },
        {
          title: "Public Templates",
          url: "/app/templates/public",
          icon: <Globe2 />,
        },
      ],
    },
    {
      title: "Automated Reminders",
      url: "/app/reminders",
      icon: <Clock />,
    },
  ],
};

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
      <SidebarHeader>
        <Logo variant="white" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarSeparator />
        <SidebarGroup>
          <SidebarMenu>
            {data.navMain.map(
              (item) =>
                item.items?.length ? (
                  <Collapsible
                    key={item.title}
                    title={item.title}
                    defaultOpen
                    className="group/collapsible"
                  >
                    <SidebarGroupLabel
                      asChild
                      className="group/label text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    >
                      <CollapsibleTrigger
                        asChild
                        className="w-full cursor-pointer"
                      >
                        <SidebarMenuItem key={item.title}>
                          {item.icon}
                          <div className="ml-2">{item.title}</div>
                          <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuItem>
                      </CollapsibleTrigger>
                    </SidebarGroupLabel>
                    <CollapsibleContent>
                      <SidebarMenuSub className={"pr-0 mr-0"}>
                        {item.items?.map((item) => (
                          <SidebarMenuSubItem key={item?.title}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={path === item?.url}
                            >
                              <Link href={item!.url}>{item?.title}</Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </Collapsible>
                ) : (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link href={item.url} className="font-medium">
                        {item.icon}
                        {item.title}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ),
              // <SidebarMenuItem key={item.title}>
              //   <SidebarMenuButton asChild>
              //     <Link href={item.url} className="font-medium">
              //       {item.icon}
              //       {item.title}
              //     </Link>
              //   </SidebarMenuButton>
              //   {item.items?.length ? (
              //     <SidebarMenuSub className={"pr-0 mr-0"}>
              //       {item.items.map((item) => (
              //         <SidebarMenuSubItem key={item?.title}>
              //           <SidebarMenuSubButton
              //             asChild
              //             isActive={path === item?.url}
              //           >
              //             <Link href={item!.url}>{item?.title}</Link>
              //           </SidebarMenuSubButton>
              //         </SidebarMenuSubItem>
              //       ))}
              //     </SidebarMenuSub>
              //   ) : null}
              // </SidebarMenuItem>
            )}
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
