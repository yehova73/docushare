"use client";

import { cn } from "@/lib/utils";
import {
  AlarmClock,
  AlertOctagon,
  CheckCircle,
  FileText,
  UserX,
} from "lucide-react";
import { match } from "ts-pattern";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export type StatProp = {
  title: string;
  label?: string;
  stat: React.ReactNode;
  icon?: React.ReactNode;
  tooltip?: string;
  color?: {
    background?: string;
    icon?: string;
  };
  size?: "default" | "small";
};
export const StatUI: React.FC<StatProp> = ({
  color,
  label,
  stat,
  title,
  icon,
  size = "default",
}) => (
  <Card className={cn("gap-0 !py-4", color?.background)}>
    <CardHeader className="!px-4 !gap-0">
      <CardTitle className="text-sm font-medium text-muted-foreground">
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent className="!px-4 relative">
      <div className="flex justify-between items-center">
        <div
          className={cn(
            "font-bold text-foreground/80",
            size === "default" ? "text-3xl" : "text-xl",
          )}
        >
          {stat}
        </div>
        {icon && (
          <div
            className={cn(
              "[&_svg]:size-12 [&_svg]:opacity-90 p-2 rounded-full absolute right-2 opacity-20",
              color?.icon,
            )}
          >
            {icon}
          </div>
        )}
      </div>
      <p className="text-xs text-muted-foreground mt-1">{label}</p>
    </CardContent>
  </Card>
);

export const StatsSkeleton: React.FC<{ cnt: number }> = ({ cnt = 4 }) => {
  return (
    <div className="grid gap-6 md:grid-cols-4">
      {/* Total Tasks */}
      {Array.from({ length: cnt }).map((_, i) => (
        <Card key={i} className="!py-4">
          <CardHeader className="!px-4">
            <Skeleton className="h-4 w-24" />
          </CardHeader>
          <CardContent className="!px-4">
            <Skeleton className="h-8 w-16" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
