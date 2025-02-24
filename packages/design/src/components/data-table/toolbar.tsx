"use client";

import type { Table } from "@tanstack/react-table";
import * as React from "react";

import { Button } from "@ryuu/design/components/ui/button";
import { Input } from "@ryuu/design/components/ui/input";

import { DataTableViewOptions } from "./view-options";

function DataTableToolbar<TData>({
  ref,
  table,
  searchableColumn,
  ...props
}: React.ComponentProps<"div"> & {
  table: Table<TData>;
  searchableColumn?: keyof TData;
}) {
  return (
    <div
      ref={ref}
      className="flex items-center justify-between gap-2"
      {...props}
    >
      <div className="flex flex-1 items-center space-x-2">
        {searchableColumn && (
          <Input
            placeholder="Search..."
            value={
              (table.getColumn(String(searchableColumn))?.getFilterValue() as
                | string
                | undefined) ?? ""
            }
            onChange={(event) =>
              table
                .getColumn(String(searchableColumn))
                ?.setFilterValue(event.target.value)
            }
            className="h-8 w-full sm:w-[250px]"
          />
        )}
      </div>
      <div className="flex items-center space-x-2">
        {table.getIsAllPageRowsSelected() && !table.getIsAllRowsSelected() && (
          <Button
            variant="outline"
            size="sm"
            className="ml-auto flex h-8"
            onClick={() => table.toggleAllRowsSelected(true)}
          >
            Select all
          </Button>
        )}
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}

export { DataTableToolbar };
