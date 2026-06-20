import prisma from "@/lib/db";
import DOMPurify from "dompurify";

function formatDate(date) {
  return new Date(date).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function EmailPage({ params }) {
  const email = await prisma.email.findUnique({
    where: { id: params.emailId },
    include: { inbox: { select: { displayName: true, emailAddress: true } } },
  });

  if (!email) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold">Email not found</h1>
        <a href={`/admin/inbox/${params.id}`} className="text-blue-600 underline mt-4 inline-block">← Back</a>
      </div>
    );
  }

  let bodyPreview = email.bodyText;
  if (!bodyPreview && email.bodyHtml) {
    bodyPreview = email.bodyHtml.replace(/<[^>]*>/g, "");
  }
  bodyPreview = bodyPreview?.slice(0, 300) || "";

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{email.subject || "(no subject)"}</h1>
          <p className="text-gray-600 mt-1">
            From: <span className="font-medium">{email.fromAddress}</span>
          </p>
          <p className="text-xs text-gray-500 mt-1">{formatDate(email.receivedAt)}</p>
        </div>
        <a
          href={`/admin/inbox/${params.id}`}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
        >
          ← Back
        </a>
      </div>

      {email.attachments && JSON.parse(email.attachments).length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded p-4 mb-4">
          <h2 className="text-sm font-semibold mb-2">Attachments</h2>
          <ul className="text-sm space-y-1">
            {JSON.parse(email.attachments).map((att, i) => (
              <li key={i}>
                <a href={att.url} target="_blank" rel="noreferrer" className="text-blue-700 underline hover:text-blue-900">
                  {att.filename || att.name || `attachment-${i + 1}`}
                </a>
                {att.size ? <span className="text-gray-500 ml-2">({Math.round(att.size / 1024)} KB)</span> : null}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="bg-white border rounded shadow-sm prose max-w-none p-6">
        {email.bodyHtml ? (
          <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(email.bodyHtml) }} />
        ) : (
          <pre className="whitespace-pre-wrap text-sm text-gray-800">{bodyPreview || "(empty)"}</pre>
        )}
      </div>
    </div>
  );
}
