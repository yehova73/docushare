"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const SettingsTabs: React.FC = () => {
  const path = usePathname();

  return (
    <div className="flex p-1 shadow border rounded-md bg-background">
      <Link href="/app/settings" passHref>
        <Button
          size="sm"
          variant={path === "/app/settings" ? "default" : "ghost"}
        >
          Account
        </Button>
      </Link>
      <Link href="/app/settings/billing" passHref>
        <Button
          size="sm"
          variant={path === "/app/settings/billing" ? "default" : "ghost"}
        >
          Billing
        </Button>
      </Link>
    </div>
  );
};
