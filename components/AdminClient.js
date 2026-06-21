"use client";

import { useState } from "react";

export default function AdminClient(props) {
  const [saving, setSaving] = useState(null);
  const { inboxes, domainSuffix } = props;

  async function saveRow(id, name, part) {
    setSaving(id);
    try {
      const res = await fetch("/api/inboxes", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, displayName: name, localPart: part }),
      });
      if (res.ok) {
        alert("Saved");
      } else {
        const data = await res.json();
        alert(data.error || "Failed");
      }
    } finally {
      setSaving(null);
    }
  }

  function onSave(inbox) {
    const name = document.getElementById("name-" + inbox.id).value;
    const part = document.getElementById("part-" + inbox.id).value;
    saveRow(inbox.id, name, part);
  }

  function logout() {
    fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "logout" }),
    }).then(() => {
      window.location.href = "/";
    });
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">AICENGMAIL Admin</h1>
          <button onClick={logout} className="px-4 py-2 bg-gray-900 text-white rounded">Logout</button>
        </div>

        <div className="overflow-x-auto bg-white rounded-lg border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left p-3">Name</th>
                <th className="text-left p-3">Inbox Address</th>
                <th className="text-left p-3">Inbox</th>
                <th className="text-right p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {inboxes.map((inbox) => (
                <tr key={inbox.id} className="border-b last:border-none">
                  <td className="p-3">
                    <input
                      id={"name-" + inbox.id}
                      defaultValue={inbox.displayName}
                      className="border rounded p-2 w-full"
                    />
                  </td>
                  <td className="p-3">
                    <input
                      id={"part-" + inbox.id}
                      defaultValue={inbox.emailAddress.split("@")[0]}
                      className="border rounded p-2 w-full"
                    />
                    <span className="ml-2 text-gray-500">@{domainSuffix}</span>
                  </td>
                  <td className="p-3">
                    <a href={"/admin/inbox/" + inbox.id} className="text-blue-600 underline">
                      Open
                    </a>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => onSave(inbox)}
                      disabled={saving === inbox.id}
                      className="px-3 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
                    >
                      {saving === inbox.id ? "Saving\u2026" : "Save"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
