import { AlertCircle } from "lucide-react";

interface Props {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
}: Props) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* --- BACKDROP WITH BLUR (Clean & Dark) --- */}
      <div
        className="absolute inset-0 bg-jet-black/80 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onCancel}
      ></div>

      {/* --- MODAL CARD --- */}
      <div className="bg-jet-black border border-white/10 rounded-2xl w-full max-w-[380px] relative shadow-[0_30px_60px_-12px_rgba(0,0,0,0.5)] overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-8">
          {/* --- CONTENT SECTION --- */}
          <div className="space-y-4 mb-8">
            <h2 className="text-lavender text-lg font-bold tracking-tight leading-tight">
              {title}
            </h2>
            <p className="text-pale-slate text-xs font-medium leading-relaxed opacity-80 uppercase tracking-wider whitespace-pre-line">
              {message}
            </p>
          </div>

          {/* --- ACTION BUTTONS (Aligned like the image) --- */}
          <div className="flex justify-end items-center gap-4">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-[10px] font-black text-pale-slate hover:text-white uppercase tracking-widest transition-all"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              className="bg-icy-blue text-jet-black px-6 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-white hover:scale-[1.02] transition-all active:scale-95 shadow-lg shadow-icy-blue/5"
            >
              Sí, Desactivar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
