"use client";

import { updateReminderSettingsAction } from "@/actions/settings/reminders";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useServerAction } from "@/hooks/use-server-action";
import { Loader2, Save } from "lucide-react";
import { useState } from "react";
import { Divider, Panel, SettingRow } from "./components";

export type ReminderSettingsData = {
  senderName: string;
  sendingHour: number;
};

const DEFAULT_SETTINGS: ReminderSettingsData = {
  senderName: "Tabzo",
  sendingHour: 9,
};

export function ReminderSettings({
  initial = DEFAULT_SETTINGS,
}: {
  initial?: ReminderSettingsData;
}) {
  const [senderName, setSenderName] = useState(initial.senderName);
  const [sendingHour, setSendingHour] = useState(initial.sendingHour);
  const [hourError, setHourError] = useState("");
  const { call: saveSettings, loading: saving } = useServerAction(
    updateReminderSettingsAction,
  );

  function handleHourChange(value: string) {
    const hour = Number(value);
    setSendingHour(hour);
    setHourError(
      Number.isInteger(hour) && hour >= 0 && hour <= 23
        ? ""
        : "Choose an hour between 0 and 23.",
    );
  }

  function handleSave() {
    if (!Number.isInteger(sendingHour) || sendingHour < 0 || sendingHour > 23) {
      setHourError("Choose an hour between 0 and 23.");
      return;
    }

    saveSettings({ senderName, sendingHour });
  }

  return (
    <Panel>
      <SettingRow
        title="Sender name"
        desc="The name clients see on reminder emails."
      >
        <div className="flex items-center gap-2">
          <Label htmlFor="reminder-sender-name" className="sr-only">
            Sender name
          </Label>
          <Input
            id="reminder-sender-name"
            value={senderName}
            onChange={(event) => setSenderName(event.target.value)}
            placeholder="Tabzo"
            className="w-44"
          />
        </div>
      </SettingRow>
      <Divider />
      <SettingRow
        title="Sending time"
        desc="The hour when daily reminders are sent, in your server time zone."
      >
        <div className="flex items-center justify-end gap-2">
          <Label htmlFor="reminder-sending-hour" className="sr-only">
            Sending hour
          </Label>
          <Input
            id="reminder-sending-hour"
            type="number"
            min={0}
            max={23}
            step={1}
            value={sendingHour}
            onChange={(event) => handleHourChange(event.target.value)}
            className="w-20"
            aria-invalid={!!hourError}
            aria-label="Sending hour"
          />
          <span className="text-sm text-muted-foreground">:00 UTC</span>
        </div>
        {hourError && (
          <p className="mt-1 text-xs text-destructive">{hourError}</p>
        )}
      </SettingRow>
      <Divider />
      <div className="flex justify-end p-4">
        <Button onClick={handleSave} disabled={saving || !!hourError}>
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Save reminder settings
        </Button>
      </div>
    </Panel>
  );
}
