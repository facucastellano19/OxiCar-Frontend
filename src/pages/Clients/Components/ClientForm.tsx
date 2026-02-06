import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  clientSchema,
  type ClientForm as ClientFormType,
} from "../../../models/clients.model";
import { User, Mail, Phone, Car, Save, Plus, Trash2 } from "lucide-react";

interface Props {
  initialData?: ClientFormType;
  onSubmit: (data: ClientFormType) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const ClientForm = ({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting,
}: Props) => {
  const {
    register,
    control,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<ClientFormType>({
    resolver: zodResolver(clientSchema) as any,
    defaultValues: initialData || {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      vehicles: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "vehicles",
  });

  const handleRemoveVehicle = (index: number) => {
    const vehicle = watch(`vehicles.${index}`);

    if (vehicle && typeof vehicle.id === "number") {
      setValue(`vehicles.${index}.deleted`, true);
    } else {
      remove(index);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(
        (data) => {
          onSubmit(data);
        },
        (err) => {
          console.log("Zod bloqueó el envío por estos errores:", err);
        },
      )}
      className="space-y-6"
    >
      {/* CLIENT PERSONAL INFORMATION SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* FIRST NAME FIELD */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-pale-slate uppercase tracking-widest ml-1">
            Nombre
          </label>
          <input
            {...register("first_name")}
            className={`w-full bg-white/[0.03] border ${errors.first_name ? "border-red-500" : "border-white/10"} rounded-lg py-2.5 px-4 text-lavender outline-none focus:border-icy-blue/30 text-sm transition-all`}
            placeholder="Geronimo"
          />
          {errors.first_name && (
            <span className="text-red-400 text-[10px] font-medium ml-1 normal-case">
              {errors.first_name.message}
            </span>
          )}
        </div>

        {/* LAST NAME FIELD */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-pale-slate uppercase tracking-widest ml-1">
            Apellido
          </label>
          <input
            {...register("last_name")}
            className={`w-full bg-white/[0.03] border ${errors.last_name ? "border-red-500" : "border-white/10"} rounded-lg py-2.5 px-4 text-lavender outline-none focus:border-icy-blue/30 text-sm transition-all`}
            placeholder="NC"
          />
          {errors.last_name && (
            <span className="text-red-400 text-[10px] font-medium ml-1 normal-case">
              {errors.last_name.message}
            </span>
          )}
        </div>

        {/* Phone */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-pale-slate uppercase tracking-widest ml-1">
            Teléfono
          </label>
          <input
            {...register("phone")}
            className={`w-full bg-white/[0.03] border ${errors.phone ? "border-red-500" : "border-white/10"} rounded-lg py-2.5 px-4 text-lavender outline-none focus:border-icy-blue/30 text-sm transition-all`}
            placeholder="11 2233 4455"
          />
          {errors.phone && (
            <span className="text-red-400 text-[10px] font-medium ml-1 normal-case">
              {errors.phone.message}
            </span>
          )}
        </div>

        {/* EMAIL FIELD */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-pale-slate uppercase tracking-widest ml-1">
            Email
          </label>
          <input
            {...register("email")}
            className={`w-full bg-white/[0.03] border ${errors.email ? "border-red-500" : "border-white/10"} rounded-lg py-2.5 px-4 text-lavender outline-none focus:border-icy-blue/30 text-sm transition-all`}
            placeholder="cliente@correo.com"
          />
          {errors.email && (
            <span className="text-red-400 text-[10px] font-medium ml-1 normal-case">
              {errors.email.message}
            </span>
          )}
        </div>
      </div>

      {/* VEHICLES DYNAMIC SECTION */}
      <div className="pt-4 border-t border-white/5">
        <div className="flex justify-between items-center mb-4">
          <div className="flex flex-col">
            <p className="text-[11px] font-black text-icy-blue uppercase tracking-[0.2em]">
              Vehículos
            </p>
            <span className="text-[9px] text-pale-slate/50 uppercase tracking-wider">
              Sección opcional
            </span>
          </div>
          <button
            type="button"
            onClick={() =>
              append({
                brand: "",
                model: "",
                license_plate: "",
                year: new Date().getFullYear(),
                color: "",
              })
            }
            className="flex items-center gap-1.5 text-[10px] font-bold text-icy-blue hover:text-white transition-colors bg-icy-blue/10 px-2 py-1 rounded border border-icy-blue/20"
          >
            <Plus size={12} /> AÑADIR VEHÍCULO
          </button>
        </div>

        {/* VEHICLE LIST CONTAINER */}
        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
          {/* Calculamos si hay vehículos visibles (que no tengan la marca 'deleted') */}
          {fields.filter((_, idx) => !watch(`vehicles.${idx}.deleted`))
            .length === 0 ? (
            /* EMPTY STATE UI */
            <div className="py-10 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-xl bg-white/[0.01]">
              <div className="p-3 bg-white/5 rounded-full mb-3">
                <Car size={20} className="text-pale-slate/20" />
              </div>
              <p className="text-pale-slate/40 text-[11px] font-medium uppercase tracking-widest text-center">
                No se ha agregado ningún vehículo
              </p>
              <span className="text-pale-slate/20 text-[9px] mt-1 normal-case italic">
                Podrás añadir vehículos más tarde desde el perfil del cliente
              </span>
            </div>
          ) : (
            /* RENDER VEHICLE INPUT CARDS */
            fields.map((field, index) => {
              if (watch(`vehicles.${index}.deleted`)) return null;

              return (
                <div
                  key={field.id}
                  className="p-4 bg-white/[0.02] border border-white/5 rounded-lg"
                >
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <input
                      type="hidden"
                      {...register(`vehicles.${index}.id`)}
                    />

                    {/* LICENSE PLATE */}
                    <div className="flex flex-col gap-1">
                      <input
                        {...register(`vehicles.${index}.license_plate`)}
                        placeholder="Patente"
                        className={`bg-jet-black border ${errors.vehicles?.[index]?.license_plate ? "border-red-500" : "border-white/10"} rounded-md py-2 px-3 text-xs text-lavender outline-none focus:border-icy-blue/30`}
                      />
                      {errors.vehicles?.[index]?.license_plate && (
                        <span className="text-red-400 text-[9px] font-medium ml-1 normal-case italic">
                          {errors.vehicles[index]?.license_plate?.message}
                        </span>
                      )}
                    </div>

                    {/* BRAND */}
                    <div className="flex flex-col gap-1">
                      <input
                        {...register(`vehicles.${index}.brand`)}
                        placeholder="Marca"
                        className={`bg-jet-black border ${errors.vehicles?.[index]?.brand ? "border-red-500" : "border-white/10"} rounded-md py-2 px-3 text-xs text-lavender outline-none focus:border-icy-blue/30`}
                      />
                      {errors.vehicles?.[index]?.brand && (
                        <span className="text-red-400 text-[9px] font-medium ml-1 normal-case italic">
                          {errors.vehicles[index]?.brand?.message}
                        </span>
                      )}
                    </div>

                    {/* MODEL */}
                    <div className="flex flex-col gap-1">
                      <input
                        {...register(`vehicles.${index}.model`)}
                        placeholder="Modelo"
                        className={`bg-jet-black border ${errors.vehicles?.[index]?.model ? "border-red-500" : "border-white/10"} rounded-md py-2 px-3 text-xs text-lavender outline-none focus:border-icy-blue/30`}
                      />
                      {errors.vehicles?.[index]?.model && (
                        <span className="text-red-400 text-[9px] font-medium ml-1 normal-case italic">
                          {errors.vehicles[index]?.model?.message}
                        </span>
                      )}
                    </div>

                    {/* COLOR */}
                    <div className="flex flex-col gap-1">
                      <input
                        {...register(`vehicles.${index}.color`)}
                        placeholder="Color"
                        className={`bg-jet-black border ${errors.vehicles?.[index]?.color ? "border-red-500" : "border-white/10"} rounded-md py-2 px-3 text-xs text-lavender outline-none focus:border-icy-blue/30`}
                      />
                      {errors.vehicles?.[index]?.color && (
                        <span className="text-red-400 text-[9px] font-medium ml-1 normal-case italic">
                          {errors.vehicles[index]?.color?.message}
                        </span>
                      )}
                    </div>

                    {/* YEAR */}
                    <div className="flex flex-col gap-1">
                      <input
                        type="number"
                        {...register(`vehicles.${index}.year`)}
                        placeholder="Año"
                        className={`bg-jet-black border ${errors.vehicles?.[index]?.year ? "border-red-500" : "border-white/10"} rounded-md py-2 px-3 text-xs text-lavender outline-none focus:border-icy-blue/30`}
                      />
                      {errors.vehicles?.[index]?.year && (
                        <span className="text-red-400 text-[9px] font-medium ml-1 normal-case italic">
                          {errors.vehicles[index]?.year?.message}
                        </span>
                      )}
                    </div>

                    {/* REMOVE BUTTON - Ahora llama a handleRemoveVehicle */}
                    <button
                      type="button"
                      onClick={() => handleRemoveVehicle(index)}
                      className="flex items-center justify-center gap-2 text-red-400/50 hover:text-red-400 text-[10px] font-bold uppercase transition-colors"
                    >
                      <Trash2 size={14} /> Quitar
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* FORM FOOTER ACTIONS */}
      <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-xs font-bold text-pale-slate hover:text-white transition-colors uppercase tracking-widest"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-icy-blue text-jet-black px-8 py-2.5 rounded-lg font-black text-xs uppercase tracking-widest hover:bg-white transition-all flex items-center gap-2 shadow-lg shadow-icy-blue/10 active:scale-95 disabled:opacity-50"
        >
          <Save size={14} />
          {initialData ? "Actualizar" : "Guardar Cliente"}
        </button>
      </div>
    </form>
  );
};
