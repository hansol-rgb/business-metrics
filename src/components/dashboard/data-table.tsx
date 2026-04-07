import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface Column<T> {
  key: string;
  header: string;
  cell?: (row: T) => React.ReactNode;
  align?: "left" | "center" | "right";
  sortDirection?: "asc" | "desc";
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  caption?: string;
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  caption,
}: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto relative">
      <Table>
        {caption && <TableCaption>{caption}</TableCaption>}
        <TableHeader>
          <TableRow>
            {columns.map((col, colIdx) => (
              <TableHead
                key={col.key}
                className={cn(
                  col.align === "right" && "text-right",
                  col.align === "center" && "text-center",
                  colIdx === 0 && "sticky left-0 z-10 bg-background"
                )}
              >
                {col.header}
                {col.sortDirection && (
                  <span className="ml-1">{col.sortDirection === "asc" ? "\u2191" : "\u2193"}</span>
                )}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, i) => (
            <TableRow
              key={i}
              className={cn(i % 2 === 0 ? "bg-transparent" : "bg-muted/30")}
            >
              {columns.map((col, colIdx) => (
                <TableCell
                  key={col.key}
                  className={cn(
                    col.align === "right" && "text-right",
                    col.align === "center" && "text-center",
                    colIdx === 0 && "sticky left-0 z-10 bg-background"
                  )}
                >
                  {col.cell ? col.cell(row) : String(row[col.key] ?? "")}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent md:hidden" />
    </div>
  );
}
