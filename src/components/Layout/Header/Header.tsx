import { Bell, CircleUser } from "lucide-react";
import { useUserStore } from "../../../store";

export const Header = () => {
  const userInfo = useUserStore((state) => state.userInfo);

  return (
    <header className="w-full h-14 border-b border-white/[0.05] bg-jet-black flex items-center justify-end px-8 shrink-0 z-50">
      <div className="flex items-center gap-6">
        <button className="relative p-2 rounded-full hover:bg-white/5 transition-colors group">
          <Bell
            size={16}
            className="text-pale-slate/40 group-hover:text-lavender"
          />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-orange-500 rounded-full border border-jet-black shadow-[0_0_8px_rgba(249,115,22,0.3)]" />
        </button>

        <div className="w-px h-4 bg-white/10" />

        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <p className="text-[10px] font-bold text-lavender/80 uppercase tracking-widest leading-none">
              {userInfo ? userInfo.username : "Cargando..."}
            </p>
            <span className="text-[8px] text-icy-blue/60 font-semibold uppercase tracking-[0.25em] mt-1.5 opacity-80">
              {userInfo?.role_id === 1 ? "Administrador" : "Personal"}
            </span>
          </div>
          <div className="w-8 h-8 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center">
            <CircleUser size={18} className="text-lavender/40" />
          </div>
        </div>
      </div>
    </header>
  );
};
