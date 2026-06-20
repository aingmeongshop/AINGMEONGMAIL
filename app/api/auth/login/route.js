import { NextResponse } from "next/server";
import { setSessionCookie } from "@/lib/auth";

export async function POST(req) {
  try {
    const body = await req.json();
    const { password } = body || {};

    if (!password || password !== process.env.DASH_PASSWORD) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    const res = NextResponse.json({ ok: true });
    setSessionCookie(res, password);
    return res;
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
