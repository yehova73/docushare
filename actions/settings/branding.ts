"use server";

import { prisma } from "@/lib/prisma";
import { getUserFromSession } from "@/actions/account/account";
import { ServerActionResponse } from "@/hooks/use-server-action";
import { UserBranding } from "@/lib/generated/prisma/browser";
import type { GenerateUploadKeyResponse } from "@/hooks/use-s3-upload";

export type BrandingInput = {
  name?: string | null;
  logoUrl?: string | null;
  logoKey?: string | null;
  backgroundColor?: string;
  headerFooterColor?: string;
  primaryColor?: string;
  fieldBackgroundColor?: string;
  sectionCardBackgroundColor?: string;
  sectionTitleColor?: string;
  fieldTitleColor?: string;
  fieldSubtitleColor?: string;
  inputBackgroundColor?: string;
  uploadBackgroundColor?: string;
  borderRadius?: number;
  titleTemplate?: string;
  submittedMessage?: string;
};

export const getOrCreateBrandingAction = async (): Promise<
  ServerActionResponse<UserBranding>
> => {
  try {
    const user = await getUserFromSession();

    const existing = await prisma.userBranding.findUnique({
      where: { userId: user!.id },
    });

    if (existing) {
      return { status: "ok", data: existing, message: null };
    }

    const created = await prisma.userBranding.create({
      data: { userId: user!.id },
    });

    return { status: "ok", data: created, message: null };
  } catch (error) {
    console.error("Failed to get branding:", error);
    return {
      status: "error",
      data: null,
      message: {
        title: "Failed to load branding",
        description: "An error occurred while loading your branding settings.",
      },
    };
  }
};

export const updateBrandingAction = async (
  input: BrandingInput,
): Promise<ServerActionResponse<UserBranding>> => {
  try {
    const user = await getUserFromSession();

    const data = await prisma.userBranding.upsert({
      where: { userId: user!.id },
      create: { userId: user!.id, ...input },
      update: { ...input },
    });

    return {
      status: "ok",
      requireRefresh: true,
      data,
      message: {
        title: "Branding updated",
        description: "Your client portal branding has been saved.",
      },
    };
  } catch (error) {
    console.error("Failed to update branding:", error);
    return {
      status: "error",
      data: null,
      message: {
        title: "Failed to update branding",
        description: "An error occurred while saving your branding settings.",
      },
    };
  }
};

export const generateBrandingLogoUploadKeyAction = async (): Promise<
  ServerActionResponse<GenerateUploadKeyResponse>
> => {
  try {
    const user = await getUserFromSession();
    return {
      status: "ok",
      data: {
        s3Key: `${user!.id}/branding/logo-${Date.now()}`,
      },
    };
  } catch (error) {
    console.error("Failed to generate logo upload key:", error);
    return {
      status: "error",
      data: null,
      message: {
        title: "Failed to generate upload key",
        description: "An error occurred while preparing the logo upload.",
      },
    };
  }
};
