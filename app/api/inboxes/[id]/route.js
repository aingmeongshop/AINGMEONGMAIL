import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  const inbox = await prisma.inbox.findUnique({
    where: { id },
    include: { emails: { orderBy: { receivedAt: 'desc' } } },
  });
  if (!inbox) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(inbox);
}

export async function PATCH(req) {
  const body = await req.json();
  const { id, displayName, localPart } = body;
  const emailAddress = `${localPart}@${process.env.DOMAIN_SUFFIX}`;
  const updated = await prisma.inbox.update({
    where: { id },
    data: { displayName, emailAddress },
  });
  return NextResponse.json({ inbox: updated });
}
