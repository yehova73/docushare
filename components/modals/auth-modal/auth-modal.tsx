"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Mail } from "lucide-react";
import { signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { CreateAccountView } from "./create-account-view";
import { ForgotPasswordView } from "./forgot-password-view";
import { MagicLinkView } from "./magic-link-view";
import { SignInView } from "./sign-in-view";
import { useAuthModal } from "./use-auth-modal";
import Link from "next/link";

type Mode = "signin" | "signup" | "forgot-password" | "magic-link";

export function AuthModal() {
  const { open, closeDialog, mode: initialMode } = useAuthModal();
  const [mode, setMode] = useState<Mode>(initialMode || "signin");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setMode(initialMode || "signin");
    } else {
      setTimeout(() => {
        setMode("signin");
      }, 300);
    }
  }, [initialMode, open]);

  function handleSocial(provider: "Google" | "GitHub") {
    setLoading(true);
    if (provider === "Google") {
      signIn("google", {
        callbackUrl: "/app",
        // redirect: true,
        // callbackUrl: claimAnonymousAccountId
        //   ? `/api/claim?accountId=${claimAnonymousAccountId}`
        //   : "/app",
      });
    } else if (provider === "GitHub") {
      signIn("github", {
        callbackUrl: "/app",
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={(val) => !val && closeDialog()}>
      <DialogContent className="sm:max-w-md border border-white/10 p-0 overflow-hidden">
        <div className="p-6 pb-0">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {mode === "signup" && "Create your account"}
              {mode === "signin" && "Welcome back"}
              {mode === "magic-link" && "Sign in with magic link"}
              {mode === "forgot-password" && "Forgot your password?"}
            </DialogTitle>
            <DialogDescription>
              {mode === "signup" && "Free forever, no card required."}
              {mode === "signin" &&
                "Sign in to sync your workspaces across devices."}
              {mode === "magic-link" &&
                "Enter your email and we'll send you a magic link to sign in."}
              {mode === "forgot-password" &&
                "Enter your email and we'll send you instructions to reset your password."}
            </DialogDescription>
          </DialogHeader>
          {(mode === "signin" || mode === "signup") && (
            <>
              <div className="mt-5 grid grid-cols-1 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="h-10 border-border  backdrop-blur-sm "
                  onClick={() => handleSocial("Google")}
                  disabled={loading}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Google
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="h-10 border-border  backdrop-blur-sm"
                  onClick={() => setMode("magic-link")}
                  disabled={loading}
                >
                  <Mail />
                  Magic Link
                </Button>
                {/* <Button
              type="button"
              variant="outline"
              className="h-10 border-border "
              onClick={() => handleSocial("GitHub")}
              disabled={loading}
            >
               <Github className="h-4 w-4" /> 
              GitHub
            </Button> */}
              </div>
              <div className="flex items-center gap-3 my-5">
                <div className="h-px flex-1 bg-border/50" />
                <span className="text-xs text-muted-foreground uppercase tracking-wider">
                  or
                </span>
                <div className="h-px flex-1 bg-border/50" />
              </div>
            </>
          )}

          {mode === "signin" && (
            <SignInView
              setLoading={setLoading}
              loading={loading}
              onForgotPasswordClick={() => setMode("forgot-password")}
              onCreateAccountClick={() => setMode("signup")}
            />
          )}

          {mode === "signup" && (
            <CreateAccountView
              setLoading={setLoading}
              loading={loading}
              onCreateAccountClick={() => setMode("signin")}
            />
          )}

          {mode === "magic-link" && (
            <MagicLinkView
              setLoading={setLoading}
              loading={loading}
              onBackClick={() => setMode("signin")}
            />
          )}

          {mode === "forgot-password" && (
            <ForgotPasswordView
              setLoading={setLoading}
              loading={loading}
              onBackClick={() => setMode("signin")}
            />
          )}
        </div>

        <div className="border-t  px-6 py-3">
          <p className="text-[11px] text-muted-foreground text-center">
            By continuing you agree to our{" "}
            <Link
              href="/policies/terms"
              className="underline hover:text-foreground"
              onClick={closeDialog}
            >
              Terms
            </Link>{" "}
            &{" "}
            <Link
              href="/policies/privacy"
              className="underline hover:text-foreground"
              onClick={closeDialog}
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
