import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import prisma from "@/lib/db";

export default async function AdminPage({ cookies }) {
  if (!isAuthenticated({ headers: { cookie: cookies().toString() } })) {
    redirect("/admin/login");
  }
  const [inboxes, domainSuffix] = await Promise.all([
    prisma.inbox.findMany({ orderBy: { createdAt: "asc" } }),
    Promise.resolve(process.env.DOMAIN_SUFFIX || ""),
  ]);

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">AICENGMAIL</h1>
          <form action="/admin/logout" method="post">
            <button className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800">
              Logout
            </button>
          </form>
        </div>

        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <div className="grid grid-cols-12 gap-4 bg-gray-50 px-6 py-3 text-sm font-semibold text-gray-600 border-b">
            <div className="col-span-4">Display Name</div>
            <div className="col-span-3">Local part</div>
            <div className="col-span-2">Full address</div>
            <div className="col-span-3 text-right">Actions</div>
          </div>

          <div className="divide-y">
            {inboxes.map((inbox) => (
              <Row key={inbox.id} inbox={inbox} domainSuffix={domainSuffix} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ inbox, domainSuffix }) {
  return (
    <div className="grid grid-cols-12 gap-4 px-6 py-4 items-center">
      <div className="col-span-4">
        <input
          id={`name-${inbox.id}`}
          defaultValue={inbox.displayName}
          className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div className="col-span-3">
        <input
          id={`part-${inbox.id}`}
          defaultValue={inbox.emailAddress.split("@")[0]}
          className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div className="col-span-2 text-sm text-gray-600">
        @{domainSuffix}
      </div>
      <div className="col-span-3 flex justify-end gap-2">
        <a
          href={`/admin/inbox/${inbox.id}`}
          className="text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          View Inbox
        </a>
        <button
          formAction={`/api/inboxes`}
          formMethod="post"
          onClick={async (e) => {
            e.preventDefault();
            const id = inbox.id;
            const displayName = document.getElementById(`name-${id}`).value;
            const localPart = document.getElementById(`part-${id}`).value;

            const fd = new FormData();
            fd.append("id", id);
            fd.append("displayName", displayName);
            fd.append("localPart", localPart);

            const res = await fetch("/api/inboxes", {
              method: "POST",
              body: fd,
            });

            if (res.ok) {
              window.location.reload();
            } else {
              const data = await res.json();
              alert(data.error || "Save failed");
            }
          }}
          className="text-sm font-medium px-3 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
        >
          Save
        </button>
      </div>
    </div>
  );
}
