import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./Button";

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  label?: string;
  className?: string;
}

export const Pagination = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  label = "registros",
  className = "",
}: PaginationProps) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className={`px-6 py-4 border-t border-white/5 bg-white/[0.01] flex items-center justify-between rounded-b-xl ${className}`}>
      <p className="text-[10px] text-pale-slate/40 uppercase font-black tracking-[0.1em]">
        Mostrando {totalItems > 0 ? startItem : 0} - {endItem} de {totalItems} {label}
      </p>
      <div className="flex items-center gap-3">
        <Button 
          onClick={() => onPageChange(currentPage - 1)} 
          disabled={currentPage === 1}
          className={`p-1.5 bg-transparent border border-white/10 text-lavender hover:bg-white/5 ${currentPage === 1 ? 'opacity-10 pointer-events-none' : ''}`}
        >
          <ChevronLeft size={16} />
        </Button>
        
        <span className="text-[10px] font-black text-icy-blue uppercase bg-icy-blue/5 px-3 py-1 rounded-full border border-icy-blue/10 font-mono">
          {currentPage} / {totalPages || 1}
        </span>

        <Button 
          onClick={() => onPageChange(currentPage + 1)} 
          disabled={currentPage === totalPages || totalPages === 0}
          className={`p-1.5 bg-transparent border border-white/10 text-lavender hover:bg-white/5 ${currentPage === totalPages || totalPages === 0 ? 'opacity-10 pointer-events-none' : ''}`}
        >
          <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  );
};