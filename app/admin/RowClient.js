"use client";

import { useState } from "react";

export default function RowClient({ inbox, domainSuffix, onSave }) {
  const [name, setName] = useState(inbox.displayName);
  const [part, setPart] = useState(inbox.emailAddress.split("@")[0]);

  return (
<div className="grid grid-cols-12 gap-4 px-6 py-4 items-center">
<div className="col-span-4">
<input value={name} onChange={(e) => setName(e.target.value)} className="border rounded p-2 w-full" />
</div>
<div className="col-span-3">
<input value={part} onChange={(e) => setPart(e.target.value)} className="border rounded p-2 w-full" />
<span className="ml-2 text-gray-500">@{domainSuffix}</span>
</div>
<div className="col-span-3">
<a href={`/admin/inbox/${inbox.id}`} className="text-blue-600 underline">View Inbox</a>
</div>
<div className="col-span-2 text-right">
<button
onClick={async () => {
const fd = new FormData();
fd.append("id", inbox.id);
fd.append("displayName", name);
fd.append("localPart", part);
const res = await fetch("/api/inboxes", { method: "PATCH", body: fd });
if (res.ok) {
alert("Saved");
window.location.reload();
} else {
const data = await res.json();
alert(data.error || "Save failed");
}
}}
className="px-3 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
>
Save
</button>
</div>
</div>
);
}