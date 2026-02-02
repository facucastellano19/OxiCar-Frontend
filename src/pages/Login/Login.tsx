import { useLogin } from "./Hooks/useLogin";

export const Login = () => {
  const { register, handleSubmit, errors, loading, apiError } = useLogin();

  return (
    <div className="min-h-screen flex items-center justify-center bg-jet-black p-6 font-sans">

      <div className="w-full max-w-md bg-white/5 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white/10 shadow-2xl">
        
        <div className="text-center mb-10">
          <div className="inline-block p-4 rounded-3xl bg-icy-blue/10 mb-4">
             <span className="text-icy-blue text-4xl font-black tracking-tighter italic">NC</span>
          </div>
          <h1 className="text-lavender text-2xl font-bold tracking-tight">
            NC <span className="text-icy-blue font-black">Detailing</span>
          </h1>
          <p className="text-pale-slate text-xs mt-2 uppercase tracking-[0.2em]">Premium Car Care</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div className="space-y-2">
            <label className="text-lavender text-[10px] font-black ml-5 uppercase tracking-widest opacity-70">
              Usuario
            </label>
            <input
              {...register("username")}
              type="text"
              placeholder="admin_ncdetailing"
              className={`w-full bg-jet-black/40 border ${errors.username ? 'border-red-500' : 'border-white/10'} rounded-full px-7 py-4 text-lavender focus:ring-2 focus:ring-icy-blue/30 outline-none transition-all placeholder:text-pale-slate/20`}
            />
            {errors.username && (
              <p className="text-red-400 text-[10px] ml-5 font-bold italic animate-pulse">
                {errors.username.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-lavender text-[10px] font-black ml-5 uppercase tracking-widest opacity-70">
              Contraseña
            </label>
            <input
              {...register("password")}
              type="password"
              placeholder="••••••••"
              className={`w-full bg-jet-black/40 border ${errors.password ? 'border-red-500' : 'border-white/10'} rounded-full px-7 py-4 text-lavender focus:ring-2 focus:ring-icy-blue/30 outline-none transition-all placeholder:text-pale-slate/20`}
            />
            {errors.password && (
              <p className="text-red-400 text-[10px] ml-5 font-bold italic animate-pulse">
                {errors.password.message}
              </p>
            )}
          </div>


          {apiError && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] py-3 px-4 rounded-2xl text-center font-bold">
              Las credenciales no son válidas. Verificá los datos.
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-4 bg-icy-blue text-jet-black font-black rounded-full shadow-lg shadow-icy-blue/20 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest text-sm disabled:opacity-50"
          >
            {loading ? "Verificando..." : "Entrar al Panel"}
          </button>
        </form>

        <div className="mt-10 text-center border-t border-white/5 pt-6">
        </div>
      </div>
    </div>
  );
};