import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { z } from "zod";
import { Save, Tag } from "lucide-react";
import { Button } from "../../../components";

const categorySchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
});

type CategoryFormType = z.infer<typeof categorySchema>;

interface Props {
  initialData?: { id: number; name: string } | null;
  onSubmit: (data: CategoryFormType) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const CategoriesForm = ({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting,
}: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormType>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({ name: initialData.name });
    }
  }, [initialData, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-bold text-pale-slate uppercase tracking-widest ml-1">
          Nombre de la Categoría
        </label>
        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-pale-slate/30 group-focus-within:text-icy-blue/50 transition-colors">
            <Tag size={14} />
          </div>
          <input
            {...register("name")}
            className={`w-full bg-white/[0.03] border ${
              errors.name ? "border-red-500" : "border-white/10"
            } rounded-lg py-2.5 pl-10 pr-4 text-lavender outline-none focus:border-icy-blue/30 text-sm transition-all`}
            placeholder="Ej: Lavado, Detailing, Cerámicos"
          />
        </div>
        {errors.name && (
          <span className="text-red-400 text-[10px] font-medium ml-1 normal-case italic">
            {errors.name.message}
          </span>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t border-white/5">
        <Button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-xs font-bold text-pale-slate hover:text-white uppercase tracking-[0.2em] bg-transparent border-none shadow-none"
        >
          Cancelar
        </Button>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-icy-blue text-jet-black px-8 py-2.5 rounded-lg font-black text-xs uppercase tracking-[0.2em] hover:bg-white shadow-lg shadow-icy-blue/10 disabled:opacity-50"
        >
          {isSubmitting ? (
            <span className="animate-pulse">Procesando...</span>
          ) : (
            <>
              <Save size={14} />
              {initialData ? "Actualizar" : "Guardar"}
            </>
          )}
        </Button>
      </div>
    </form>
  );
};