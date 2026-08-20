import { handleStripeSessionAction } from "@/actions/account/subscriptions/handle-stripe-session";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Parse the JSON body
    const sessionId = request.nextUrl.searchParams.get("session_id");
    console.log("Received session id:", sessionId);
    if (!sessionId) {
      return new Response(JSON.stringify({ error: "No sessionId provided" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
    // await sendAdminTelegramMessage(`Processing Stripe session ID: ${id}`);
    const result = await handleStripeSessionAction(sessionId);

    // if (!result?.s) {
    //     return NextResponse.redirect(new URL("/", request.url)); // fallback
    //   }

    return NextResponse.redirect(
      new URL("/app?action=payment-complete", request.url),
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch report stats" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }
}
