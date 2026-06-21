import prisma from "@/lib/db";
import InboxClient from "@/components/InboxPage";

export default async function InboxPage({ params }) {
  const inbox = await prisma.inbox.findUnique({
    where: { id: params.id },
    include: { emails: { orderBy: { receivedAt: "desc" } } },
  });
  if (!inbox) return <div className="p-8">Inbox not found</div>;
  return (
    <div className="min-h-screen bg-gray-50">
      <InboxClient inboxId={inbox.id} initialEmails={inbox.emails} displayName={inbox.displayName} emailAddress={inbox.emailAddress} />
    </div>
  );
}
