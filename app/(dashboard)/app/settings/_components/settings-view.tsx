"use client";
import { exportAccountDataAction } from "@/actions/account/export-data";
import { Download, KeyRound, Mail, RotateCcw, Trash2 } from "lucide-react";
import { Divider, Panel, SectionTitle, SettingRow } from "./components";
import { Switch } from "@/components/ui/switch";
import {
  ChangeEmailModal,
  ChangePasswordModal,
  DeleteAccountModal,
  ResetDataModal,
} from "./modals";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DriveFolderSelector } from "@/components/drive-folder-selector";
import { Badge } from "@/components/ui/badge";
import { BrandingSettings, BrandingSettingsData } from "./branding-settings";
import { ReminderSettings, ReminderSettingsData } from "./reminder-settings";

const DEFAULT_BRANDING: BrandingSettingsData = {
  name: null,
  logoUrl: null,
  logoKey: null,
  backgroundColor: "#0d1420",
  headerFooterColor: "#0f172a",
  primaryColor: "#6366f1",
  fieldBackgroundColor: "#0a0f1c",
  sectionCardBackgroundColor: "#0f172a",
  sectionTitleColor: "#f8fafc",
  fieldTitleColor: "#f1f5f9",
  fieldSubtitleColor: "#94a3b8",
  inputBackgroundColor: "#111a2b",
  uploadBackgroundColor: "#0d1420",
  borderRadius: 12,
  titleTemplate:
    "Hi {client name}, {user name} has requested {item count} items for {template name}.",
  submittedMessage:
    "Thank you! Your documents have been securely uploaded directly to {user name}'s storage. No further action is needed.",
};

export const SettingsView: React.FC<{
  email: string;
  hasPassword: boolean;
  drive?: {
    email?: string;
    name?: string;
    imageUrl?: string;
    id: string;
    folderId?: string | null;
    folderName?: string | null;
  };
  branding?: BrandingSettingsData;
  reminderSettings?: ReminderSettingsData;
}> = ({ email, hasPassword, drive, branding, reminderSettings }) => {
  const [pwOpen, setPwOpen] = useState(false);
  const [emailOpen, setEmailOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  function downloadFile(name: string, contents: string, type: string) {
    const blob = new Blob([contents], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="max-w-7xl mx-auto w-full">
      <section className="mt-8">
        <SectionTitle>Account</SectionTitle>
        <Panel>
          <SettingRow
            title="Email address"
            desc={`${email} — used for sign-in and receipts.`}
          >
            <Button onClick={() => setEmailOpen(true)}>
              <Mail className="h-4 w-4" /> Change email
            </Button>
          </SettingRow>
          <Divider />
          <SettingRow
            title="Password"
            desc="Rotate your password regularly. Minimum 8 characters."
          >
            <Button onClick={() => setPwOpen(true)}>
              <KeyRound className="h-4 w-4" /> Change password
            </Button>
          </SettingRow>
        </Panel>
      </section>

      <section className="mt-8">
        <SectionTitle>Google Drive</SectionTitle>
        <Panel>
          <SettingRow
            title="Google Drive connection"
            desc="Client uploads stream directly into your Drive account. You can revoke access at any time."
          >
            {drive ? (
              <Badge className="bg-success/12 text-success gap-1.5">
                <div className="size-2 rounded-full bg-success" aria-hidden />
                Connected
              </Badge>
            ) : (
              <Link href="/api/drive/connect">
                <Button>Connect</Button>
              </Link>
            )}
          </SettingRow>
          {drive && (
            <DriveFolderSelector
              initialSettings={{
                email: drive.email,
                name: drive.name,
                imageUrl: drive.imageUrl,
                id: drive.id,
                folderId: drive.folderId,
                folderName: drive.folderName,
              }}
            />
          )}
          <Divider />
        </Panel>
      </section>

      <section className="mt-8">
        <SectionTitle>Branding</SectionTitle>
        <p className="text-xs text-muted-foreground mb-3">
          Customize how your client portal looks and reads for your clients.
        </p>
        <BrandingSettings initial={branding ?? DEFAULT_BRANDING} />
      </section>

      <section className="mt-8">
        <SectionTitle>Reminders</SectionTitle>
        <p className="text-xs text-muted-foreground mb-3">
          Choose how reminder emails are presented and when they are sent.
        </p>
        <ReminderSettings initial={reminderSettings} />
      </section>

      <section className="mt-8">
        <SectionTitle>Data portability</SectionTitle>
        <p className="text-xs text-muted-foreground mb-3">
          Export all your DocFetch data — clients, templates, and requests — as
          a single JSON file.
        </p>
        <Panel>
          <SettingRow
            title="Export account data"
            desc="Downloads your clients, templates, and requests as a .json file."
          >
            <Button
              onClick={async () => {
                const data = await exportAccountDataAction();
                downloadFile(
                  "docfetch-export.json",
                  JSON.stringify(data, null, 2),
                  "application/json",
                );
              }}
            >
              <Download className="h-4 w-4" /> Export .json
            </Button>
          </SettingRow>
        </Panel>
      </section>

      <section className="mt-8">
        <SectionTitle>Danger zone</SectionTitle>
        <Panel>
          <SettingRow
            title="Reset all data"
            desc="Clears all your clients, templates, and requests. Your account stays active."
          >
            <Button onClick={() => setResetOpen(true)} variant={"destructive"}>
              <RotateCcw className="h-4 w-4" /> Reset data
            </Button>
          </SettingRow>
          <Divider />
          <SettingRow
            title="Delete account"
            desc="Permanently remove your DocFetch account and all associated data."
          >
            <Button onClick={() => setDeleteOpen(true)} variant={"destructive"}>
              <Trash2 className="h-4 w-4" /> Delete account
            </Button>
          </SettingRow>
        </Panel>
      </section>

      <ChangePasswordModal
        open={pwOpen}
        onOpenChange={setPwOpen}
        hasPassword={hasPassword}
      />
      <ChangeEmailModal
        open={emailOpen}
        onOpenChange={setEmailOpen}
        hasPassword={hasPassword}
      />
      <ResetDataModal open={resetOpen} onOpenChange={setResetOpen} />
      <DeleteAccountModal open={deleteOpen} onOpenChange={setDeleteOpen} />
    </div>
  );
};
