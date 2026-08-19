"use client";

import { useState } from "react";
import { Plus, Trash2, Pencil, Check, X, Loader2 } from "lucide-react";
import { addModule, updateModule, deleteModule } from "@/lib/actions/products";
import { studioInputClasses } from "./styles";

interface ModuleRow {
  id: string;
  title: string;
  description: string;
}

export function ModulesManager({
  productId,
  initialModules,
}: {
  productId: string;
  initialModules: ModuleRow[];
}) {
  const [modules, setModules] = useState(initialModules);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [adding, setAdding] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function handleAdd() {
    if (!newTitle.trim() || !newDescription.trim()) return;
    setAdding(true);
    const result = await addModule(productId, newTitle.trim(), newDescription.trim());
    setAdding(false);
    if (result.success) {
      setModules((prev) => [
        ...prev,
        { id: crypto.randomUUID(), title: newTitle.trim(), description: newDescription.trim() },
      ]);
      setNewTitle("");
      setNewDescription("");
    }
  }

  function startEdit(m: ModuleRow) {
    setEditingId(m.id);
    setEditTitle(m.title);
    setEditDescription(m.description);
  }

  async function handleSaveEdit(id: string) {
    setBusyId(id);
    const result = await updateModule(id, productId, editTitle.trim(), editDescription.trim());
    setBusyId(null);
    if (result.success) {
      setModules((prev) =>
        prev.map((m) =>
          m.id === id ? { ...m, title: editTitle.trim(), description: editDescription.trim() } : m,
        ),
      );
      setEditingId(null);
    }
  }

  async function handleDelete(id: string) {
    setBusyId(id);
    const result = await deleteModule(id, productId);
    setBusyId(null);
    if (result.success) {
      setModules((prev) => prev.filter((m) => m.id !== id));
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {modules.map((m) => (
        <div key={m.id} className="rounded-lg border border-border bg-surface p-4">
          {editingId === m.id ? (
            <div className="flex flex-col gap-2">
              <input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className={studioInputClasses}
              />
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                rows={3}
                className={`${studioInputClasses} resize-none`}
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleSaveEdit(m.id)}
                  disabled={busyId === m.id}
                  className="inline-flex items-center gap-1.5 rounded-none bg-accent px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-60"
                >
                  {busyId === m.id ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={2.25} />
                  ) : (
                    <Check className="h-3.5 w-3.5" strokeWidth={2.25} />
                  )}
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditingId(null)}
                  className="inline-flex items-center gap-1.5 rounded-none border border-border px-3 py-1.5 text-xs text-text-muted hover:text-text"
                >
                  <X className="h-3.5 w-3.5" strokeWidth={2.25} />
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-white">{m.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-text-muted">{m.description}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={() => startEdit(m)}
                  className="text-text-faint hover:text-text"
                >
                  <Pencil className="h-3.5 w-3.5" strokeWidth={2} />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(m.id)}
                  disabled={busyId === m.id}
                  className="text-text-faint hover:text-[#f87171]"
                >
                  {busyId === m.id ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={2} />
                  ) : (
                    <Trash2 className="h-3.5 w-3.5" strokeWidth={2} />
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      ))}

      <div className="rounded-lg border border-dashed border-border p-4">
        <div className="flex flex-col gap-2">
          <input
            placeholder="Module title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className={studioInputClasses}
          />
          <textarea
            placeholder="Module description"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            rows={2}
            className={`${studioInputClasses} resize-none`}
          />
          <button
            type="button"
            onClick={handleAdd}
            disabled={adding || !newTitle.trim() || !newDescription.trim()}
            className="inline-flex w-fit items-center gap-1.5 rounded-none bg-accent px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-60"
          >
            {adding ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={2.25} />
            ) : (
              <Plus className="h-3.5 w-3.5" strokeWidth={2.25} />
            )}
            Add module
          </button>
        </div>
      </div>
    </div>
  );
}
