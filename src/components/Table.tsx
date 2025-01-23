import { ArrowDown, ArrowUpDown } from "lucide-react";
import { useCallback, useMemo } from "react";

export type Column<T> = {
  header: string;
  accessorKey: keyof T;
  cell?: (value: unknown, row: T) => React.ReactNode;
  sortable?: boolean;
};

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  sortConfig?: {
    key: keyof T;
    direction: "asc" | "desc";
    onSort: (key: keyof T) => void;
  };
  emptyMessage?: string;
}

export default function Table<T extends { id: string | number }>({
  data,
  columns,
  sortConfig,
  emptyMessage = "No data found",
}: DataTableProps<T>) {
  const renderCell = useCallback((row: T, column: Column<T>) => {
    const value = row[column.accessorKey];
    if (column.cell) {
      return column.cell(value as T[typeof column.accessorKey], row);
    }
    return String(value);
  }, []);

  const sortedColumns = useMemo(
    () =>
      columns.map((column) => ({
        ...column,
        isSorted: sortConfig?.key === column.accessorKey,
        sortDirection: sortConfig?.direction,
      })),
    [columns, sortConfig],
  );

  if (data.length === 0) {
    return (
      <div className="w-full rounded-lg border py-8 text-center">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="bg-background w-full overflow-hidden rounded-lg border">
      {/* Desktop View */}
      <div className="hidden overflow-x-auto sm:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              {sortedColumns.map((column, index) => (
                <th
                  key={index}
                  className={`text-muted-foreground px-4 py-3 text-left text-xs font-medium tracking-wider uppercase ${
                    column.sortable ? "hover:bg-muted/50 cursor-pointer" : ""
                  }`}
                  onClick={() =>
                    column.sortable && sortConfig?.onSort(column.accessorKey)
                  }
                >
                  <div className="flex items-center gap-2">
                    {column.header}
                    {column.sortable &&
                      (column.isSorted ? (
                        <ArrowDown
                          className={`h-4 w-4 transition-transform ${
                            column.sortDirection === "desc" ? "rotate-180" : ""
                          }`}
                        />
                      ) : (
                        <ArrowUpDown className="h-4 w-4" />
                      ))}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            {data.map((row) => (
              <tr key={row.id} className="hover:bg-muted/50">
                {sortedColumns.map((column, index) => (
                  <td key={index} className="px-4 py-3">
                    {renderCell(row, column)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile View */}
      <div className="grid gap-4 p-4 sm:hidden">
        {data.map((row) => (
          <div
            key={row.id}
            className="bg-background space-y-3 rounded-lg border p-4"
          >
            {sortedColumns.map((column, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">
                  {column.header}
                </span>
                <span className="font-medium">{renderCell(row, column)}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
