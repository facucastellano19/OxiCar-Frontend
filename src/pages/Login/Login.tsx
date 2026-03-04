import { useState } from "react";
import { useLogin } from "./Hooks/useLogin";
import { User, Lock, ArrowRight, Eye, EyeOff, AlertCircle } from "lucide-react";
import logo from "../../assets/oxicarLogo.png";

export const Login = () => {
  const { register, handleSubmit, errors, loading, apiError } = useLogin();
  const [showPassword, setShowPassword] = useState(false);
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen w-full flex bg-jet-black overflow-hidden font-sans relative">
      <div className="w-full md:w-[45%] lg:w-[40%] flex flex-col justify-center items-center px-8 md:px-12 z-20 bg-jet-black relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-icy-blue/5 blur-[120px] rounded-full -z-10" />

        <div className="w-full max-w-[340px] flex flex-col items-center animate-in fade-in duration-1000">
          <div className="mb-10 flex flex-col items-center text-center">
            <div className="relative mb-4">
              <div className="absolute inset-x-0 bottom-[-12px] h-4 bg-black/60 blur-xl rounded-full scale-x-75 opacity-50"></div>
              <img
                src={logo}
                alt="OXICAR Logo"
                className="relative h-32 w-auto object-contain drop-shadow-[0_15px_25px_rgba(0,0,0,0.6)]"
              />
            </div>

            <h2 className="text-lavender/80 text-sm font-semibold uppercase tracking-[0.2em] border-b border-white/5 pb-2 w-full">
              Iniciar Sesión
            </h2>
          </div>

          {apiError && (
            <div className="w-full mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-md flex items-center gap-3 animate-shake">
              <AlertCircle size={16} className="text-red-500 shrink-0" />
              <p className="text-red-500 text-[11px] font-medium uppercase tracking-wider text-left">
                Acceso denegado: Credenciales inválidas
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="w-full space-y-4">
            <div className="space-y-1.5">
              <label className="block text-left text-pale-slate/40 text-[10px] font-semibold uppercase tracking-wider ml-1">
                Usuario
              </label>
              <div className="relative group">
                <User
                  size={15}
                  className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${errors.username ? "text-red-500/50" : "text-pale-slate/30 group-focus-within:text-icy-blue"}`}
                />
                <input
                  {...register("username")}
                  type="text"
                  placeholder="Cristian"
                  className={`w-full bg-white/[0.03] border rounded-md pl-11 pr-4 py-3 text-lavender text-sm focus:border-icy-blue/40 outline-none transition-all placeholder:text-pale-slate/10 ${errors.username ? "border-red-500/30" : "border-white/10"}`}
                />
              </div>
              {errors.username && (
                <span className="text-red-500/60 text-[9px] font-medium uppercase tracking-widest ml-1">
                  {errors.username.message || "El usuario es requerido"}
                </span>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="block text-left text-pale-slate/40 text-[10px] font-semibold uppercase tracking-wider ml-1">
                Contraseña
              </label>
              <div className="relative group">
                <Lock
                  size={15}
                  className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${errors.password ? "text-red-500/50" : "text-pale-slate/30 group-focus-within:text-icy-blue"}`}
                />
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`w-full bg-white/[0.03] border rounded-md pl-11 pr-12 py-3 text-lavender text-sm focus:border-icy-blue/40 outline-none transition-all placeholder:text-pale-slate/10 ${errors.password ? "border-red-500/30" : "border-white/10"}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-pale-slate/20 hover:text-icy-blue transition-colors"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && (
                <span className="text-red-500/60 text-[9px] font-medium uppercase tracking-widest ml-1">
                  {errors.password.message || "La contraseña es requerida"}
                </span>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 mt-4 py-3.5 bg-icy-blue text-jet-black font-bold rounded-md hover:brightness-110 transition-all active:scale-[0.99] disabled:opacity-50"
            >
              <span className="uppercase tracking-widest text-[11px]">
                {loading ? "Verificando..." : "Acceder al Panel"}
              </span>
              {!loading && <ArrowRight size={14} />}
            </button>
          </form>

          <footer className="mt-12 pt-6 border-t border-white/5 w-full text-center">
            <p className="text-pale-slate/10 text-[9px] uppercase tracking-[0.4em] font-medium">
              Oxicar &copy; {currentYear}
            </p>
          </footer>
        </div>
      </div>

      <div
        className="hidden md:block md:flex-1 relative h-screen z-10"
        style={{
          clipPath: "polygon(10% 0, 100% 0, 100% 100%, 0% 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, black 15%, black 100%)",
          maskImage:
            "linear-gradient(to right, transparent 0%, black 15%, black 100%)",
        }}
      >
        <img
          src="https://www.suzukipan.com/media/1ezjgy25/mec%C3%A1nico-trabajando-en-el-motor-de-un-veh%C3%ADculo-utilizando-una-llave-de-trinquete-1.webp"
          className="h-full w-full object-cover grayscale-[0.3] brightness-[0.4] contrast-[1.2]"
          alt="Mecánico"
        />
        <div className="absolute bottom-12 right-12 z-20 opacity-10 flex flex-col items-end">
          <div className="h-px w-24 bg-lavender mb-2" />
        </div>
      </div>
    </div>
  );
};
