"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DOMPurify from "dompurify";

export default function InboxClient(props) {
  const router = useRouter();
  const [authed, setAuthed] = useState(null);
  const [emails, setEmails] = useState(props.initialEmails || []);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetch("/api/auth")
      .then((r) => r.json())
      .then((data) => {
        setAuthed(data.authenticated === true);
      })
      .catch(() => setAuthed(false));
  }, []);

  if (authed === false) {
    router.replace("/admin/login");
    return null;
  }
  if (authed === null) return <div className="p-8">Loading…</div>;

  useEffect(() => {
    setEmails(props.initialEmails || []);
  }, [props.initialEmails]);

  useEffect(() => {
    if (!props.inboxId) return;
    fetch("/api/inboxes/" + props.inboxId + "/emails")
      .then(function(r) { return r.json(); })
      .then(function(data) {
        setEmails(data);
        if (data.length > 0) setSelected(data[0]);
      })
      .catch(function() {});
  }, [props.inboxId]);

  function handleSelect(email) {
    setSelected(email);
    if (!email.isRead) {
      fetch("/api/emails/" + email.id + "/read", { method: "POST" }).catch(function() {});
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{props.displayName || "Inbox"}</h1>
            <p className="text-sm text-gray-600">{props.emailAddress || ""}</p>
          </div>
          <a href="/admin" className="text-sm font-medium text-blue-600 hover:text-blue-800">
            ← Back
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded">
            <div className="p-3 bg-gray-50 font-semibold border-b">Emails</div>
            {emails.length === 0 && <p className="p-4 text-gray-500">No emails yet.</p>}
            <ul className="divide-y">
              {emails.map(function(email) {
                return (
                  <li
                    key={email.id}
                    className={"p-3 cursor-pointer hover:bg-gray-50 " + (selected && selected.id === email.id ? "bg-blue-50" : "")}
                    onClick={function() { handleSelect(email); }}
                  >
                    <div className="flex justify-between text-sm">
                      <span className={email.isRead ? "text-gray-700" : "font-semibold"}>{email.fromAddress}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(email.receivedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </span>
                    </div>
                    <div className="text-sm mt-1 truncate">{email.subject || "(no subject)"}</div>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="border rounded p-4">
            {selected ? (
              <EmailDetail email={selected} />
            ) : (
              <p className="text-gray-500">Select an email to read</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function EmailDetail(props) {
  const email = props.email;

  useEffect(function() {
    if (!email.isRead) {
      fetch("/api/emails/" + email.id + "/read", { method: "POST" }).catch(function() {});
    }
  }, [email.id, email.isRead]);

  return (
    <div>
      <h3 className="text-xl font-bold mb-2">{email.subject || "(no subject)"}</h3>
      <p className="text-sm text-gray-600 mb-1">From: {email.fromAddress}</p>
      <p className="text-xs text-gray-400 mb-4">Received: {new Date(email.receivedAt).toLocaleString()}</p>

      {email.attachments && Array.isArray(email.attachments) && email.attachments.length > 0 && (
        <div className="mb-4 p-3 bg-gray-50 rounded border">
          <h4 className="text-sm font-semibold mb-2">Attachments</h4>
          <ul className="list-disc list-inside text-sm">
            {email.attachments.map(function(att, i) {
              return (
                <li key={i}>
                  <a
                    href={att.url || att.filename}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 underline"
                  >
                    {att.filename || att.name || "Attachment " + (i + 1)}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <div className="prose max-w-none">
        {email.bodyHtml ? (
          <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(email.bodyHtml) }} />
        ) : (
          <pre className="whitespace-pre-wrap text-sm">{email.bodyText || "(empty)"}</pre>
        )}
      </div>
    </div>
  );
}
