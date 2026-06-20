import { serialize } from "cookie";

export function setSessionCookie(res, value) {
  res.setHeader("Set-Cookie", serialize("aeg_session", value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  }));
}

export function getSessionCookie(req) {
  const cookie = req.headers.cookie || "";
  const match = cookie.match(/aeg_session=([^;]+)/);
  return match ? match[1] : null;
}

export function isAuthenticated(req) {
  return getSessionCookie(req) === process.env.DASH_PASSWORD;
}
