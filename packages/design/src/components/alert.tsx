import type { VariantProps } from "class-variance-authority";
import * as React from "react";
import { cva } from "class-variance-authority";

import { cn } from "@ryuu/design/utils";

const alertVariants = cva(
  "[&>svg]:text-foreground relative w-full rounded-lg border border-gray-200 px-3 py-2 text-sm [&>svg]:absolute [&>svg]:top-4 [&>svg]:left-4 [&>svg+div]:translate-y-[-3px] [&>svg~*]:pl-7",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive:
          "border-destructive-border bg-background text-destructive-foreground [&>svg]:text-destructive-foreground",
      },
      fill: {
        none: "",
        destructive: "bg-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Alert({
  ref,
  className,
  variant,
  fill,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      ref={ref}
      role="alert"
      className={cn(alertVariants({ variant, fill }), className)}
      {...props}
    />
  );
}

function AlertTitle({ ref, className, ...props }: React.ComponentProps<"h5">) {
  return (
    <h5
      ref={ref}
      className={cn("mb-1 leading-none font-medium tracking-tight", className)}
      {...props}
    />
  );
}

function AlertDescription({
  ref,
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      ref={ref}
      className={cn("text-center text-sm [&_p]:leading-relaxed", className)}
      {...props}
    />
  );
}

export { Alert, AlertDescription, AlertTitle };
