import prisma from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ ok: true });
}
