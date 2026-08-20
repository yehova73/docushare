import { TemplateFieldType } from "@/lib/generated/prisma/enums";
import {
  Type,
  AlignLeft,
  Hash,
  Mail,
  Phone,
  Upload,
  Image,
  Square,
} from "lucide-react";

export const fieldIcons = {
  Type,
  AlignLeft,
  Hash,
  Mail,
  Phone,
  Upload,
  Image,
  Square,
};

export const getFieldIcon = (type: TemplateFieldType) => {
  switch (type) {
    case TemplateFieldType.TEXT:
      return Type;
    case TemplateFieldType.TEXTAREA:
      return AlignLeft;
    case TemplateFieldType.NUMBER:
      return Hash;
    case TemplateFieldType.EMAIL:
      return Mail;
    case TemplateFieldType.PHONE:
      return Phone;
    case TemplateFieldType.FILE:
      return Upload;
    case TemplateFieldType.IMAGE:
      return Image;
    default:
      return Square;
  }
};

export const findFieldType = (type: TemplateFieldType) =>
  fieldsDescriptions
    .flatMap<{
      type: TemplateFieldType;
      name: string;
      description: string;
    }>((g) => g.items)
    .find((i) => i.type === type);

export const fieldsDescriptions = [
  {
    type: "basic",
    name: "Basic Fields",
    items: [
      {
        type: TemplateFieldType.TEXT,
        name: "Text",
        description: "A simple text field for short input.",
      },
      {
        type: TemplateFieldType.TEXTAREA,
        name: "Textarea",
        description: "A larger text area for longer input.",
      },
      {
        type: TemplateFieldType.NUMBER,
        name: "Number",
        description: "A field for numeric input.",
      },
      {
        type: TemplateFieldType.EMAIL,
        name: "Email",
        description: "A field for email addresses.",
      },
      {
        type: TemplateFieldType.PHONE,
        name: "Phone",
        description: "A field for phone numbers.",
      },
    ],
  },
  {
    type: "file",
    name: "File Upload Fields",
    items: [
      {
        type: TemplateFieldType.FILE,
        name: "File Upload",
        description: "A field for uploading files.",
      },
      {
        type: TemplateFieldType.IMAGE,
        name: "Image Upload",
        description: "A field for uploading images.",
      },
    ],
  },
];
