import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const domain = process.env.DOMAIN_SUFFIX || "";
  const inboxes = [];
  for (let i = 1; i <= 5; i++) {
    const localPart = `inbox${i}`;
    inboxes.push({
      displayName: `Inbox ${i}`,
      emailAddress: `${localPart}@${domain}`,
    });
  }
  for (const inbox of inboxes) {
    await prisma.inbox.upsert({
      where: { emailAddress: inbox.emailAddress },
      update: {},
      create: inbox,
    });
  }
  console.log("Seeded 5 inboxes");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
