"use client";

import { useActionState, useState } from "react";
import { Plus, X, Pencil, Check } from "lucide-react";
import { addNoteAction, updateNoteAction, deleteNoteAction } from "@/app/actions/bills";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface NotesEditorProps {
  billId: string;
  notes: string[];
}

/**
 * Notes editor — lists existing notes with inline edit/delete, plus an add form.
 * Each note is a string in the bill's `notes[]` array, addressed by index.
 */
export function NotesEditor({ billId, notes }: NotesEditorProps) {
  const [addState, addAction] = useActionState(addNoteAction, undefined);
  const [deleteState, deleteAction] = useActionState(deleteNoteAction, undefined);
  const [updateState, updateAction] = useActionState(updateNoteAction, undefined);
  const [note, setNote] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editText, setEditText] = useState("");

  function startEdit(index: number, text: string) {
    setEditingIndex(index);
    setEditText(text);
  }

  function cancelEdit() {
    setEditingIndex(null);
    setEditText("");
  }

  return (
    <div className="flex flex-col gap-3">
      {(deleteState?.errors?.form || updateState?.errors?.form) && (
        <div className="flex items-start gap-2 rounded-sm border border-destructive/30 bg-destructive/10 px-4 py-3">
          <span className="text-xs text-destructive">
            {deleteState?.errors?.form?.[0] ?? updateState?.errors?.form?.[0]}
          </span>
        </div>
      )}

      {/* Existing notes list */}
      {notes.length > 0 ? (
        <div className="flex flex-col gap-1.5">
          {notes.map((text, index) => (
            <div key={index} className="flex items-start gap-2">
              {editingIndex === index ? (
                /* Inline edit form */
                <form action={updateAction} className="flex flex-1 items-center gap-2">
                  <input type="hidden" name="billId" value={billId} />
                  <input type="hidden" name="noteIndex" value={index} />
                  <Input
                    name="note"
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="rounded-sm"
                    autoFocus
                  />
                  <button
                    type="submit"
                    title="Save"
                    className="flex size-6 shrink-0 items-center justify-center rounded-sm border border-foreground bg-foreground text-background transition-colors hover:bg-foreground/90"
                  >
                    <Check className="size-3" strokeWidth={1.5} />
                  </button>
                  <button
                    type="button"
                    onClick={cancelEdit}
                    title="Cancel"
                    className="flex size-6 shrink-0 items-center justify-center rounded-sm border border-border text-muted-foreground transition-colors hover:bg-muted"
                  >
                    <X className="size-3" strokeWidth={1.5} />
                  </button>
                </form>
              ) : (
                /* Display + edit/delete buttons */
                <>
                  <span className="flex-1 rounded-sm border border-border bg-muted/40 px-3 py-2 font-mono text-[12px] leading-relaxed text-foreground">
                    {text}
                  </span>
                  <button
                    type="button"
                    onClick={() => startEdit(index, text)}
                    title="Edit note"
                    className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-sm border border-border text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
                  >
                    <Pencil className="size-3" strokeWidth={1.5} />
                  </button>
                  <form action={deleteAction}>
                    <input type="hidden" name="billId" value={billId} />
                    <input type="hidden" name="noteIndex" value={index} />
                    <button
                      type="submit"
                      title="Delete note"
                      className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-sm border border-border text-muted-foreground transition-colors hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive"
                    >
                      <X className="size-3" strokeWidth={1.5} />
                    </button>
                  </form>
                </>
              )}
            </div>
          ))}
        </div>
      ) : (
        <span className="font-mono text-[10px] text-muted-foreground/60">No notes yet</span>
      )}

      {/* Add note form */}
      <form action={addAction} className="mt-1 flex flex-col gap-2">
        <input type="hidden" name="billId" value={billId} />
        <Label className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
          Add a note
        </Label>
        <div className="flex items-center gap-2">
          <Input
            name="note"
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Type a note..."
            className="rounded-sm"
          />
          <Button
            type="submit"
            className="h-8 shrink-0 rounded-sm border-foreground bg-foreground px-3 font-mono text-[10px] tracking-widest text-background hover:bg-foreground/90"
          >
            <Plus className="size-3" strokeWidth={1.5} />
            ADD
          </Button>
        </div>
        {addState?.errors?.note && (
          <p className="font-mono text-[10px] text-destructive">{addState.errors.note[0]}</p>
        )}
      </form>
    </div>
  );
}
