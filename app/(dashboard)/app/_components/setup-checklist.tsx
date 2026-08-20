"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bell,
  Check,
  ChevronRight,
  MapPin,
  MessageSquare,
  Mic,
} from "lucide-react";
import { useState } from "react";

export default function SetupChecklist() {
  const [completed, setCompleted] = useState({
    notifications: false,
    voice: false,
  });

  const markDone = (key: keyof typeof completed) =>
    setCompleted((c) => ({ ...c, [key]: true }));

  const items = [
    // Already done — locked success items
    {
      id: "location_added",
      done: true,
      locked: true,
      label: "First location added",
      desc: "Your business is connected and ready.",
      icon: MapPin,
    },
    {
      id: "ai_active",
      done: true,
      locked: true,
      label: "AI replies active",
      desc: "Percevo is generating responses automatically.",
      icon: MessageSquare,
    },
    // Action items
    {
      id: "notifications",
      done: completed.notifications,
      locked: false,
      label: "Enable notifications",
      desc: "Get notified when new reviews arrive.",
      icon: Bell,
      priority: "high",
      action: () => {},
    },
    {
      id: "voice",
      done: completed.voice,
      locked: false,
      label: "Refine brand voice",
      desc: "Make replies sound more like your business.",
      icon: Mic,
      action: () => {},
    },
    {
      id: "location",
      done: false,
      locked: false,
      label: "Add another location",
      desc: "Manage multiple branches from one place.",
      icon: MapPin,
      action: () => {},
    },
  ];

  const doneCount = items.filter((i) => i.done).length;
  const pct = Math.round((doneCount / items.length) * 100);

  return (
    <Card className="h-min">
      <CardHeader>
        <CardTitle>Improve your reply system</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between text-xs text-gray-400 mb-1.5">
          <span>
            {doneCount} of {items.length} done
          </span>
          <span>{pct}%</span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#2B4ACF] rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>

        <div className="divide-y divide-gray-100">
          {items.map((item) => (
            <div
              key={item.id}
              className={`flex items-center gap-3 py-4 ${!item.locked && !item.done ? "hover:bg-gray-50 cursor-pointer transition-colors" : ""}`}
              onClick={!item.locked && !item.done ? item.action : undefined}
            >
              {/* Check circle */}
              <div
                className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                  item.done ? "bg-[#2B4ACF]" : "border-2 border-gray-300"
                }`}
              >
                {item.done && <Check size={12} className="text-white" />}
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p
                    className={`text-sm font-semibold ${item.done ? "text-gray-400 line-through" : "text-gray-800"}`}
                  >
                    {item.label}
                  </p>
                  {item.priority === "high" && !item.done && (
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-full">
                      Recommended
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
              </div>

              {/* Arrow */}
              {!item.locked && !item.done && (
                <ChevronRight
                  size={15}
                  className="text-gray-300 shrink-0 mt-1"
                />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
