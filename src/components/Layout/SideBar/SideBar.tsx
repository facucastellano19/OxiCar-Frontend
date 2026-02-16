import { NavLink, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  WashingMachine, 
  Package, 
  ShoppingCart, 
  ShieldCheck,
  History,
  LogOut 
} from "lucide-react";
import { PrivateRoutes, PublicRoutes } from "../../../models";
import { useUserStore } from "../../../store";

export const Sidebar = () => {
  const navigate = useNavigate();
  const resetUser = useUserStore((state) => state.resetUser);

  const menuItems = [
    { path: PrivateRoutes.HOME, label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { path: PrivateRoutes.CLIENTS, label: "Clientes", icon: <Users size={18} /> },
    { path: PrivateRoutes.SERVICES, label: "Servicios", icon: <WashingMachine size={18} /> },
    { path: PrivateRoutes.PRODUCTS, label: "Productos", icon: <Package size={18} /> },
    { path: PrivateRoutes.SALES, label: "Ventas", icon: <ShoppingCart size={18} /> },
    { path: PrivateRoutes.EMPLOYEES, label: "Empleados", icon: <ShieldCheck size={18} /> },
    { path: PrivateRoutes.AUDITORY, label: "Auditoría", icon: <History size={18} /> },
  ];

  const handleLogout = () => {
    resetUser();
    navigate(`/${PublicRoutes.LOGIN}`, { replace: true });
  };

  return (
    <aside className="w-64 h-screen bg-jet-black border-r border-white/[0.05] flex flex-col p-6">
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-9 h-9 bg-icy-blue rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(165,216,255,0.15)]">
          <span className="text-jet-black font-black italic text-sm tracking-tighter">OC</span>
        </div>
        <div className="flex flex-col">
          <span className="text-lavender font-bold tracking-tight text-sm leading-none uppercase">Taller automovil</span>
          <span className="text-pale-slate text-[9px] font-bold tracking-[0.2em] uppercase mt-1">Admin Panel</span>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto pr-2 custom-scrollbar">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={`/${item.path}`}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group
              ${isActive 
                ? 'bg-icy-blue/10 text-icy-blue font-semibold border border-icy-blue/20' 
                : 'text-pale-slate hover:bg-white/[0.03] hover:text-lavender border border-transparent'}
            `}
          >
            {({ isActive }) => (
              <>
                <span className={`transition-colors ${isActive ? 'text-icy-blue' : 'opacity-70 group-hover:opacity-100'}`}>
                  {item.icon}
                </span>
                <span className="text-[13px] font-medium tracking-wide">
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="pt-4 border-t border-white/[0.05]">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400/70 hover:bg-red-500/10 hover:text-red-400 transition-all text-sm font-semibold group"
        >
          <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
};