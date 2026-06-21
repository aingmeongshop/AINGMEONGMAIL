import prisma from "@/lib/db";
import AdminClient from "@/components/AdminClient";

export default async function AdminPage() {
  const inboxes = await prisma.inbox.findMany({ orderBy: { createdAt: "asc" } });
  const domainSuffix = process.env.DOMAIN_SUFFIX || "";

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminClient inboxes={inboxes} domainSuffix={domainSuffix} />
    </div>
  );
}
