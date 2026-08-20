"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

export const PaymentCompleteModal: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [dismissed, setDismissed] = useState(false);

  const open = searchParams.get("action") === "payment-complete" && !dismissed;

  const handleClose = () => {
    setDismissed(true);
    const params = new URLSearchParams(searchParams.toString());
    params.delete("action");
    const newUrl = params.toString()
      ? `?${params.toString()}`
      : window.location.pathname;
    router.replace(newUrl);
  };

  return (
    <Dialog open={open} onOpenChange={(val) => !val && handleClose()}>
      <DialogContent className="!max-w-lg text-center">
        <DialogHeader className="items-center">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <DialogTitle className="text-2xl">You&apos;re all set!</DialogTitle>
          <DialogDescription className="text-base mt-2">
            Your subscription is now active. You&apos;ll never miss a review,
            and replying will take seconds instead of minutes.
          </DialogDescription>
        </DialogHeader>

        <div className="bg-gray-50 rounded-lg p-4 text-left space-y-2 my-2">
          <p className="text-sm font-medium text-gray-700">
            What you get from here:
          </p>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>✓ Faster alerts the moment a new review comes in</li>
            <li>✓ AI-crafted reply suggestions that match your brand voice</li>
            <li>✓ Higher response rate, better reputation with less effort</li>
          </ul>
        </div>

        <Button onClick={handleClose} className="w-full h-9">
          Simplify your review management
        </Button>
      </DialogContent>
    </Dialog>
  );
};
