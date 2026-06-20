import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(req) {
  const signature = req.headers.get("x-webhook-secret") || req.headers.get("x-signature");

  if (signature !== process.env.INBOUND_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let payload;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const toRaw = payload.to || payload.To || payload.recipient || payload.Recipient;
  const from = payload.from || payload.From || payload.sender || payload.Sender;
  const subject = payload.subject || payload.Subject || "";
  const bodyText = payload.text || payload.bodyText || payload.textPlain || payload.TextPlain || null;
  const bodyHtml = payload.html || payload.bodyHtml || payload.textHtml || payload.TextHtml || null;
  const attachments = payload.attachments || payload.Attachments || null;
  const receivedAtRaw = payload.receivedAt || payload.date || payload.Date || payload.timestamp || payload.Timestamp;

  const toAddress = Array.isArray(toRaw) ? toRaw[0] : toRaw;

  if (!toAddress) {
    return NextResponse.json({ error: "Missing recipient (to)" }, { status: 400 });
  }

  const inbox = await prisma.inbox.findUnique({
    where: { emailAddress: toAddress },
  });

  if (!inbox) {
    console.log("[inbound] Unrouted email to:", toAddress);
    return NextResponse.json({ status: "received", routed: false }, { status: 202 });
  }

  const receivedAt = receivedAtRaw ? new Date(receivedAtRaw) : new Date();

  await prisma.email.create({
    data: {
      inboxId: inbox.id,
      fromAddress: from || "unknown",
      subject,
      bodyText,
      bodyHtml,
      attachments,
      receivedAt,
      isRead: false,
    },
  });

  return NextResponse.json({ status: "received", routed: true }, { status: 201 });
}
