import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json([], { status: 200 });
  const emails = await prisma.email.findMany({
    where: { inboxId: id },
    orderBy: { receivedAt: 'desc' },
  });
  return NextResponse.json(emails);
}
