import { NextResponse } from "next/server";
import { setSessionCookie, isAuthenticated } from "@/lib/auth";

export async function POST(req) {
  try {
    const body = await req.json();
    const { action, password } = body || {};

    if (action === "login") {
      if (!password || password !== process.env.DASH_PASSWORD) {
        return NextResponse.json({ error: "Invalid password" }, { status: 401 });
      }

      const res = NextResponse.json({ ok: true });
      setSessionCookie(res, password);
      return res;
    }

    if (action === "logout") {
      const cookieHeader = req.headers.get("cookie") || "";
      if (!isAuthenticated({ headers: { cookie: cookieHeader } })) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const res = NextResponse.json({ ok: true });
      setSessionCookie(res, "");
      return res;
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function GET(req) {
  const cookieHeader = req.headers.get("cookie") || "";
  if (isAuthenticated({ headers: { cookie: cookieHeader } })) {
    return NextResponse.json({ authenticated: true });
  }
  return NextResponse.json({ authenticated: false }, { status: 401 });
}
