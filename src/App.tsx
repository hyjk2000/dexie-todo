import { ErrorBoundary } from "react-error-boundary";
import { StorageErrorFallback } from "#src/components/storage-error-fallback.tsx";
import { TodoList } from "#src/components/todo-list.tsx";
import { Toaster } from "#src/components/ui/sonner.tsx";

function App() {
  return (
    <>
      <ErrorBoundary FallbackComponent={StorageErrorFallback}>
        <TodoList />
      </ErrorBoundary>
      <Toaster closeButton />
    </>
  );
}

export default App;
