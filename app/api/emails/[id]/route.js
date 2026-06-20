import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(req, { params }) {
  const { id } = params;
  const email = await prisma.email.findUnique({
    where: { id },
    include: { inbox: { select: { displayName: true, emailAddress: true } } },
  });

  if (!email) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ email });
}

export async function PATCH(req, { params }) {
  const { id } = params;
  const body = await req.json();

  const updated = await prisma.email.update({
    where: { id },
    data: {
      isRead: body.isRead ?? undefined,
    },
  });

  return NextResponse.json({ email: updated });
}
