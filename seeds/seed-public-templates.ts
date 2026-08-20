import { faker } from "@faker-js/faker";
import { TemplateFieldType } from "@/lib/generated/prisma/enums";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/lib/generated/prisma/client";
import dotenv from "dotenv";
import { exit } from "process";

dotenv.config();

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
export const prisma =
  global.prisma ||
  new PrismaClient({
    adapter,
  });

export async function seedTemplates() {
  const templates = [
    {
      name: "Website Onboarding",
      category: "Marketing",
      sections: [
        {
          name: "Business Information",
          fields: [
            {
              name: "Business Name",
              type: TemplateFieldType.TEXT,
              required: true,
            },
            { name: "Website URL", type: TemplateFieldType.URL },
            {
              name: "Contact Email",
              type: TemplateFieldType.EMAIL,
              required: true,
            },
            {
              name: "Phone Number",
              type: TemplateFieldType.PHONE,
              required: false,
            },
          ],
        },
        {
          name: "Brand Assets",
          fields: [
            {
              name: "Company Logo",
              type: TemplateFieldType.IMAGE,
              required: true,
            },
            {
              name: "Brand Guidelines",
              type: TemplateFieldType.FILE,
              required: false,
            },
          ],
        },
        {
          name: "Content",
          fields: [
            {
              name: "Homepage Copy",
              type: TemplateFieldType.TEXTAREA,
              required: false,
            },
            {
              name: "About Us",
              type: TemplateFieldType.TEXTAREA,
              required: false,
            },
          ],
        },
      ],
    },
    {
      name: "Tax Preparation",
      category: "Accounting",
      sections: [
        {
          name: "Personal Details",
          fields: [
            { name: "Full Name", type: TemplateFieldType.TEXT, required: true },
            { name: "Email", type: TemplateFieldType.EMAIL, required: true },
            { name: "Phone", type: TemplateFieldType.PHONE, required: false },
          ],
        },
        {
          name: "Documents",
          fields: [
            {
              name: "Government ID",
              type: TemplateFieldType.FILE,
              required: true,
            },
            {
              name: "W-2 / Income Statement",
              type: TemplateFieldType.FILE,
              required: true,
            },
            {
              name: "Bank Statements",
              type: TemplateFieldType.FILE,
              allowMultiple: true,
              required: false,
            },
          ],
        },
      ],
    },
    {
      name: "SEO Onboarding",
      category: "Marketing",
      sections: [
        {
          name: "Business",
          fields: [
            { name: "Website", type: TemplateFieldType.URL, required: true },
            {
              name: "Business Description",
              type: TemplateFieldType.TEXTAREA,
              required: false,
            },
          ],
        },
        {
          name: "Access",
          fields: [
            {
              name: "Google Search Console",
              type: TemplateFieldType.URL,
              required: false,
            },
            {
              name: "Google Analytics",
              type: TemplateFieldType.URL,
              required: false,
            },
          ],
        },
      ],
    },
    {
      name: "Bookkeeping Setup",
      category: "Accounting",
      sections: [
        {
          name: "Business",
          fields: [
            {
              name: "Company Name",
              type: TemplateFieldType.TEXT,
              required: true,
            },
            {
              name: "VAT Number",
              type: TemplateFieldType.TEXT,
              required: false,
            },
          ],
        },
        {
          name: "Financial Documents",
          fields: [
            {
              name: "Previous Reports",
              type: TemplateFieldType.FILE,
              required: false,
            },
            {
              name: "Invoices",
              type: TemplateFieldType.FILE,
              allowMultiple: true,
            },
            {
              name: "Receipts",
              type: TemplateFieldType.FILE,
              allowMultiple: true,
            },
          ],
        },
      ],
    },
    {
      name: "Employee Onboarding",
      category: "HR",
      sections: [
        {
          name: "Personal Information",
          fields: [
            { name: "Full Name", type: TemplateFieldType.TEXT, required: true },
            { name: "Email", type: TemplateFieldType.EMAIL, required: true },
            { name: "Phone", type: TemplateFieldType.PHONE, required: false },
          ],
        },
        {
          name: "Required Documents",
          fields: [
            { name: "Resume", type: TemplateFieldType.FILE, required: true },
            {
              name: "Passport / ID",
              type: TemplateFieldType.FILE,
              required: true,
            },
          ],
        },
      ],
    },
    {
      name: "Mortgage Application",
      category: "Finance",
      sections: [
        {
          name: "Applicant",
          fields: [
            { name: "Full Name", type: TemplateFieldType.TEXT, required: true },
            { name: "Email", type: TemplateFieldType.EMAIL, required: false },
            {
              name: "Annual Income",
              type: TemplateFieldType.NUMBER,
              required: false,
            },
          ],
        },
        {
          name: "Supporting Documents",
          fields: [
            {
              name: "Payslips",
              type: TemplateFieldType.FILE,
              allowMultiple: true,
            },
            {
              name: "Bank Statements",
              type: TemplateFieldType.FILE,
              allowMultiple: true,
            },
            {
              name: "Identification",
              type: TemplateFieldType.FILE,
              required: true,
            },
          ],
        },
      ],
    },
  ];

  for (const template of templates) {
    await prisma.template.create({
      data: {
        name: template.name,
        description: faker.lorem.sentence(),
        category: template.category,
        requiredFields: template.sections.reduce(
          (acc, section) =>
            acc + section.fields.filter((field) => field.required).length,
          0,
        ),
        totalFields: template.sections.reduce(
          (acc, section) => acc + section.fields.length,
          0,
        ),
        totalSections: template.sections.length,

        headerImage: faker.image.urlPicsumPhotos({
          width: 1200,
          height: 400,
        }),
        sections: {
          create: template.sections.map((section, sectionIndex) => ({
            name: section.name,
            order: sectionIndex,
            fields: {
              create: section.fields.map((field, fieldIndex) => ({
                name: field.name,
                description: faker.helpers.maybe(() => faker.lorem.sentence(), {
                  probability: 0.6,
                }),
                placeholder: faker.helpers.maybe(
                  () => `Enter ${field.name.toLowerCase()}`,
                  { probability: 0.7 },
                ),
                type: field.type,
                required: field.required,
                allowMultiple: faker.datatype.boolean(),
                characterLimit:
                  field.type === TemplateFieldType.TEXT ||
                  field.type === TemplateFieldType.TEXTAREA
                    ? faker.helpers.arrayElement([100, 250, 500, 1000])
                    : null,
                order: fieldIndex,
              })),
            },
          })),
        },
      },
    });
  }

  console.log("✅ Seeded 6 mock templates.");
  exit(0);
}

seedTemplates();
