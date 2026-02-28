import { NavLink, useNavigate } from "react-router-dom";
import logo from "../../../assets/oxicarLogo.png";
import {
  LayoutDashboard,
  Users,
  WashingMachine,
  Package,
  ShoppingCart,
  ShieldCheck,
  History,
  LogOut,
  ChartColumnBig,
} from "lucide-react";
import { PrivateRoutes, PublicRoutes } from "../../../models";
import { useUserStore } from "../../../store";
import { PermissionGate } from "../../Common/PermissionGate";

export const Sidebar = () => {
  const navigate = useNavigate();
  const resetUser = useUserStore((state) => state.resetUser);

  const menuItems = [
    {
      path: PrivateRoutes.HOME,
      label: "Home",
      icon: <LayoutDashboard size={18} />,
    },
    {
      path: PrivateRoutes.CLIENTS,
      label: "Clientes",
      icon: <Users size={18} />,
    },
    {
      path: PrivateRoutes.SERVICES,
      label: "Servicios",
      icon: <WashingMachine size={18} />,
    },
    {
      path: PrivateRoutes.PRODUCTS,
      label: "Productos",
      icon: <Package size={18} />,
    },
    {
      path: PrivateRoutes.SALES,
      label: "Ventas",
      icon: <ShoppingCart size={18} />,
    },
    {
      path: PrivateRoutes.EMPLOYEES,
      label: "Empleados",
      icon: <ShieldCheck size={18} />,
      roles: [1],
    },
    {
      path: PrivateRoutes.AUDITORY,
      label: "Auditoría",
      icon: <History size={18} />,
      roles: [1],
    },
    {
      path: PrivateRoutes.METRICS,
      label: "Metricas",
      icon: <ChartColumnBig size={18} />,
      roles: [1],
    },
  ];

  const handleLogout = () => {
    resetUser();
    navigate(`/${PublicRoutes.LOGIN}`, { replace: true });
  };

  return (
    <aside className="w-64 h-screen bg-jet-black border-r border-white/[0.05] flex flex-col p-6">
      <div className="flex flex-col items-center mt-2 animate-in fade-in slide-in-from-top-4 duration-1000">
        <div className="relative w-full flex justify-center mb-1 p-1">
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-10 bg-icy-blue/10 blur-[40px] rounded-full opacity-60"></div>
          <img
            src={logo}
            alt="OXICAR Competición"
            className="relative w-auto h-28 object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.08)]"
          />
        </div>

        <div className="flex flex-col items-center">
          <span className="text-pale-slate/30 text-[9px] font-black tracking-[0.5em] uppercase text-center leading-none">
            Panel de Gestión
          </span>
        </div>
      </div>

      <div className="mt-6 mb-8 h-px w-full bg-gradient-to-r from-transparent via-white/5 to-transparent" />

      <nav className="flex-1 space-y-3 overflow-y-auto pr-2 custom-scrollbar">
        {menuItems.map((item, index) => {
          const isFirstAdminItem = item.label === "Empleados";

          const content = (
            <div key={item.path} className="flex flex-col gap-3">
              {isFirstAdminItem && (
                <div className="pt-4 pb-2">
                  <p className="text-[9px] font-black text-white/10 uppercase tracking-[0.2em] px-4">
                    Administración
                  </p>
                </div>
              )}
              <NavLink
                to={`/${item.path}`}
                className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group
                  ${
                    isActive
                      ? "bg-icy-blue/10 text-icy-blue font-bold border border-icy-blue/20 shadow-[0_0_15px_rgba(173,216,230,0.05)]"
                      : "text-pale-slate/60 hover:bg-white/[0.03] hover:text-lavender border border-transparent"
                  }
                `}
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={`transition-colors ${isActive ? "text-icy-blue" : "opacity-50 group-hover:opacity-100"}`}
                    >
                      {item.icon}
                    </span>
                    <span className="text-[13px] font-semibold tracking-wide uppercase italic">
                      {item.label}
                    </span>
                  </>
                )}
              </NavLink>
            </div>
          );

          if (item.roles) {
            return (
              <PermissionGate key={item.path} allowedRoles={item.roles}>
                {content}
              </PermissionGate>
            );
          }
          return content;
        })}
      </nav>

      {/* FOOTER */}
      <div className="pt-6 mt-4 border-t border-white/[0.05]">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-red-400/50 hover:bg-red-500/10 hover:text-red-400 transition-all text-[12px] font-black uppercase tracking-widest group"
        >
          <LogOut
            size={18}
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span>Salir</span>
        </button>
      </div>
    </aside>
  );
};
