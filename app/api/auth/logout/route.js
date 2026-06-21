import { NextResponse } from 'next/server';
import { setSessionCookie } from '@/lib/auth';

export async function POST(req) {
  const res = NextResponse.json({ ok: true });
  setSessionCookie(res, '');
  return res;
}
