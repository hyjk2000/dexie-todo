import Dexie, { type Table } from "dexie";

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: number;
}

export const db = new Dexie("dexie-todo") as Dexie & {
  todoItems: Table<Todo, string>;
};

db.version(1).stores({ todos: "++id, createdAt" });

// IndexedDB cannot change a store's primary key, so migrate into a new store.
db.version(2)
  .stores({ todoItems: "id, createdAt" })
  .upgrade(async (transaction) => {
    const todos = await transaction.table<Omit<Todo, "id"> & { id: number }>("todos").toArray();
    for (const todo of todos) {
      await transaction.table<Todo>("todoItems").add({ ...todo, id: crypto.randomUUID() });
    }
  });

db.version(3).stores({ todos: null });
