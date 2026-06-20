"use client";
import { useState, useEffect } from "react";
import DOMPurify from "dompurify";

export default function EmailClient({ email, inboxId }) {
  const [selected, setSelected] = useState(null);
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!inboxId) return;
    setLoading(true);
    fetch(`/api/inboxes/${inboxId}/emails`)
      .then((r) => r.json())
      .then((data) => {
        setEmails(data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [inboxId]);

  const handleSelect = async (e) => {
    setSelected(e);
    if (!e.isRead) {
      await fetch(`/api/emails/${e.id}/read`, { method: "POST" }).catch(() => {});
    }
  };

  return (
    <div className="flex h-[calc(100vh-120px)] bg-white rounded-xl border shadow-sm overflow-hidden">
      <div className="w-96 border-r flex flex-col">
        <div className="p-4 border-b bg-gray-50">
          <h3 className="text-sm font-semibold text-gray-700">Inbox</h3>
        </div>
        <div className="flex-1 overflow-auto">
          {loading ? (
            <div className="p-4 text-sm text-gray-500">Loading…</div>
          ) : emails.length === 0 ? (
            <div className="p-4 text-sm text-gray-500">No emails yet.</div>
          ) : (
            emails.map((e) => (
              <div
                key={e.id}
                onClick={() => handleSelect(e)}
                className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                  selected?.id === e.id ? "bg-blue-50" : ""
                }`}
              >
                <div className="flex items-start justify-between">
                  <span className={`text-sm truncate flex-1 ${!e.isRead ? "font-semibold text-gray-900" : "text-gray-700"}`}>
                    {e.fromAddress}
                  </span>
                  <span className="text-xs text-gray-500 ml-2 whitespace-nowrap">
                    {new Date(e.receivedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                </div>
                <p className={`text-sm mt-1 truncate ${!e.isRead ? "font-medium text-gray-900" : "text-gray-600"}`}>
                  {e.subject || "(no subject)"}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {selected ? (
          <>
            <div className="p-6 border-b bg-white">
              <h2 className="text-xl font-bold text-gray-900 mb-1">{selected.subject || "(no subject)"}</h2>
              <div className="text-sm text-gray-600">
                From: <span className="font-medium">{selected.fromAddress}</span>
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {new Date(selected.receivedAt).toLocaleString()}
              </div>
            </div>

            {selected.attachments && selected.attachments.length > 0 && (
              <div className="px-6 py-3 border-b bg-amber-50">
                <div className="text-sm font-semibold text-gray-700 mb-2">Attachments</div>
                <ul className="space-y-1">
                  {selected.attachments.map((att, i) => (
                    <li key={i}>
                      <a
                        href={att.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 underline text-sm hover:text-blue-800"
                      >
                        {att.filename || att.name || `attachment-${i + 1}`}
                      </a>
                      {att.size && (
                        <span className="text-xs text-gray-500 ml-2">
                          ({Math.round(att.size / 1024)} KB)
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex-1 overflow-auto p-6 prose max-w-none">
              {selected.bodyHtml ? (
                <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(selected.bodyHtml) }} />
              ) : (
                <pre className="whitespace-pre-wrap text-sm text-gray-800">{selected.bodyText || "(empty)"}</pre>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            Select an email to read
          </div>
        )}
      </div>
    </div>
  );
}
