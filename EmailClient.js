import React from "react";

export default function EmailClient({ email, inboxId, initialUnreadCount }) {
  const [marked, setMarked] = React.useState(false);

  React.useEffect(() => {
    if (email.isRead || marked) return;
    if (initialUnreadCount === 0) {
      setMarked(true);
      return;
    }
    const timer = setTimeout(() => {
      fetch(`/api/emails/${email.id}/read`, { method: "POST" }).then(() => {
        setMarked(true);
        if (initialUnreadCount > 1 && typeof window !== "undefined") {
          const url = new URL(window.location.href);
          url.searchParams.set("count", initialUnreadCount - 1);
          window.history.replaceState({}, "", url);
        }
      }).catch(() => {});
    }, 3000);
    return () => clearTimeout(timer);
  }, [email.isRead, marked, initialUnreadCount, email.id]);

  let bodyPreview = email.bodyText;
  if (!bodyPreview && email.bodyHtml) {
    bodyPreview = email.bodyHtml.replace(/<[^>]*>/g, "");
  }

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6">
        <a href={`/admin/inbox/${inboxId}`} className="text-blue-600 underline text-sm">← Back to inbox</a>
      </div>
      <div className="bg-white border rounded shadow-sm p-6 mb-4">
        <h1 className="text-2xl font-bold mb-2">{email.subject || "(no subject)"}</h1>
        <div className="text-sm text-gray-600">
          <p><span className="font-medium">From:</span> {email.fromAddress}</p>
          <p className="mt-1"><span className="font-medium">Date:</span> {new Date(email.receivedAt).toLocaleString()}</p>
        </div>
      </div>
      {Array.isArray(email.attachments) && email.attachments.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded p-4 mb-4">
          <h2 className="text-sm font-semibold mb-2">Attachments</h2>
          <ul className="text-sm space-y-1">
            {email.attachments.map((att, i) => (
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
      <div className="bg-white border rounded shadow-sm p-6">
        <h2 className="text-sm font-semibold mb-2 text-gray-700">Email body</h2>
        {email.bodyHtml ? (
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(email.bodyHtml) }}
          />
        ) : (
          <pre className="whitespace-pre-wrap text-sm text-gray-800">
            {bodyPreview || "(empty)"}
          </pre>
        )}
      </div>
    </div>
  );
}
