import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(req, { params }) {
  const { id } = params;
  const emails = await prisma.email.findMany({
    where: { inboxId: id },
    orderBy: { receivedAt: "desc" },
  });
  return NextResponse.json(emails);
}
