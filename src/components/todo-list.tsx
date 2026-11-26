import { useId, useRef } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { Check, Circle } from "lucide-react";
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from "motion/react";
import { TodoComposer } from "#src/components/todo-composer.tsx";
import { TodoRow } from "#src/components/todo-row.tsx";
import { Separator } from "#src/components/ui/separator.tsx";
import { db, type Todo } from "#src/lib/db.ts";

function TodoList() {
  const todos = useLiveQuery(() => db.todoItems.orderBy("createdAt").toArray());
  const composer = useRef<HTMLInputElement>(null);
  const reduceMotion = useReducedMotion();
  const headingId = useId();
  const active = todos?.filter((todo) => !todo.completed) ?? [];
  const completed = todos?.filter((todo) => todo.completed).reverse() ?? [];

  function renderTodo(todo: Todo) {
    return (
      <motion.li
        key={todo.id}
        layout={reduceMotion ? false : "position"}
        aria-describedby={`${headingId}-${todo.completed ? "completed" : "active"}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <TodoRow todo={todo} composer={composer} />
      </motion.li>
    );
  }

  return (
    <main
      aria-label="Todos"
      className="mx-auto min-h-svh w-full max-w-3xl px-4 py-8 antialiased sm:px-8 sm:py-12"
    >
      {todos === undefined ? (
        <p className="px-1 py-4 text-sm text-muted-foreground" role="status">
          Opening your list…
        </p>
      ) : (
        <MotionConfig
          reducedMotion="user"
          transition={{ type: "tween", duration: reduceMotion ? 0 : 0.18, ease: "easeOut" }}
        >
          <ul className="relative m-0 list-none p-0" aria-label="Todos">
            <AnimatePresence initial={false} mode="popLayout">
              {[
                <li
                  key="active-heading"
                  role="presentation"
                  className="mb-3 flex items-center gap-4 text-muted-foreground"
                >
                  <h2
                    id={`${headingId}-active`}
                    className="flex shrink-0 items-center gap-1.5 text-xs tracking-wide uppercase"
                  >
                    <Circle size={13} aria-hidden="true" /> Todo · {active.length}
                  </h2>
                  <Separator className="w-auto flex-1" />
                </li>,
                ...active.map(renderTodo),
                <motion.li
                  key="composer"
                  layout={reduceMotion ? false : "position"}
                  aria-describedby={`${headingId}-active`}
                  className="mt-0.5"
                >
                  <TodoComposer
                    composer={composer}
                    placeholder={active.length ? "And then…" : "What would you like to do?"}
                  />
                </motion.li>,
                ...(completed.length > 0
                  ? [
                      <motion.li
                        key="completed-heading"
                        role="presentation"
                        layout={reduceMotion ? false : "position"}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="mt-8 mb-3 flex items-center gap-4 text-muted-foreground"
                      >
                        <h2
                          id={`${headingId}-completed`}
                          className="flex shrink-0 items-center gap-1.5 text-xs tracking-wide uppercase"
                        >
                          <Check size={13} aria-hidden="true" /> Completed · {completed.length}
                        </h2>
                        <Separator className="w-auto flex-1" />
                      </motion.li>,
                    ]
                  : []),
                ...completed.map(renderTodo),
              ]}
            </AnimatePresence>
          </ul>
        </MotionConfig>
      )}
    </main>
  );
}

export { TodoList };
