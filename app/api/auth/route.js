import { NextResponse } from "next/server";
import { setSessionCookie, isAuthenticated } from "@/lib/auth";

export async function POST(req) {
  try {
    const body = await req.json();
    const { action, password } = body || {};

    console.log("[auth] action=", JSON.stringify(action), "passwordLength=", typeof password === "string" ? password.length : "n/a", "envLength=", (process.env.DASH_PASSWORD || "").length, "envTrimmedLength=", (process.env.DASH_PASSWORD || "").trim().length);

    if (action === "logout" || (!action && !password)) {
      const cookieHeader = req.headers.get("cookie") || "";
      if (!isAuthenticated({ headers: { cookie: cookieHeader } })) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      const res = NextResponse.json({ ok: true });
      setSessionCookie(res, "");
      return res;
    }

    if (!password) {
      return NextResponse.json({ error: "Password required" }, { status: 400 });
    }

    const envPassword = (process.env.DASH_PASSWORD || "").trim();
    const inputPassword = password.trim();

    console.log("[auth] comparing envPassword length=", envPassword.length, "inputPassword length=", inputPassword.length, "match=", inputPassword === envPassword);

    if (inputPassword !== envPassword) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    const res = NextResponse.json({ ok: true });
    setSessionCookie(res, inputPassword);
    return res;
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
