// app/api/drive/connect/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  const scopes = [
    "https://www.googleapis.com/auth/drive.file",
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
    "openid",
  ].join(" ");

  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_DRIVE_CLIENT_ID!,
    redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/drive/callback`,
    response_type: "code",
    scope: scopes,
    access_type: "offline", // Required for refresh_token
    prompt: "consent", // Forces refresh_token issuance
  });

  return NextResponse.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`,
  );
}
