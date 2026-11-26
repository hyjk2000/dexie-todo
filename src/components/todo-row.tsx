import { useRef, useState } from "react";
import type { RefObject } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "#src/components/ui/button.tsx";
import { Input } from "#src/components/ui/input.tsx";
import { Checkbox } from "#src/components/ui/checkbox.tsx";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "#src/components/ui/alert-dialog.tsx";
import { db, type Todo } from "#src/lib/db.ts";

function TodoRow({ todo, composer }: { todo: Todo; composer: RefObject<HTMLInputElement | null> }) {
  const [invalid, setInvalid] = useState(false);
  const [busy, setBusy] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const saving = useRef(false);

  async function save(input: HTMLInputElement) {
    if (saving.current) return false;
    const title = input.value.trim();
    if (!title) {
      setInvalid(true);
      return false;
    }
    setInvalid(false);
    if (title === todo.title) {
      input.value = title;
      return true;
    }
    saving.current = true;
    try {
      await db.todoItems.update(todo.id, { title });
      input.value = title;
      return true;
    } catch {
      toast.error("Could not save this edit. Your text is still in the field; try again.");
      return false;
    } finally {
      saving.current = false;
    }
  }

  return (
    <div className="group flex min-h-12 items-start gap-2 rounded-lg px-1 py-1 hover:bg-muted sm:gap-3">
      <Checkbox
        className="mt-3 shrink-0"
        checked={todo.completed}
        disabled={busy}
        aria-label={`${todo.completed ? "Mark active" : "Complete"}: ${todo.title}`}
        onCheckedChange={async (checked) => {
          setBusy(true);
          try {
            await db.todoItems.update(todo.id, { completed: checked === true });
          } catch {
            toast.error("Could not change completion. Please try again.");
          } finally {
            setBusy(false);
          }
        }}
      />
      <Input
        className={`h-10 min-w-0 flex-1 rounded border-transparent bg-transparent px-1 text-base shadow-none hover:border-border focus-visible:border-ring focus-visible:ring-0 dark:bg-transparent sm:text-sm ${todo.completed ? "not-focus:text-muted-foreground not-focus:line-through" : ""}`}
        aria-label={`Edit: ${todo.title}`}
        aria-invalid={invalid}
        defaultValue={todo.title}
        onChange={() => setInvalid(false)}
        onBlur={(event) => {
          void save(event.currentTarget);
        }}
        onKeyDown={async (event) => {
          if (event.nativeEvent.isComposing) return;
          if (event.key === "Enter") {
            event.preventDefault();
            if (await save(event.currentTarget)) composer.current?.focus();
          } else if (event.key === "Escape") {
            event.currentTarget.value = todo.title;
            setInvalid(false);
            event.currentTarget.blur();
          }
        }}
      />
      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              className="mt-1 shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 focus-visible:opacity-100 [@media(hover:none)]:opacity-100"
            />
          }
          aria-label={`Delete: ${todo.title}`}
        >
          <Trash2 aria-hidden="true" />
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this todo?</AlertDialogTitle>
            <AlertDialogDescription className="wrap-break-words">
              “{todo.title}” will be permanently deleted. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <Button
              variant="destructive"
              disabled={deleting}
              onClick={async () => {
                setDeleting(true);
                try {
                  await db.todoItems.delete(todo.id);
                  setDialogOpen(false);
                  composer.current?.focus();
                } catch {
                  toast.error("Could not delete this todo. Please try again.");
                } finally {
                  setDeleting(false);
                }
              }}
            >
              {deleting ? "Deleting…" : "Delete todo"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export { TodoRow };
