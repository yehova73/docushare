"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Mail, Phone, Plus, UserPlus } from "lucide-react";
import { useAddClientSheet } from "./use-add-client-sheet";
import useServerAction from "@/hooks/use-server-action";
import { addClientAction } from "@/actions/clients/add-client";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { editClientAction } from "@/actions/clients/edit-client";

export const AddClientSheet = () => {
  const { closeDialog, cb, open, editClient } = useAddClientSheet();
  const { call: callAddClient, loading } = useServerAction(addClientAction);
  const { call: callEditClient, loading: editLoading } =
    useServerAction(editClientAction);

  const { register, handleSubmit, reset, getValues } = useForm({
    defaultValues: {
      name: editClient?.name || "",
      company: editClient?.company || "",
      email: editClient?.email || "",
      phone: editClient?.phone || "",
    },
  });

  useEffect(() => {
    if (!open) return;
    reset({
      name: editClient?.name || "",
      company: editClient?.company || "",
      email: editClient?.email || "",
      phone: editClient?.phone || "",
    });
  }, [editClient, reset, open]);

  const onSubmit = async () => {
    const res = editClient
      ? await callEditClient({ ...getValues(), id: editClient.id })
      : await callAddClient(getValues());
    if (res) {
      setTimeout(() => {
        closeDialog();
      }, 200);
      reset();
      if (typeof cb === "function") {
        cb(res);
      }
    }
  };

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && closeDialog()}>
      <SheetContent className="flex flex-col !max-w-lg w-full">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col h-full"
        >
          <SheetHeader>
            <SheetTitle>Add new client</SheetTitle>
            <SheetDescription>
              Contacts are used for upload links and reminder delivery.
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-4 py-2">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="c-name">Full name</FieldLabel>
                <Input
                  id="c-name"
                  placeholder="Sarah Chen"
                  {...register("name")}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="c-company">Company</FieldLabel>
                <Input
                  id="c-company"
                  placeholder="Chen Design Studio"
                  {...register("company")}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="c-email">Email</FieldLabel>
                <div className="relative">
                  <Mail className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="c-email"
                    type="email"
                    placeholder="sarah@company.co"
                    className="pl-8"
                    {...register("email")}
                  />
                </div>
              </Field>

              <Field>
                <FieldLabel htmlFor="c-phone">Phone (for SMS)</FieldLabel>
                <div className="relative">
                  <Phone className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="c-phone"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    className="pl-8"
                    {...register("phone")}
                  />
                </div>
              </Field>
            </FieldGroup>
          </div>

          <SheetFooter>
            <Button type="submit" disabled={loading}>
              <Plus data-icon="inline-start" />
              Save client
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
};
