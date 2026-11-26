import Dexie from "dexie";
import type { FallbackProps } from "react-error-boundary";

function StorageErrorFallback({ error }: FallbackProps) {
  if (!(error instanceof Dexie.MissingAPIError || error instanceof Dexie.OpenFailedError)) {
    throw error;
  }

  return (
    <p role="alert" className="mx-auto my-20 max-w-xl p-5">
      Unable to open local storage. Check that browser storage is available and allowed for this
      site, then reload. Your todos have not been replaced.
    </p>
  );
}

export { StorageErrorFallback };
