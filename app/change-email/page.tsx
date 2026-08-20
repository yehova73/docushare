"use client";

import { verifyChangeEmailRequestAction } from "@/actions/account/email-change";
import { Logo } from "@/components/logo";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import { AlertCircle, ArrowLeft, Check } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ChangeEmailPage() {
  const router = useRouter();
  const session = useSession();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const oldEmail = searchParams.get("oldEmail");

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isTokenChecking, setIsTokenChecking] = useState(true);

  useEffect(() => {
    // Validate token
    const validateToken = async () => {
      setIsTokenChecking(true);

      try {
        await signOut({ redirect: false });
        // Simulate API call to validate token
        await new Promise((resolve) => setTimeout(resolve, 1000));
        if (token && oldEmail) {
          const isValid = await verifyChangeEmailRequestAction({
            tokenId: token,
            oldEmail: oldEmail,
          });
          if (isValid) {
            setSuccess(true);
            if (session && session.data?.user) {
              await session.update({ email: isValid });
            }
            setTimeout(() => router.push("/"), 2500);
          } else {
            setSuccess(false);
            setError(
              "Invalid or expired email change link. Please request a new one.",
            );
          }
        } else {
          setError(
            "Invalid or expired email change link. Please request a new one.",
          );
        }
      } catch (err) {
        console.log(err);
        setError("Failed to validate link token. Please try again.");
      } finally {
        setIsTokenChecking(false);
      }
    };

    validateToken();
  }, [token, oldEmail]);

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
          <Card className="shadow shadow-primary border-0">
            <CardHeader>
              <CardTitle className="text-2xl text-center">
                Updating Your Email
              </CardTitle>
              <CardDescription className="text-center">
                {isTokenChecking
                  ? "Validating your request link..."
                  : success
                    ? "Your email has been updated successfully!"
                    : "Invalid request link."}
              </CardDescription>
            </CardHeader>

            <CardContent>
              {isTokenChecking ? (
                <div className="flex justify-center py-8">
                  <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : success ? (
                <div className="text-center py-6 space-y-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <Check className="w-8 h-8 text-green-600" />
                  </div>
                  <p className="text-muted-foreground">
                    Your email has been updated successfully. You will be
                    redirected to the login page shortly.
                  </p>
                </div>
              ) : (
                <>
                  {error && (
                    <Alert variant="destructive" className="mb-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="text-center py-4">
                    <p className="text-muted-foreground mb-4">
                      The email change link is invalid or has expired. Please
                      request a new one.
                    </p>
                    <Link href="/login" passHref>
                      <Button variant="outline">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Login
                      </Button>
                    </Link>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
