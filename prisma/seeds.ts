/*import { PrismaClient } from '@/lib/generated/prisma';
import { users, complaints, suggestions, upvotes, auditLogs, chatSessions, messages, uiPrototypes } from '@/lib/placeholder-data';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Seed users
  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        id: user.id,
        clerkId: user.clerkId,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  }

  // Seed complaints
  for (const complaint of complaints) {
    await prisma.complaint.upsert({
      where: { id: complaint.id },
      update: {},
      create: complaint,
    });
  }

  // Seed suggestions
  for (const suggestion of suggestions) {
    await prisma.suggestion.upsert({
      where: { id: suggestion.id },
      update: {},
      create: suggestion,
    });
  }

  // Seed upvotes
  for (const upvote of upvotes) {
    await prisma.upvote.upsert({
      where: { id: upvote.id },
      update: {},
      create: upvote,
    });
  }

  // Seed audit logs
  for (const log of auditLogs) {
    await prisma.auditLog.upsert({
      where: { id: log.id },
      update: {},
      create: log,
    });
  }

  // Seed chat sessions
  for (const session of chatSessions) {
    await prisma.chatSession.upsert({
      where: { id: session.id },
      update: {},
      create: session,
    });
  }

  // Seed messages
  for (const message of messages) {
    await prisma.message.upsert({
      where: { id: message.id },
      update: {},
      create: message,
    });
  }

  // Seed UI prototypes
  for (const prototype of uiPrototypes) {
    await prisma.uIPrototype.upsert({
      where: { id: prototype.id },
      update: {},
      create: {
        id: prototype.id,
        sessionId: prototype.sessionId,
        promptHash: prototype.promptHash,
        schemaJson: prototype.schemaJson,
        previewPath: prototype.previewPath,
        costCents: prototype.costCents,
      },
    });
  }

  console.log('Seeding completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });*/