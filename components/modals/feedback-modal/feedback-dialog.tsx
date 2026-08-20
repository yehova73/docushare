"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { Button } from "../../ui/button";
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group";
import { toast } from "sonner";
import { useFeedbackModal } from "./use-feedback-modal";
import { createFeedbackAction } from "@/actions/admin/contact";

export const FeedbackDialog: React.FC = () => {
  const { open, closeDialog, category: initialCategory } = useFeedbackModal();

  const [rating, setRating] = useState<string | null>(null);
  const [category, setCategory] = useState<string>(
    initialCategory || "support",
  );
  const [comment, setComment] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      await createFeedbackAction({
        category,
        feedback: comment,
        rank: rating || "",
      });

      toast("Support request sent! We will respond as soon as we can.");
      setIsSubmitted(true);

      setTimeout(() => {
        closeDialog();
        setRating(null);
        setCategory(initialCategory || "support");
        setComment("");
        setIsSubmitted(false);
      }, 2000);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      setCategory(initialCategory || "support");
      setRating(null);
      setComment("");
      setIsSubmitted(false);
    }
  }, [open, initialCategory]);

  const getSubmitLabel = (cat?: string) => {
    switch (cat) {
      case "support":
        return "Send support request";
      case "bug":
        return "Report bug";
      case "feature":
        return "Request feature";
      case "improvement":
        return "Suggest improvement";
      case "other":
        return "Send";
      default:
        return "Submit feedback";
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={(val) => !val && closeDialog()}>
        <DialogContent className="sm:max-w-[425px]">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Contact support</DialogTitle>
                <DialogDescription>
                  We are here to help you with any questions or issues.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={category}
                    onValueChange={setCategory}
                    defaultValue="support"
                  >
                    <SelectTrigger id="category" className="w-full">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="support">Support</SelectItem>
                      <SelectItem value="bug">Bug report</SelectItem>
                      <SelectItem value="feature">Feature request</SelectItem>
                      <SelectItem value="improvement">
                        Improvement suggestion
                      </SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rating">
                    How would you rate your experience?
                  </Label>
                  <RadioGroup
                    id="rating"
                    value={rating || ""}
                    onValueChange={setRating}
                    className="flex space-x-2"
                  >
                    {[1, 2, 3, 4, 5].map((value) => (
                      <div
                        key={value}
                        className="flex flex-col items-center space-y-1"
                      >
                        <RadioGroupItem
                          value={value.toString()}
                          id={`rating-${value}`}
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor={`rating-${value}`}
                          className="bg-secondary flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-transparent peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/40 peer-data-[state=checked]:text-white"
                        >
                          {value}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="comment">Your message</Label>
                  <Textarea
                    id="comment"
                    placeholder="Tell us what you think..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => closeDialog()}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant={"default"}
                  disabled={isLoading || !category || !comment}
                >
                  {isLoading ? "Submitting..." : getSubmitLabel(category)}
                </Button>
              </DialogFooter>
            </form>
          ) : (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="mb-4 rounded-full bg-green-100 p-3">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="mb-1 text-lg font-medium">
                Thank you for your feedback!
              </h3>
              <p className="text-center text-sm text-gray-500">
                Your input helps us improve our app for everyone.
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
