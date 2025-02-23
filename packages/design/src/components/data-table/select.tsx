import type { ColumnDef, Row, RowData, Table } from "@tanstack/react-table";

import { Checkbox } from "~/components/ui/checkbox";

function getRowRange<TData extends RowData>(
  rows: Row<TData>[],
  currentID: number,
  selectedID: number,
): Row<TData>[] {
  const rangeStart = selectedID > currentID ? currentID : selectedID;
  const rangeEnd = rangeStart === currentID ? selectedID : currentID;

  return rows.slice(rangeStart, rangeEnd + 1);
}

function handleShiftClick<TData extends RowData>(
  table: Table<TData>,
  row: Row<TData>,
) {
  const { rows, rowsById } = table.getRowModel();
  const { rowSelection } = table.getState();

  const lastSelectedRowIndex =
    Math.max(...Object.keys(rowSelection).map(Number)) || 0;

  const rowsToToggle = getRowRange(rows, row.index, lastSelectedRowIndex);
  const isCellSelected = rowsById[row.id]?.getIsSelected();

  for (const _row of rowsToToggle) _row.toggleSelected(!isCellSelected);
}

function getSelectDef<TData extends RowData>(): ColumnDef<TData> {
  return {
    id: "select",
    enableSorting: false,
    enableHiding: false,
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) =>
          value
            ? table.toggleAllPageRowsSelected(true)
            : table.toggleAllRowsSelected(false)
        }
        aria-label="Select page all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ table, row }) => (
      <Checkbox
        aria-label="Select row"
        className="translate-y-[2px]"
        checked={row.getIsSelected()}
        onClick={(event) => {
          if (event.shiftKey) handleShiftClick(table, row);
          else row.toggleSelected();
        }}
      />
    ),
  };
}

export { getSelectDef };
