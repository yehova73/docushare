"use client";

import {
  generateBrandingLogoUploadKeyAction,
  updateBrandingAction,
} from "@/actions/settings/branding";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useServerAction } from "@/hooks/use-server-action";
import { useS3Upload } from "@/hooks/use-s3-upload";
import { ImagePlus, Loader2, Save, Sparkles } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Divider, Panel } from "./components";

export type BrandingSettingsData = {
  name: string | null;
  logoUrl: string | null;
  logoKey: string | null;
  backgroundColor: string;
  headerFooterColor: string;
  primaryColor: string;
  fieldBackgroundColor: string;
  sectionCardBackgroundColor: string;
  sectionTitleColor: string;
  fieldTitleColor: string;
  fieldSubtitleColor: string;
  inputBackgroundColor: string;
  uploadBackgroundColor: string;
  borderRadius: number;
  titleTemplate: string;
  submittedMessage: string;
};

const COLOR_PRESETS = [
  "#0d1420",
  "#0f172a",
  "#1e293b",
  "#18181b",
  "#6366f1",
  "#7c3aed",
  "#0ea5e9",
  "#10b981",
  "#f59e0b",
  "#f43f5e",
  "#ffffff",
];

const PLACEHOLDERS = [
  { label: "Client name", token: "{client name}" },
  { label: "User name", token: "{user name}" },
  { label: "Item count", token: "{item count}" },
  { label: "Template name", token: "{template name}" },
];

const DEFAULT_TITLE =
  "Hi {client name}, {user name} has requested {item count} items for {template name}.";

const SAMPLE_VALUES: Record<string, string> = {
  "{client name}": "Acme Inc.",
  "{user name}": "Alex",
  "{item count}": "5",
  "{template name}": "Onboarding Pack",
};

function formatTemplate(template: string) {
  return template.replace(
    /{client name}|{user name}|{item count}|{template name}/g,
    (match) => SAMPLE_VALUES[match] ?? match,
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-sm font-medium">{label}</Label>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      {children}
    </div>
  );
}

function ColorField({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <label
        className="relative size-9 shrink-0 cursor-pointer overflow-hidden rounded-lg border border-input shadow-sm"
        style={{ backgroundColor: value || "#000000" }}
      >
        <input
          type="color"
          value={value || "#000000"}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 cursor-pointer opacity-0"
          aria-label="Pick color"
        />
      </label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-32 font-mono"
        placeholder="#000000"
      />
      <div className="flex flex-wrap gap-1">
        {COLOR_PRESETS.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => onChange(color)}
            className="size-5 rounded-md border border-input transition-transform hover:scale-110"
            style={{ backgroundColor: color }}
            aria-label={`Set color ${color}`}
          />
        ))}
      </div>
    </div>
  );
}

export function BrandingSettings({
  initial,
}: {
  initial: BrandingSettingsData;
}) {
  const [name, setName] = useState(initial.name ?? "");
  const [logoUrl, setLogoUrl] = useState(initial.logoUrl ?? "");
  const [logoKey, setLogoKey] = useState(initial.logoKey ?? "");
  const [backgroundColor, setBackgroundColor] = useState(
    initial.backgroundColor,
  );
  const [headerFooterColor, setHeaderFooterColor] = useState(
    initial.headerFooterColor,
  );
  const [primaryColor, setPrimaryColor] = useState(initial.primaryColor);
  const [fieldBackgroundColor, setFieldBackgroundColor] = useState(
    initial.fieldBackgroundColor,
  );
  const [sectionCardBackgroundColor, setSectionCardBackgroundColor] = useState(
    initial.sectionCardBackgroundColor,
  );
  const [sectionTitleColor, setSectionTitleColor] = useState(
    initial.sectionTitleColor,
  );
  const [fieldTitleColor, setFieldTitleColor] = useState(
    initial.fieldTitleColor,
  );
  const [fieldSubtitleColor, setFieldSubtitleColor] = useState(
    initial.fieldSubtitleColor,
  );
  const [inputBackgroundColor, setInputBackgroundColor] = useState(
    initial.inputBackgroundColor,
  );
  const [uploadBackgroundColor, setUploadBackgroundColor] = useState(
    initial.uploadBackgroundColor,
  );
  const [borderRadius, setBorderRadius] = useState(initial.borderRadius);
  const [titleTemplate, setTitleTemplate] = useState(
    initial.titleTemplate || DEFAULT_TITLE,
  );
  const [submittedMessage, setSubmittedMessage] = useState(
    initial.submittedMessage,
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { call: saveBranding, loading: saving } =
    useServerAction(updateBrandingAction);

  const {
    uploadFile,
    status: uploadStatus,
    progress,
  } = useS3Upload({
    getS3UploadKey: generateBrandingLogoUploadKeyAction,
    onUploadComplete: () => {},
  });

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const result = await uploadFile({ file });
    if (result) {
      setLogoUrl(result.url);
      setLogoKey(result.key);
    } else {
      toast.error("Logo upload failed", {
        description: "Could not upload the logo image. Please try again.",
      });
    }
    e.target.value = "";
  }

  async function handleSave() {
    if (!titleTemplate.trim()) {
      toast.error("Title template is required");
      return;
    }
    await saveBranding({
      name: name || null,
      logoUrl: logoUrl || null,
      logoKey: logoKey || null,
      backgroundColor,
      headerFooterColor,
      primaryColor,
      fieldBackgroundColor,
      sectionCardBackgroundColor,
      sectionTitleColor,
      fieldTitleColor,
      fieldSubtitleColor,
      inputBackgroundColor,
      uploadBackgroundColor,
      borderRadius: Math.max(0, Math.min(32, Math.round(borderRadius))),
      titleTemplate,
      submittedMessage,
    });
  }

  return (
    <Panel>
      <div className="p-4 flex flex-col gap-6">
        <div className="grid gap-5 sm:grid-cols-2">
          {/* Identity */}
          <Field label="Portal name" hint="Shown in the portal header.">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Acme Inc."
            />
          </Field>

          <Field label="Logo" hint="PNG, JPG or SVG. Shown in the header.">
            <div className="flex items-center gap-2">
              {logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={logoUrl}
                  alt="Logo preview"
                  className="size-9 rounded-lg border border-input bg-background object-contain p-1"
                />
              ) : (
                <div className="flex size-9 items-center justify-center rounded-lg border border-dashed border-input text-muted-foreground">
                  <ImagePlus className="size-4" />
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleLogoUpload}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={uploadStatus === "uploading"}
                onClick={() => fileInputRef.current?.click()}
              >
                {uploadStatus === "uploading" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ImagePlus className="h-4 w-4" />
                )}
                {uploadStatus === "uploading"
                  ? `Uploading ${Math.round(progress)}%`
                  : "Upload"}
              </Button>
              {logoUrl && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setLogoUrl("");
                    setLogoKey("");
                  }}
                >
                  Remove
                </Button>
              )}
            </div>
          </Field>
        </div>

        <Divider />

        {/* Colors */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Surfaces
            </span>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <Field label="Background color">
                <ColorField
                  value={backgroundColor}
                  onChange={setBackgroundColor}
                />
              </Field>
              <Field label="Header & footer color">
                <ColorField
                  value={headerFooterColor}
                  onChange={setHeaderFooterColor}
                />
              </Field>
              <Field label="Primary color">
                <ColorField value={primaryColor} onChange={setPrimaryColor} />
              </Field>
              <Field
                label="Field background"
                hint="Background of each field card."
              >
                <ColorField
                  value={fieldBackgroundColor}
                  onChange={setFieldBackgroundColor}
                />
              </Field>
              <Field
                label="Section card background"
                hint="Background of each section card."
              >
                <ColorField
                  value={sectionCardBackgroundColor}
                  onChange={setSectionCardBackgroundColor}
                />
              </Field>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Text
            </span>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <Field label="Section title color">
                <ColorField
                  value={sectionTitleColor}
                  onChange={setSectionTitleColor}
                />
              </Field>
              <Field label="Field title color">
                <ColorField
                  value={fieldTitleColor}
                  onChange={setFieldTitleColor}
                />
              </Field>
              <Field label="Field subtitle color">
                <ColorField
                  value={fieldSubtitleColor}
                  onChange={setFieldSubtitleColor}
                />
              </Field>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Inputs
            </span>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <Field label="Input background">
                <ColorField
                  value={inputBackgroundColor}
                  onChange={setInputBackgroundColor}
                />
              </Field>
              <Field label="File upload background">
                <ColorField
                  value={uploadBackgroundColor}
                  onChange={setUploadBackgroundColor}
                />
              </Field>
            </div>
          </div>
        </div>

        <Divider />

        <div className="grid gap-5 sm:grid-cols-2">
          {/* Border radius */}
          <Field
            label={`Border radius — ${borderRadius}px`}
            hint="Controls how rounded panels, cards and buttons look."
          >
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={0}
                max={32}
                value={borderRadius}
                onChange={(e) => setBorderRadius(Number(e.target.value))}
                className="flex-1 accent-[var(--primary)]"
              />
              <Input
                type="number"
                min={0}
                max={32}
                value={borderRadius}
                onChange={(e) => setBorderRadius(Number(e.target.value))}
                className="w-20"
              />
            </div>
          </Field>

          {/* Title template */}
          <Field
            label="Welcome title format"
            hint="The message clients see at the top of the request form."
          >
            <Input
              value={titleTemplate}
              onChange={(e) => setTitleTemplate(e.target.value)}
              placeholder={DEFAULT_TITLE}
              className="font-mono text-xs"
            />
            <div className="flex flex-wrap gap-1.5 pt-1">
              {PLACEHOLDERS.map((p) => (
                <button
                  key={p.token}
                  type="button"
                  onClick={() =>
                    setTitleTemplate((prev) => `${prev} ${p.token}`.trim())
                  }
                  className="rounded-md border border-input bg-muted/50 px-2 py-0.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </Field>
        </div>

        {/* Submitted message */}
        <Field
          label="Form submitted message"
          hint="Shown on the success screen after the client submits the form."
        >
          <Textarea
            value={submittedMessage}
            onChange={(e) => setSubmittedMessage(e.target.value)}
            rows={3}
          />
        </Field>

        {/* Live preview */}
        <div
          className="rounded-xl border p-4"
          style={{
            borderColor: "var(--color-border)",
            backgroundColor: "var(--color-card)",
          }}
        >
          <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Sparkles className="size-3.5" />
            Live preview
          </div>
          <div className="flex flex-col gap-2 text-sm">
            <p className="font-semibold">{formatTemplate(titleTemplate)}</p>
            <p className="text-muted-foreground">
              {formatTemplate(submittedMessage)}
            </p>
          </div>
        </div>

        <div
          className="flex justify-end border-t pt-4"
          style={{ borderColor: "var(--color-border)" }}
        >
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save branding
          </Button>
        </div>
      </div>
    </Panel>
  );
}
