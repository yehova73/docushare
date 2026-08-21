"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronsUpDown, Loader2, Plus } from "lucide-react";
import * as React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { createTemplateAction } from "@/actions/templates/create-template";
import { editTemplateAction } from "@/actions/templates/edit-template";
import { getTemplateCategoriesAction } from "@/actions/templates/get-template-categories";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { useServerAction } from "@/hooks/use-server-action";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useNewTemplateSheet } from "./use-new-template-sheet";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

// Schema definition
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  category: z.string().min(1, "Please select or create a category"),
});

type FormValues = z.infer<typeof formSchema>;

const INITIAL_CATEGORIES = [
  "Development",
  "Design",
  "Marketing",
  "Productivity",
];

export function NewTemplateSheet() {
  const { open, closeDialog, editTemplate, cb } = useNewTemplateSheet();
  const { call: getCategories, loading: loadingCategories } = useServerAction(
    getTemplateCategoriesAction,
  );
  const router = useRouter();
  const { call: createTemplate, loading: creatingTemplate } =
    useServerAction(createTemplateAction);
  const { call: updateTemplate, loading: updatingTemplate } =
    useServerAction(editTemplateAction);
  const params = useSearchParams();

  const [categories, setCategories] =
    React.useState<string[]>(INITIAL_CATEGORIES);
  const [selectOpen, setSelectOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
    },
  });

  const selectedCategory = watch("category");

  // Load categories from database when modal opens and pre-fill form if editing
  React.useEffect(() => {
    if (open) {
      getCategories().then((result) => {
        if (result && result.length > 0) {
          setCategories((prev) => {
            const combined = [...prev, ...result];
            return Array.from(new Set(combined)); // Remove duplicates
          });
        }
      });

      // Pre-fill form if editing
      if (editTemplate) {
        reset({
          name: editTemplate.name,
          description: editTemplate.description || "",
          category: editTemplate.category || "",
        });
      } else {
        reset({
          name: "",
          description: "",
          category: "",
        });
      }
    }
  }, [open, editTemplate, getCategories, reset]);

  const handleAddCategory = (newCategory: string) => {
    setSelectOpen(false);
    const trimmed = newCategory.trim();
    if (!trimmed) return;

    setValue("category", trimmed, { shouldValidate: true });

    setTimeout(() => {
      if (!categories.includes(trimmed)) {
        setCategories((prev) => [...prev, trimmed]);
      }
      setSearchValue("");
    }, 100);
  };

  const onSubmit = async (data: FormValues) => {
    if (editTemplate) {
      const res = await updateTemplate(editTemplate.id, data);
      if (res) {
        if (cb) cb(res);
        closeDialog();
        setTimeout(() => {
          reset();
        }, 400);
      }
    } else {
      const res = await createTemplate(data);
      if (res) {
        if (cb) cb(res);
        router.push(`/app/templates/${res?.id}`);
        closeDialog();
        setTimeout(() => {
          reset();
        }, 400);
      }
    }
  };

  const isNewCategory =
    searchValue.trim().length > 0 &&
    !categories.some(
      (cat) => cat.toLowerCase() === searchValue.trim().toLowerCase(),
    );

  return (
    <Sheet open={open} onOpenChange={(val) => (val ? null : closeDialog())}>
      <SheetContent className="flex flex-col !max-w-lg w-full">
        <SheetHeader>
          <SheetTitle>
            {editTemplate ? "Edit Template" : "Add New Template"}
          </SheetTitle>
          <SheetDescription>
            {editTemplate
              ? "Update the template details"
              : "Fill out the basic details below. Customize the fields in the next step"}
          </SheetDescription>
          {!editTemplate && (
            <Alert className="mt-4 flex items-center">
              <AlertCircle className="h-4 w-4 mb-1" />
              <AlertDescription className="flex items-center justify-between flex-1">
                <div className="flex-1">Want to get started faster?</div>
                <Link href="/app/templates/public" passHref>
                  <Button
                    size="xs"
                    className="ml-2"
                    onClick={() => closeDialog()}
                  >
                    Browse Our Templates
                  </Button>
                </Link>
              </AlertDescription>
            </Alert>
          )}
        </SheetHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 h-full flex flex-col"
        >
          {/* Name Input */}
          <div className="space-y-2  px-4">
            <Label>Name</Label>
            <Input placeholder="Item name..." {...register("name")} />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Description Input */}
          <div className="space-y-2  px-4">
            <Label className="">Description</Label>
            <Textarea
              placeholder="Brief description of the item..."
              className="resize-none"
              rows={3}
              {...register("description")}
            />
            {errors.description && (
              <p className="text-xs text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Creatable Category Select */}
          <div className="space-y-2  px-4">
            <Label>Category</Label>
            <Popover open={selectOpen} onOpenChange={setSelectOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={selectOpen}
                  className="w-full justify-between font-normal"
                >
                  {selectedCategory ? (
                    <span className="truncate">{selectedCategory}</span>
                  ) : (
                    <span className="text-muted-foreground">
                      Select category...
                    </span>
                  )}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-full max-w-lg p-0 w-[400px]"
                align="start"
              >
                <Command>
                  <CommandInput
                    placeholder="Search or add category..."
                    value={searchValue}
                    onValueChange={setSearchValue}
                  />
                  <CommandList>
                    <CommandEmpty className="p-0">
                      {isNewCategory ? (
                        <button
                          type="button"
                          onClick={() => handleAddCategory(searchValue)}
                          className="flex w-full items-center gap-2 px-3 py-2 text-sm text-primary hover:bg-accent hover:text-accent-foreground cursor-pointer"
                        >
                          <Plus className="h-4 w-4" />
                          Create "{searchValue.trim()}"
                        </button>
                      ) : (
                        <div className="p-2 text-xs text-muted-foreground text-center">
                          {loadingCategories
                            ? "Loading categories..."
                            : "No category found."}
                        </div>
                      )}
                    </CommandEmpty>

                    {loadingCategories ? (
                      <CommandGroup heading="Loading categories">
                        <div className="flex items-center justify-center gap-2 px-3 py-2 text-sm text-muted-foreground">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Loading...
                        </div>
                      </CommandGroup>
                    ) : (
                      <CommandGroup>
                        {categories.map((cat) => (
                          <CommandItem
                            key={cat}
                            value={cat}
                            onSelect={() => {
                              setValue("category", cat, {
                                shouldValidate: true,
                              });
                              setSelectOpen(false);
                              setSearchValue("");
                            }}
                            className="cursor-pointer"
                          >
                            {cat}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    )}

                    {/* Show create option if user types something not in the list */}
                    {isNewCategory && (
                      <CommandGroup heading="New Category">
                        <CommandItem
                          value={searchValue}
                          onSelect={() => handleAddCategory(searchValue)}
                          className="text-primary font-medium cursor-pointer"
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Add "{searchValue.trim()}"
                        </CommandItem>
                      </CommandGroup>
                    )}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {errors.category && (
              <p className="text-xs text-destructive">
                {errors.category.message}
              </p>
            )}
          </div>

          <SheetFooter className="mt-auto">
            {/* <Button
              type="button"
              variant="outline"
              onClick={() => closeDialog()}
            >
              Cancel
            </Button> */}
            <Button
              type="submit"
              disabled={
                isSubmitting ||
                creatingTemplate ||
                updatingTemplate ||
                loadingCategories
              }
            >
              {creatingTemplate || updatingTemplate ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {editTemplate ? "Updating..." : "Creating..."}
                </>
              ) : editTemplate ? (
                "Update Template"
              ) : (
                "Create Template"
              )}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}

export const NewTemplateModalTrigger = () => {
  const { openDialog } = useNewTemplateSheet();
  return (
    <Button onClick={() => openDialog()} variant="default">
      <Plus /> New Template
    </Button>
  );
};
