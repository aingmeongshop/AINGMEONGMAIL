import prisma from "@/lib/db";

export default async function InboxPage({ params }) {
  const inbox = await prisma.inbox.findUnique({
    where: { id: params.id },
    include: { emails: { orderBy: { receivedAt: "desc" } } },
  });
  if (!inbox) return <div className="p-8">Inbox not found</div>;
  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{inbox.displayName}</h1>
            <p className="text-sm text-gray-600 mt-1">{inbox.emailAddress}</p>
          </div>
          <a href="/admin" className="text-sm font-medium text-blue-600 hover:text-blue-800">
            ← Back
          </a>
        </div>

        <EmailClient inboxId={inbox.id} />
      </div>
    </div>
  );
}
