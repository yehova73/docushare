"use server";

import { prisma } from "@/lib/prisma";
import { getUserFromSession } from "../account/account";

export async function getValidDriveAccessToken(): Promise<string> {
  const user = await getUserFromSession();
  const driveAccount = await prisma.googleDriveAccount.findUnique({
    where: { userId: user?.id },
  });

  if (!driveAccount || !driveAccount.refreshToken) {
    throw new Error("Google Drive not connected");
  }

  // If token is still valid (with 5-minute safety margin)
  if (driveAccount.expiresAt.getTime() > Date.now() + 5 * 60 * 1000) {
    return driveAccount.accessToken;
  }

  // Token expired: exchange refresh token for a fresh access token
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_DRIVE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_DRIVE_CLIENT_SECRET!,
      refresh_token: driveAccount.refreshToken,
      grant_type: "refresh_token",
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error("Failed to refresh Drive access token");
  }

  const newAccessToken = data.access_token;
  const newExpiresAt = new Date(Date.now() + data.expires_in * 1000);

  // Update DB
  await prisma.googleDriveAccount.update({
    where: { userId: user?.id },
    data: {
      accessToken: newAccessToken,
      expiresAt: newExpiresAt,
      ...(data.refresh_token && { refreshToken: data.refresh_token }),
    },
  });

  return newAccessToken;
}
