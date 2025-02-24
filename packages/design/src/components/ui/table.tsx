import * as React from "react";

import { cn } from "@ryuu/design/lib/utils";

function Table({ ref, className, ...props }: React.ComponentProps<"table">) {
  return (
    <div className="relative w-full overflow-auto">
      <table
        ref={ref}
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      />
    </div>
  );
}

function TableHeader({
  ref,
  className,
  ...props
}: React.ComponentProps<"thead">) {
  return (
    <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
  );
}

function TableBody({
  ref,
  className,
  ...props
}: React.ComponentProps<"tbody">) {
  return (
    <tbody
      ref={ref}
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  );
}

function TableFooter({
  ref,
  className,
  ...props
}: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      ref={ref}
      className={cn(
        "bg-muted/50 border-t font-medium [&>tr]:last:border-b-0",
        className,
      )}
      {...props}
    />
  );
}

function TableRow({ ref, className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      ref={ref}
      className={cn(
        "hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors",
        className,
      )}
      {...props}
    />
  );
}

function TableHead({ ref, className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      ref={ref}
      className={cn(
        "text-muted-foreground h-12 px-4 text-left align-middle font-medium [&:has([role=checkbox])]:pr-0",
        className,
      )}
      {...props}
    />
  );
}

function TableCell({ ref, className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      ref={ref}
      className={cn(
        "px-4 py-2.5 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0",
        className,
      )}
      {...props}
    />
  );
}

function TableCaption({
  ref,
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      ref={ref}
      className={cn("text-muted-foreground mt-4 text-sm", className)}
      {...props}
    />
  );
}

export {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
};
