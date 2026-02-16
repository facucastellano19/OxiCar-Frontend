import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import {
  employeeSchema,
  type EmployeeForm as EmployeeFormType,
  type Employee,
} from "../../../models";
import { Save, User, Mail, Lock, Key, Eye, EyeOff } from "lucide-react";
import { Button } from "../../../components";

interface Props {
  initialData?: Employee | null;
  onSubmit: (data: EmployeeFormType) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const EmployeeForm = ({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting,
}: Props) => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EmployeeFormType>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        username: initialData.username,
        email: initialData.email,
        password: "", // Password siempre vacío al editar
      });
    }
  }, [initialData, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Name */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-bold text-pale-slate uppercase tracking-widest ml-1">Nombre Completo</label>
        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-pale-slate/30 group-focus-within:text-icy-blue/50 transition-colors">
            <User size={14} />
          </div>
          <input
            {...register("name")}
            className={`w-full bg-white/[0.03] border ${errors.name ? "border-red-500" : "border-white/10"} rounded-lg py-2.5 pl-10 pr-4 text-lavender outline-none focus:border-icy-blue/30 text-sm transition-all`}
            placeholder="Ej: Juan Pérez"
          />
        </div>
        {errors.name && <span className="text-red-400 text-[10px] font-medium ml-1 normal-case italic">{errors.name.message}</span>}
      </div>

      {/* Username & Email */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-pale-slate uppercase tracking-widest ml-1">Usuario</label>
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-pale-slate/30 group-focus-within:text-icy-blue/50 transition-colors">
              <Key size={14} />
            </div>
            <input
              {...register("username")}
              className={`w-full bg-white/[0.03] border ${errors.username ? "border-red-500" : "border-white/10"} rounded-lg py-2.5 pl-10 pr-4 text-lavender outline-none focus:border-icy-blue/30 text-sm transition-all`}
              placeholder="juan.perez"
            />
          </div>
          {errors.username && <span className="text-red-400 text-[10px] font-medium ml-1 normal-case italic">{errors.username.message}</span>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-pale-slate uppercase tracking-widest ml-1">Email</label>
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-pale-slate/30 group-focus-within:text-icy-blue/50 transition-colors">
              <Mail size={14} />
            </div>
            <input
              {...register("email")}
              className={`w-full bg-white/[0.03] border ${errors.email ? "border-red-500" : "border-white/10"} rounded-lg py-2.5 pl-10 pr-4 text-lavender outline-none focus:border-icy-blue/30 text-sm transition-all`}
              placeholder="juan@empresa.com"
            />
          </div>
          {errors.email && <span className="text-red-400 text-[10px] font-medium ml-1 normal-case italic">{errors.email.message}</span>}
        </div>
      </div>

      {/* Password */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-bold text-pale-slate uppercase tracking-widest ml-1">Contraseña</label>
        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-pale-slate/30 group-focus-within:text-icy-blue/50 transition-colors">
            <Lock size={14} />
          </div>
          <input
            type={showPassword ? "text" : "password"}
            {...register("password")}
            className={`w-full bg-white/[0.03] border ${errors.password ? "border-red-500" : "border-white/10"} rounded-lg py-2.5 pl-10 pr-10 text-lavender outline-none focus:border-icy-blue/30 text-sm transition-all`}
            placeholder={initialData ? "(Dejar en blanco para no cambiar)" : "********"}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-pale-slate hover:text-icy-blue transition-colors z-10"
          >
            {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        </div>
        {errors.password && <span className="text-red-400 text-[10px] font-medium ml-1 normal-case italic">{errors.password.message}</span>}
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t border-white/5">
        <Button onClick={onCancel} className="px-4 py-2 text-xs font-bold text-pale-slate hover:text-white uppercase tracking-[0.2em] bg-transparent border-none shadow-none">Cancelar</Button>
        <Button type="submit" disabled={isSubmitting} className="bg-icy-blue text-jet-black px-8 py-2.5 rounded-lg font-black text-xs uppercase tracking-[0.2em] hover:bg-white shadow-lg shadow-icy-blue/10 disabled:opacity-50">
          <Save size={14} /> {initialData ? "Actualizar" : "Guardar Empleado"}
        </Button>
      </div>
    </form>
  );
};