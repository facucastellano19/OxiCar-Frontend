import { useState } from "react"; //
import { useLogin } from "./Hooks/useLogin";
import { User, Lock, ArrowRight, Settings, Eye, EyeOff } from "lucide-react";

export const Login = () => {
  const { register, handleSubmit, errors, loading, apiError } = useLogin();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-jet-black overflow-hidden font-sans">
      <div className="w-full md:w-[40%] flex flex-col justify-center px-8 md:px-16 bg-jet-black z-20 border-r border-white/5">
        <div className="w-full max-w-sm mx-auto">
          <div className="mb-12 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white/5 flex items-center justify-center shadow-inner border border-white/10">
              <Settings className="text-icy-blue w-6 h-6 animate-spin-slow" />
            </div>
            <h1 className="text-lavender text-3xl font-black tracking-tighter">
              Oxi<span className="text-icy-blue">Car</span>
            </h1>
          </div>

          <div className="mb-10">
            <h2 className="text-lavender text-2xl font-bold tracking-tight">
              Iniciar Sesión
            </h2>
            <p className="text-pale-slate text-sm mt-1">
              Gestión integral de taller mecánico.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-alabaster text-[11px] font-extrabold uppercase tracking-widest ml-1 opacity-70">
                Usuario
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-pale-slate group-focus-within:text-icy-blue transition-colors">
                  <User size={18} />
                </div>
                <input
                  {...register("username")}
                  type="text"
                  placeholder="usuario_oxicar"
                  className={`w-full bg-white/5 border ${
                    errors.username ? "border-red-400" : "border-white/10"
                  } rounded-xl pl-12 pr-4 py-4 text-lavender focus:border-icy-blue/50 focus:ring-4 focus:ring-icy-blue/5 outline-none transition-all placeholder:text-pale-slate/30 text-sm`}
                />
              </div>
              {errors.username && (
                <p className="text-red-400 text-[10px] font-bold italic ml-1">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-alabaster text-[11px] font-extrabold uppercase tracking-widest ml-1 opacity-70">
                Contraseña
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-pale-slate group-focus-within:text-icy-blue transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`w-full bg-white/5 border ${
                    errors.password ? "border-red-400" : "border-white/10"
                  } rounded-xl pl-12 pr-12 py-4 text-lavender focus:border-icy-blue/50 focus:ring-4 focus:ring-icy-blue/5 outline-none transition-all placeholder:text-pale-slate/30 text-sm`}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-pale-slate hover:text-icy-blue transition-colors outline-none"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-[10px] font-bold italic ml-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {apiError && (
              <div className="bg-red-400/10 border border-red-400/20 text-red-400 text-[11px] py-3 px-4 rounded-lg text-center font-bold">
                Acceso denegado. Verificá los datos.
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="group w-full flex items-center justify-center gap-2 mt-4 py-4 bg-icy-blue text-jet-black font-black rounded-xl shadow-lg shadow-icy-blue/10 hover:bg-lavender transition-all active:scale-[0.98] disabled:opacity-50"
            >
              <span className="uppercase tracking-[0.2em] text-xs">
                {loading ? "Entrando..." : "Acceder al Sistema"}
              </span>
              {!loading && (
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              )}
            </button>
          </form>

          <footer className="mt-16 pt-8 border-t border-white/5">
            <p className="text-pale-slate/40 text-[9px] uppercase tracking-[0.4em] font-medium text-center">
              OxiCar Taller &copy; 2026
            </p>
          </footer>
        </div>
      </div>

      <div className="hidden md:block md:w-[60%] relative h-screen">
        <div className="absolute inset-0 bg-gradient-to-r from-jet-black via-transparent to-transparent z-10 opacity-90" />
        <div className="absolute inset-0 bg-jet-black/20 z-10" />

        <img
          src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=1920"
          alt="Luxury Car OxiCar"
          className="h-full w-full object-cover"
        />

        <div className="absolute bottom-12 left-12 z-20">
          <div className="bg-jet-black/40 backdrop-blur-xl border border-white/10 p-8 rounded-3xl max-w-sm shadow-2xl">
            <p className="text-lavender text-lg font-semibold leading-snug italic tracking-tight">
              "Potencia y precisión en cada reparación."
            </p>
            <div className="mt-4 flex items-center gap-4">
              <div className="h-px w-12 bg-icy-blue/50" />
              <p className="text-icy-blue text-[11px] uppercase font-black tracking-[0.3em]">
                Servicio Técnico OxiCar
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
