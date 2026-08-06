import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

export interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  children: React.ReactNode;
  className?: string;
  maxHeight?: string;
}

export function Table({ children, className = '', maxHeight = 'max-h-[65vh]', ...props }: TableProps) {
  return (
    <div className="w-full rounded-2xl bg-cso-card border border-cso shadow-xl overflow-hidden">
      <div className={`overflow-x-auto overflow-y-auto ${maxHeight} relative`}>
        <table className={`w-full text-left border-collapse ${className}`} {...props}>
          {children}
        </table>
      </div>
    </div>
  );
}

export function TableHeader({ children, className = '', ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead className={`sticky top-0 z-20 shadow-sm border-b border-cso bg-[#f4f4f2] dark:bg-[#121215] text-[11px] font-extrabold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 ${className}`} {...props}>
      {children}
    </thead>
  );
}

export function TableBody({ children, className = '', ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody className={`divide-y divide-cso text-xs ${className}`} {...props}>
      {children}
    </tbody>
  );
}

export function TableRow({ children, className = '', ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr className={`hover:bg-neutral-100/50 dark:hover:bg-[#18181b]/50 transition-colors ${className}`} {...props}>
      {children}
    </tr>
  );
}

export function TableHead({ children, className = '', ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th className={`sticky top-0 z-20 bg-[#f4f4f2] dark:bg-[#121215] py-4 px-6 border-b border-cso ${className}`} {...props}>
      {children}
    </th>
  );
}

export function TableCell({ children, className = '', ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className={`py-4 px-6 ${className}`} {...props}>
      {children}
    </td>
  );
}

export function TableEmpty({ colSpan, message = 'No records found.' }: { colSpan: number; message?: string }) {
  return (
    <tr>
      <td colSpan={colSpan} className="py-12 text-center text-neutral-500 dark:text-neutral-400 font-bold">
        {message}
      </td>
    </tr>
  );
}

export interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  startIndex: number;
  endIndex: number;
  rowsPerPage: number;
  rowsPerPageOptions?: readonly number[];
  onPageChange: (page: number) => void;
  onRowsPerPageChange?: (rowsPerPage: number) => void;
  itemLabel?: string;
}

export function TablePagination({
  currentPage,
  totalPages,
  totalItems,
  startIndex,
  endIndex,
  rowsPerPage,
  rowsPerPageOptions = [5, 10, 25, 50],
  onPageChange,
  onRowsPerPageChange,
  itemLabel = 'records'
}: TablePaginationProps) {
  const validCurrentPage = Math.min(Math.max(1, currentPage), Math.max(1, totalPages));

  if (totalItems === 0) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-cso text-xs font-semibold text-neutral-600 dark:text-neutral-400">
      
      {/* Items Counter Info */}
      <div className="text-center sm:text-left">
        Showing <span className="font-extrabold text-neutral-900 dark:text-neutral-100">{totalItems === 0 ? 0 : startIndex + 1}</span> to{' '}
        <span className="font-extrabold text-neutral-900 dark:text-neutral-100">{endIndex}</span> of{' '}
        <span className="font-extrabold text-neutral-900 dark:text-neutral-100">{totalItems}</span> {itemLabel}
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3 w-full sm:w-auto">
        
        {/* Rows Per Page Selector */}
        {onRowsPerPageChange && (
          <div className="flex items-center gap-2">
            <span>Show</span>
            <select
              value={rowsPerPage}
              onChange={e => onRowsPerPageChange(Number(e.target.value))}
              className="px-2.5 py-1.5 rounded-md bg-cso-input border border-cso text-neutral-900 dark:text-neutral-100 font-bold focus:outline-none focus:ring-2 focus:ring-neutral-400/50"
            >
              {rowsPerPageOptions.map((num) => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
            <span>per page</span>
          </div>
        )}

        {/* Page Nav Buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onPageChange(1)}
            disabled={validCurrentPage === 1}
            className="p-2 sm:p-2.5 rounded-md bg-cso-input border border-cso disabled:opacity-40 disabled:cursor-not-allowed hover:bg-neutral-100 dark:hover:bg-[#27272a] inline-flex items-center justify-center min-w-[36px] min-h-[36px] transition-colors"
            title="First Page"
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>

          <button
            onClick={() => onPageChange(validCurrentPage - 1)}
            disabled={validCurrentPage === 1}
            className="p-2 sm:p-2.5 rounded-md bg-cso-input border border-cso disabled:opacity-40 disabled:cursor-not-allowed hover:bg-neutral-100 dark:hover:bg-[#27272a] inline-flex items-center justify-center min-w-[36px] min-h-[36px] transition-colors"
            title="Previous Page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="px-2.5 py-1 font-bold text-neutral-900 dark:text-neutral-100 text-center min-w-[80px]">
            Page {validCurrentPage} of {totalPages}
          </span>

          <button
            onClick={() => onPageChange(validCurrentPage + 1)}
            disabled={validCurrentPage === totalPages}
            className="p-2 sm:p-2.5 rounded-md bg-cso-input border border-cso disabled:opacity-40 disabled:cursor-not-allowed hover:bg-neutral-100 dark:hover:bg-[#27272a] inline-flex items-center justify-center min-w-[36px] min-h-[36px] transition-colors"
            title="Next Page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => onPageChange(totalPages)}
            disabled={validCurrentPage === totalPages}
            className="p-2 sm:p-2.5 rounded-md bg-cso-input border border-cso disabled:opacity-40 disabled:cursor-not-allowed hover:bg-neutral-100 dark:hover:bg-[#27272a] inline-flex items-center justify-center min-w-[36px] min-h-[36px] transition-colors"
            title="Last Page"
          >
            <ChevronsRight className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
}
