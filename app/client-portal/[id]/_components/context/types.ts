import { TemplateField } from "@/lib/generated/prisma/browser";
import {
  TemplateClientAssignationGetPayload,
  TemplateFieldGetPayload,
} from "@/lib/generated/prisma/models";

export type ClientWorkflowPayload = TemplateClientAssignationGetPayload<{
  include: {
    template: {
      include: {
        user: true;
        sections: {
          include: {
            fields: {
              include: {
                completionValue: {
                  include: {
                    files: true;
                  };
                };
              };
            };
          };
        };
      };
    };
    client: true;
  };
}>;

export type ItemStatus = "pending" | "uploading" | "done";

export type PortalItem = TemplateFieldGetPayload<{
  include: {
    completionValue: {
      include: {
        files: true;
      };
    };
  };
}> & {
  status: ItemStatus;
  value?: string;
};

export type PortalSection = {
  id: string;
  name: string;
  items: PortalItem[];
};
