import { useRef, useState } from "react";
import type { RefObject } from "react";
import { CornerDownLeft, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "#src/components/ui/button.tsx";
import { Input } from "#src/components/ui/input.tsx";
import { db } from "#src/lib/db.ts";

function TodoComposer({
  composer,
  placeholder,
}: {
  composer: RefObject<HTMLInputElement | null>;
  placeholder: string;
}) {
  const [draft, setDraft] = useState("");
  const [adding, setAdding] = useState(false);
  const saving = useRef(false);

  async function addTodo() {
    const title = draft.trim();
    if (!title || saving.current) return;
    saving.current = true;
    setAdding(true);
    try {
      await db.todoItems.add({
        id: crypto.randomUUID(),
        title,
        completed: false,
        createdAt: Date.now(),
      });
      setDraft("");
    } catch {
      toast.error("Could not add this todo. Your text is still here; try again.");
    } finally {
      saving.current = false;
      setAdding(false);
      composer.current?.focus();
    }
  }

  return (
    <form
      className="flex min-h-12 items-start gap-2 rounded-lg px-1 py-1 hover:bg-muted sm:gap-3"
      onSubmit={(event) => {
        event.preventDefault();
        void addTodo();
      }}
    >
      <Plus className="mt-3 shrink-0 text-muted-foreground" size={18} aria-hidden="true" />
      <Input
        ref={composer}
        className="h-10 min-w-0 flex-1 rounded border-transparent bg-transparent px-1 text-base shadow-none hover:border-border focus-visible:border-ring focus-visible:ring-0 read-only:pointer-events-none read-only:cursor-not-allowed read-only:bg-input/50 read-only:opacity-50 dark:bg-transparent dark:read-only:bg-input/80 sm:text-sm"
        aria-label="New todo"
        placeholder={placeholder}
        value={draft}
        readOnly={adding}
        autoComplete="off"
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={(event) => {
          if (saving.current) return;
          if (event.nativeEvent.isComposing && event.key === "Enter") event.preventDefault();
          if (event.key === "Escape") setDraft("");
        }}
      />
      <Button
        type="submit"
        variant="ghost"
        size="icon"
        className="mt-1 shrink-0"
        aria-label="Save new todo"
        disabled={!draft.trim() || adding}
      >
        <CornerDownLeft size={16} aria-hidden="true" />
      </Button>
    </form>
  );
}

export { TodoComposer };
