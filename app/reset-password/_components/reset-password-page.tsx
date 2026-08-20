"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChart3, ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  confirmResetPasswordAction,
  verifyResetPasswordTokenAction,
} from "@/actions/account/password";
import { motion } from "framer-motion";
import { Logo } from "@/components/logo";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [validatingTokenLoading, setValidatingTokenLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      toast.error("Invalid reset link", {
        description: "This password reset link is missing or invalid.",
      });
      router.replace("/login");
      return;
    }

    (async () => {
      const isValid = await verifyResetPasswordTokenAction(token);
      if (!isValid) {
        toast.error("Invalid or expired token", {
          description: "Please request a new password reset.",
        });
        router.replace("/login");
      }
      setValidatingTokenLoading(false);
    })();
  }, [token, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match", {
        description: "Please make sure both passwords are the same.",
      });
      return;
    }

    setIsLoading(true);
    await confirmResetPasswordAction({
      passowrd: password,
      tokenId: token!,
    });
    setIsLoading(false);
    setIsSuccess(true);
  };

  if (validatingTokenLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-background to-muted/30 flex items-center justify-center p-4">
        <Loader2 className="text-primary animate-spin" />
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-background/80 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="w-full max-w-md flex justify-center py-4">
          <Link href={"/"} passHref>
            <Logo />
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="shadow shadow-primary">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">
                {isSuccess ? "Password reset successful" : "Set a new password"}
              </CardTitle>
              <CardDescription>
                {isSuccess
                  ? "You can now sign in with your new password"
                  : "Enter your new password below"}
              </CardDescription>
            </CardHeader>

            <CardContent>
              {isSuccess ? (
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>

                  <Button asChild className="w-full" size="lg">
                    <Link href="/login">
                      <ArrowLeft className="h-5 w-5" />
                      Go to login
                    </Link>
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">New password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={isLoading}
                  >
                    {isLoading ? "Resetting..." : "Reset password"}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
