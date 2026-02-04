import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { clientSchema, type ClientForm as ClientFormType } from "../../../models/clients.model";
import { User, Mail, Phone, Car, Save, Plus, Trash2 } from "lucide-react";

interface Props {
  initialData?: ClientFormType;
  onSubmit: (data: ClientFormType) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const ClientForm = ({ initialData, onSubmit, onCancel, isSubmitting }: Props) => {
  const { register, control, handleSubmit, formState: { errors } } = useForm<ClientFormType>({
    resolver: zodResolver(clientSchema) as any,
    defaultValues: initialData || {
      first_name: "", last_name: "", email: "", phone: "", 
      vehicles: [{ brand: "", model: "", license_plate: "", year: new Date().getFullYear(), color: "" }]
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "vehicles"
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-pale-slate uppercase tracking-widest ml-1">Nombre</label>
          <input {...register("first_name")} className="w-full bg-white/[0.03] border border-white/10 rounded-lg py-2.5 px-4 text-lavender outline-none focus:border-icy-blue/30 text-sm" placeholder="Geronimo" />
          {errors.first_name && <span className="text-red-400 text-[10px]">{errors.first_name.message}</span>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-pale-slate uppercase tracking-widest ml-1">Apellido</label>
          <input {...register("last_name")} className="w-full bg-white/[0.03] border border-white/10 rounded-lg py-2.5 px-4 text-lavender outline-none focus:border-icy-blue/30 text-sm" placeholder="NC" />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-pale-slate uppercase tracking-widest ml-1">WhatsApp</label>
          <input {...register("phone")} className="w-full bg-white/[0.03] border border-white/10 rounded-lg py-2.5 px-4 text-lavender outline-none focus:border-icy-blue/30 text-sm" placeholder="11 2233 4455" />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-pale-slate uppercase tracking-widest ml-1">Email</label>
          <input {...register("email")} className="w-full bg-white/[0.03] border border-white/10 rounded-lg py-2.5 px-4 text-lavender outline-none focus:border-icy-blue/30 text-sm" placeholder="cliente@correo.com" />
        </div>
      </div>

      <div className="pt-4 border-t border-white/5">
        <div className="flex justify-between items-center mb-4">
          <p className="text-[11px] font-black text-icy-blue uppercase tracking-[0.2em]">Vehículos del Cliente</p>
          <button 
            type="button"
            onClick={() => append({ brand: "", model: "", license_plate: "", year: 2024, color: "" })}
            className="flex items-center gap-1.5 text-[10px] font-bold text-icy-blue hover:text-white transition-colors bg-icy-blue/10 px-2 py-1 rounded border border-icy-blue/20"
          >
            <Plus size={12} /> AÑADIR VEHÍCULO
          </button>
        </div>

        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
          {fields.map((field, index) => (
            <div key={field.id} className="p-4 bg-white/[0.02] border border-white/5 rounded-lg relative group/item">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <input {...register(`vehicles.${index}.license_plate`)} placeholder="Patente" className="bg-jet-black border border-white/10 rounded-md py-2 px-3 text-xs text-lavender outline-none focus:border-icy-blue/30" />
                <input {...register(`vehicles.${index}.brand`)} placeholder="Marca" className="bg-jet-black border border-white/10 rounded-md py-2 px-3 text-xs text-lavender outline-none focus:border-icy-blue/30" />
                <input {...register(`vehicles.${index}.model`)} placeholder="Modelo" className="bg-jet-black border border-white/10 rounded-md py-2 px-3 text-xs text-lavender outline-none focus:border-icy-blue/30" />
                <input {...register(`vehicles.${index}.color`)} placeholder="Color" className="bg-jet-black border border-white/10 rounded-md py-2 px-3 text-xs text-lavender outline-none focus:border-icy-blue/30" />
                <input type="number" {...register(`vehicles.${index}.year`)} placeholder="Año" className="bg-jet-black border border-white/10 rounded-md py-2 px-3 text-xs text-lavender outline-none focus:border-icy-blue/30" />
                
                {fields.length > 1 && (
                  <button 
                    type="button" 
                    onClick={() => remove(index)}
                    className="flex items-center justify-center gap-2 text-red-400/50 hover:text-red-400 text-[10px] font-bold uppercase transition-colors"
                  >
                    <Trash2 size={14} /> Quitar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-xs font-bold text-pale-slate hover:text-white transition-colors uppercase tracking-widest">
          Cancelar
        </button>
        <button type="submit" disabled={isSubmitting} className="bg-icy-blue text-jet-black px-8 py-2.5 rounded-lg font-black text-xs uppercase tracking-widest hover:bg-white transition-all flex items-center gap-2 shadow-lg shadow-icy-blue/10">
          <Save size={14} />
          {initialData ? "Actualizar" : "Guardar Cliente y Vehículos"}
        </button>
      </div>
    </form>
  );
};