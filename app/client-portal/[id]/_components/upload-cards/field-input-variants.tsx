import { Textarea } from "@/components/ui/textarea";
import { FileUploadCard } from "./file-upload-card";
import { Input } from "@/components/ui/input";
import { Hash } from "lucide-react";
import { Edit2, Mail, Phone, Globe } from "lucide-react";
import { PortalItem } from "../context/types";
import { isTextField } from "../context/utils";

export const FieldInputVariants: React.FC<{
  item: PortalItem;
  localValue: string | null;
  handleTextChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
}> = ({ item, localValue, handleTextChange }) => {
  if (item.type === "TEXT") {
    return (
      <div className="relative">
        <Edit2 className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={localValue ?? ""}
          onChange={handleTextChange}
          placeholder={item.placeholder ?? "Enter text..."}
          className="pl-8"
          type="text"
        />
      </div>
    );
  }

  if (item.type === "EMAIL") {
    return (
      <div className="relative">
        <Mail className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={localValue ?? ""}
          onChange={handleTextChange}
          placeholder={item.placeholder ?? "Enter text..."}
          className="pl-8"
          type="email"
        />
      </div>
    );
  }

  if (item.type === "PHONE") {
    return (
      <div className="relative">
        <Phone className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={localValue ?? ""}
          onChange={handleTextChange}
          placeholder={item.placeholder ?? "Enter text..."}
          className="pl-8"
          type="text"
        />
      </div>
    );
  }

  if (item.type === "URL") {
    return (
      <div className="relative">
        <Globe className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={localValue ?? ""}
          onChange={handleTextChange}
          placeholder={item.placeholder ?? "Enter text..."}
          className="pl-8"
          type="text"
        />
      </div>
    );
  }

  if (item.type === "NUMBER") {
    return (
      <div className="relative">
        <Hash className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={localValue ?? ""}
          onChange={handleTextChange}
          placeholder={item.placeholder ?? "Enter text..."}
          className="pl-8"
          type="number"
        />
      </div>
    );
  }

  if (item.type === "TEXTAREA") {
    return (
      <div className="relative">
        <Textarea
          value={localValue ?? ""}
          onChange={handleTextChange}
          placeholder={item.placeholder ?? "Enter text..."}
        />
      </div>
    );
  }

  if (!isTextField(item)) {
    return <FileUploadCard item={item} />;
  }
};
