// app/api/drive/callback/route.ts
import { getUserFromSession } from "@/actions/account/account";
import { markQuickStartActionComplete } from "@/actions/quick-start/mark-quick-start-action-complete";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const code = searchParams.get("code");
  const user = await getUserFromSession();

  if (!code || !user) {
    return NextResponse.redirect(
      new URL("/settings?error=unauthorized", req.url),
    );
  }

  // 1. Exchange authorization code for tokens
  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_DRIVE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_DRIVE_CLIENT_SECRET!,
      redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/drive/callback`,
      grant_type: "authorization_code",
    }),
  });

  const tokens = await tokenResponse.json();

  if (!tokenResponse.ok) {
    return NextResponse.redirect(
      new URL("/settings?error=token_failed", req.url),
    );
  }

  // 2. Fetch Google User Profile details using the fresh Access Token
  let googleUserInfo: { email?: string; name?: string; picture?: string } = {};

  try {
    const userInfoRes = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
        },
      },
    );

    if (userInfoRes.ok) {
      googleUserInfo = await userInfoRes.json();
    }
  } catch (err) {
    console.error("Failed to fetch Google user info:", err);
  }

  // 3. Persist tokens and profile info in database
  await prisma.googleDriveAccount.upsert({
    where: { userId: user.id },
    update: {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token ?? undefined, // Preserves existing if not re-issued
      expiresAt: new Date(Date.now() + tokens.expires_in * 1000),
      userName: googleUserInfo.name ?? undefined,
      userEmail: googleUserInfo.email ?? undefined,
      userPicture: googleUserInfo.picture ?? undefined,
    },
    create: {
      userId: user.id,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresAt: new Date(Date.now() + tokens.expires_in * 1000),
      userName: googleUserInfo.name ?? null,
      userEmail: googleUserInfo.email ?? null,
      userPicture: googleUserInfo.picture ?? null,
    },
  });

  markQuickStartActionComplete(user.id, "connectedGoogleDrive");

  return NextResponse.redirect(
    new URL("/app/settings?drive=connected", req.url),
  );
}
