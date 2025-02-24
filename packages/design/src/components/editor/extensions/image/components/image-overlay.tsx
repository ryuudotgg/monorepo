import { cn } from "@ryuu/design/lib/utils";

import { Spinner } from "../../../components/common/spinner";

function ImageOverlay() {
  return (
    <div
      className={cn(
        "flex flex-row items-center justify-center",
        "absolute inset-0 rounded bg-[var(--mt-overlay)] opacity-100 transition-opacity",
      )}
    >
      <Spinner className="size-7" />
    </div>
  );
}

export { ImageOverlay };
