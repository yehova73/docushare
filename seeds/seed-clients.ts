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

export async function seedClients() {
  const clients = Array.from({ length: 10 }, () => ({
    name: faker.company.name(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    company: faker.company.name(),
  }));

  const user = await prisma.user.findFirst({
    where: {
      email: {
        contains: "mihaiblaga",
      },
    },
  });

  if (!user) {
    console.error(
      "User not found. Please ensure the user exists before seeding clients.",
    );
    exit(1);
  }

  for (const clientData of clients) {
    await prisma.client.create({
      data: {
        ...clientData,
        userId: user.id,
      },
    });
  }

  exit(0);
}

seedClients();
