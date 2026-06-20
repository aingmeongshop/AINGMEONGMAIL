import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";

export async function GET(req) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const inboxes = await prisma.inbox.findMany({ orderBy: { createdAt: "asc" } });
  return NextResponse.json(inboxes);
}

export async function PATCH(req) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const updated = await prisma.inbox.update({
    where: { id: body.id },
    data: {
      displayName: body.displayName,
      emailAddress: `${body.localPart}@${process.env.DOMAIN_SUFFIX}`,
    },
  });
  return NextResponse.json(updated);
}

export async function PATCH(req) {
  const body = await req.json();
  const updated = await prisma.inbox.update({
    where: { id: body.id },
    data: {
      displayName: body.displayName,
      emailAddress: `${body.localPart}@${process.env.DOMAIN_SUFFIX}`,
    },
  });
  return NextResponse.json(updated);
}
