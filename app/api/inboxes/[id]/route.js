import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET(req, { params }) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const emails = await prisma.email.findMany({
    where: { inboxId: params.id },
    orderBy: { receivedAt: "desc" },
  });
  return NextResponse.json(emails);
}

export async function POST(req, { params }) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const updated = await prisma.inbox.update({
    where: { id: params.id },
    data: { displayName: body.displayName, emailAddress: `${body.localPart}@${process.env.DOMAIN_SUFFIX}` },
  });
  return NextResponse.json(updated);
}
