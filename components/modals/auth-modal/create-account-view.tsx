"use client";

import { createUserAction } from "@/actions/account/account";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Lock, Mail, User } from "lucide-react";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { toast } from "sonner";

export const CreateAccountView: React.FC<{
  setLoading: (loading: boolean) => void;
  loading: boolean;
  onCreateAccountClick: () => void;
}> = ({ setLoading, loading, onCreateAccountClick }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  async function handleCreateAccount(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);
    if (!name) {
      toast.error("Please enter your full name");
      setLoading(false);
      return;
    }

    if (!confirmPassword) {
      toast.error("Please confirm your password");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      setLoading(false);
      return;
    }
    try {
      const res = await createUserAction({
        name,
        email,
        password,
      });
      toast.success(res.success ? "Account created successfully" : res.error);
      await signIn("credentials", {
        email,
        password,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="name" className="text-xs text-muted-foreground">
          Full name
        </Label>
        <div className="relative">
          <User className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 " />
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ada Lovelace"
            className="pl-9 h-10 autofill:bg-transparent"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email" className="text-xs text-muted-foreground">
          Email
        </Label>
        <div className="relative">
          <Mail className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 " />
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            className="pl-9 h-10 autofill:bg-transparent"
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="password" className="text-xs text-muted-foreground">
            Password
          </Label>
        </div>
        <div className="relative">
          <Lock className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2  " />
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="pl-9 h-10 autofill:bg-transparent"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label
          htmlFor="confirmPassword"
          className="text-xs text-muted-foreground"
        >
          Confirm password
        </Label>
        <div className="relative">
          <Lock className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            className="pl-9 h-10 autofill:bg-transparent"
          />
        </div>
      </div>
      <Button
        type="submit"
        disabled={loading}
        onClick={handleCreateAccount}
        className="w-full h-10 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Please wait…
          </>
        ) : (
          "Create free account"
        )}
      </Button>

      <p className="text-xs text-center text-muted-foreground">
        Already have an account?
        <button
          type="button"
          onClick={onCreateAccountClick}
          className="cursor-pointer ml-1 text-primary hover:underline font-medium"
        >
          Sign in
        </button>
      </p>
    </div>
  );
};
