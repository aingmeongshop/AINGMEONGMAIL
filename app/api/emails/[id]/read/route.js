import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
  const email = await prisma.email.update({
    where: { id: params.id },
    data: { isRead: true },
  });

  return NextResponse.json({ success: true, email });
}
