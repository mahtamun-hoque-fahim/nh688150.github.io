"use client";

import { useState } from "react";
import { Mail, MailOpen, Archive, ChevronDown, Loader2 } from "lucide-react";
import { updateContactMessageStatus } from "@/lib/actions/contact";

interface MessageRow {
  id: string;
  name: string;
  email: string;
  subject: string;
  time: string | null;
  details: string;
  status: string;
  createdAt: Date;
}

const STATUS_STYLES: Record<string, string> = {
  new: "text-accent",
  read: "text-text-muted",
  archived: "text-text-faint",
};

export function ContactInboxList({ initialMessages }: { initialMessages: MessageRow[] }) {
  const [messages, setMessages] = useState(initialMessages);
  const [openId, setOpenId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function setStatus(id: string, status: "new" | "read" | "archived") {
    setBusyId(id);
    const result = await updateContactMessageStatus(id, status);
    setBusyId(null);
    if (result.success) {
      setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, status } : m)));
    }
  }

  async function handleOpen(m: MessageRow) {
    const next = openId === m.id ? null : m.id;
    setOpenId(next);
    if (next && m.status === "new") {
      await setStatus(m.id, "read");
    }
  }

  if (messages.length === 0) {
    return (
      <p className="flex items-center gap-2 px-4 py-6 text-sm text-text-faint">
        <Mail className="h-4 w-4" strokeWidth={1.5} />
        No messages yet.
      </p>
    );
  }

  return (
    <div className="flex flex-col divide-y divide-border rounded-lg border border-border">
      {messages.map((m) => (
        <div key={m.id}>
          <button
            type="button"
            onClick={() => handleOpen(m)}
            className="flex w-full items-center justify-between gap-4 px-4 py-3.5 text-left transition-colors hover:bg-surface-elevated"
          >
            <div className="flex min-w-0 items-center gap-3">
              <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${m.status === "new" ? "bg-accent" : "bg-transparent"}`} />
              <div className="min-w-0">
                <p className="truncate text-sm text-text">
                  {m.subject}{" "}
                  <span className="text-text-faint">— {m.name}</span>
                </p>
                <p className="truncate text-xs text-text-faint">{m.email}</p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <span className={`text-xs ${STATUS_STYLES[m.status]}`}>{m.status}</span>
              <span className="text-xs text-text-faint">
                {new Date(m.createdAt).toLocaleDateString()}
              </span>
              <ChevronDown
                className={`h-4 w-4 text-text-faint transition-transform ${openId === m.id ? "rotate-180" : ""}`}
                strokeWidth={2}
              />
            </div>
          </button>

          {openId === m.id && (
            <div className="border-t border-border bg-surface px-4 py-4">
              {m.time && (
                <p className="mb-2 text-xs text-text-faint">Preferred time: {m.time}</p>
              )}
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-text-muted">
                {m.details}
              </p>

              <div className="mt-4 flex items-center gap-3">
                {m.status !== "read" && (
                  <button
                    type="button"
                    onClick={() => setStatus(m.id, "read")}
                    disabled={busyId === m.id}
                    className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text"
                  >
                    {busyId === m.id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={2} />
                    ) : (
                      <MailOpen className="h-3.5 w-3.5" strokeWidth={2} />
                    )}
                    Mark read
                  </button>
                )}
                {m.status !== "archived" && (
                  <button
                    type="button"
                    onClick={() => setStatus(m.id, "archived")}
                    disabled={busyId === m.id}
                    className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text"
                  >
                    <Archive className="h-3.5 w-3.5" strokeWidth={2} />
                    Archive
                  </button>
                )}
                <a
                  href={`mailto:${m.email}`}
                  className="ml-auto text-xs text-accent hover:text-accent-hover"
                >
                  Reply via email
                </a>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
