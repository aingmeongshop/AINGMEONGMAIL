export function setSessionCookie(res, value) {
  const encoded = encodeURIComponent(value);
  const secure = process.env.NODE_ENV === "production" ? " Secure" : "";
  const cookie = `aeg_session=${encoded}; HttpOnly; SameSite=Strict; Path=/; Max-Age=604800${secure}`;
  res.headers.append("Set-Cookie", cookie);
}

export function getSessionCookie(req) {
  const cookie = (req.headers && req.headers.get) ? req.headers.get("cookie") : (req.headers.cookie || "");
  const match = cookie.match(/aeg_session=([^;]+)/);
  return match ? match[1] : null;
}

export function isAuthenticated(req) {
  const cookie = getSessionCookie(req);
  if (!cookie) return false;
  return cookie === (process.env.DASH_PASSWORD || "").trim();
}
