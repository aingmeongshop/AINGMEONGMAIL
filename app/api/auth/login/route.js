import { NextResponse } from 'next/server';
import { setSessionCookie } from '@/lib/auth';

export async function POST(req) {
  const body = await req.json();
  const { password } = body || {};
  if (!password || password !== process.env.DASH_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  setSessionCookie(res, password);
  return res;
}

export async function GET() {
  return NextResponse.json({ ok: true });
}
