import { NextResponse } from "next/server";
import { setSessionCookie } from "@/lib/auth";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  setSessionCookie(res, "");
  return res;
}
