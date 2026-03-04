import type { ReactNode } from "react";
import { SyncLoader } from "./SyncLoader";

export interface TableColumn {
  label: string;
  className?: string;
}

interface TableProps {
  columns: TableColumn[];
  children: ReactNode;
  isLoading?: boolean;
  isEmpty?: boolean;
  colSpan?: number;
  loadingLabel?: string;
  emptyLabel?: string;
  className?: string;
}

export const Table = ({
  columns,
  children,
  isLoading = false,
  isEmpty = false,
  colSpan,
  loadingLabel = "Cargando...",
  emptyLabel = "No se encontraron registros",
  className = "",
}: TableProps) => {
  const finalColSpan = colSpan || columns.length;

  return (
    <div className={`relative ${className}`}>
      <div className="w-full isolate">
        <table className="min-w-full table-fixed text-left text-sm border-collapse">
          <thead>
            <tr className="bg-white/[0.02] text-[10px] uppercase tracking-[0.15em] text-pale-slate font-bold">
              {columns.map((col, index) => (
                <th
                  key={index}
                  className={`px-6 py-4 border-b border-white/5 whitespace-nowrap ${col.className || ""}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-white/[0.02] [&>tr:nth-child(even)]:bg-white/[0.01] [&>tr:hover]:bg-white/[0.04] transition-colors">
            {isLoading ? (
              <SyncLoader isTable colSpan={finalColSpan} label={loadingLabel} />
            ) : isEmpty ? (
              <tr>
                <td
                  colSpan={finalColSpan}
                  className="py-20 text-center text-pale-slate/30 italic text-xs uppercase tracking-[0.2em]"
                >
                  {emptyLabel}
                </td>
              </tr>
            ) : (
              children
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
