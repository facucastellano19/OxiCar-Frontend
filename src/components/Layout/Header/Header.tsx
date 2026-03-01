import { useState, useRef } from "react";
import { Bell, CircleUser } from "lucide-react";
import { useUserStore } from "../../../store";
import { useStockAlert, useOnClickOutside } from "../../../hooks/";
import { NotificationDropdown } from "../../../components";

export const Header = () => {
  const userInfo = useUserStore((state) => state.userInfo);

  const { lowStockProducts, count } = useStockAlert();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(dropdownRef, () => setIsOpen(false));

  return (
    <header className="w-full h-14 border-b border-white/[0.05] bg-jet-black flex items-center justify-end px-8 shrink-0 z-50">
      <div className="flex items-center gap-6">
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`relative p-2 rounded-full transition-all group ${
              isOpen ? "bg-white/10" : "hover:bg-white/5"
            }`}
          >
            <Bell
              size={18}
              className={`transition-colors ${
                count > 0 ? "text-lavender" : "text-pale-slate/40"
              } group-hover:text-lavender`}
            />

            {count > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full border-2 border-jet-black animate-pulse shadow-[0_0_10px_rgba(249,115,22,0.6)]" />
            )}
          </button>

          {isOpen && (
            <NotificationDropdown
              products={lowStockProducts}
              onClose={() => setIsOpen(false)}
            />
          )}
        </div>

        <div className="w-px h-4 bg-white/10" />

        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end text-right">
            <p className="text-[10px] font-black text-lavender uppercase tracking-widest leading-none">
              {userInfo?.username || "Cargando..."}
            </p>
            {userInfo?.role_id && (
              <span className="text-[8px] text-icy-blue/50 font-bold uppercase tracking-[0.2em] mt-1.5 italic">
                {userInfo.role_id === 1 ? "Administrador" : "Empleado"}
              </span>
            )}
          </div>

          <div className="w-9 h-9 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center transition-all hover:border-white/20">
            <CircleUser size={20} className="text-lavender/30" />
          </div>
        </div>
      </div>
    </header>
  );
};
