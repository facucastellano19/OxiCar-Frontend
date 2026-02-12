import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import {
  productSchema,
  type ProductForm as ProductFormType,
  type Product,
  type ProductCategory,
} from "../models";
import { Save, Layers, Tag, DollarSign, Package, AlertTriangle } from "lucide-react";
import { Button } from "../components";

interface Props {
  initialData?: Product | null;
  categories: ProductCategory[];
  onSubmit: (data: ProductFormType) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const ProductForm = ({
  initialData,
  categories,
  onSubmit,
  onCancel,
  isSubmitting,
}: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormType>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      category_id: 0,
      price: 0,
      stock: 0,
      min_stock: 0,
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        category_id: Number(initialData.category_id),
        price: Number(initialData.price),
        stock: Number(initialData.stock),
        min_stock: Number(initialData.min_stock),
      });
    }
  }, [initialData, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Name */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-bold text-pale-slate uppercase tracking-widest ml-1">
          Nombre del Producto
        </label>
        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-pale-slate/30 group-focus-within:text-icy-blue/50 transition-colors">
            <Tag size={14} />
          </div>
          <input
            {...register("name")}
            className={`w-full bg-white/[0.03] border ${errors.name ? "border-red-500" : "border-white/10"} rounded-lg py-2.5 pl-10 pr-4 text-lavender outline-none focus:border-icy-blue/30 text-sm transition-all`}
            placeholder="Ej: Cera de Carnauba"
          />
        </div>
        {errors.name && <span className="text-red-400 text-[10px] font-medium ml-1 normal-case italic">{errors.name.message}</span>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Category */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-pale-slate uppercase tracking-widest ml-1">Categoría</label>
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-pale-slate/30 group-focus-within:text-icy-blue/50 transition-colors pointer-events-none">
              <Layers size={14} />
            </div>
            <select
              {...register("category_id", { valueAsNumber: true })}
              className={`w-full bg-jet-black border ${errors.category_id ? "border-red-500" : "border-white/10"} rounded-lg py-2.5 pl-10 pr-4 text-lavender outline-none focus:border-icy-blue/30 text-sm transition-all appearance-none cursor-pointer`}
            >
              <option value={0} disabled>Seleccionar...</option>
              {categories.map((cat) => (
                <option key={cat.id} value={Number(cat.id)}>{cat.name.toUpperCase()}</option>
              ))}
            </select>
          </div>
          {errors.category_id && <span className="text-red-400 text-[10px] font-medium ml-1 normal-case italic">{errors.category_id.message}</span>}
        </div>

        {/* Price */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-pale-slate uppercase tracking-widest ml-1">Precio</label>
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-pale-slate/30 group-focus-within:text-icy-blue/50 transition-colors">
              <DollarSign size={14} />
            </div>
            <input
              type="number"
              step="0.01"
              {...register("price", { valueAsNumber: true })}
              className={`w-full bg-white/[0.03] border ${errors.price ? "border-red-500" : "border-white/10"} rounded-lg py-2.5 pl-10 pr-4 text-lavender outline-none focus:border-icy-blue/30 text-sm transition-all font-mono`}
              placeholder="0.00"
            />
          </div>
          {errors.price && <span className="text-red-400 text-[10px] font-medium ml-1 normal-case italic">{errors.price.message}</span>}
        </div>

        {/* Stock */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-pale-slate uppercase tracking-widest ml-1">Stock Actual</label>
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-pale-slate/30 group-focus-within:text-icy-blue/50 transition-colors">
              <Package size={14} />
            </div>
            <input
              type="number"
              {...register("stock", { valueAsNumber: true })}
              className={`w-full bg-white/[0.03] border ${errors.stock ? "border-red-500" : "border-white/10"} rounded-lg py-2.5 pl-10 pr-4 text-lavender outline-none focus:border-icy-blue/30 text-sm transition-all font-mono`}
              placeholder="0"
            />
          </div>
          {errors.stock && <span className="text-red-400 text-[10px] font-medium ml-1 normal-case italic">{errors.stock.message}</span>}
        </div>

        {/* Min Stock */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-pale-slate uppercase tracking-widest ml-1">Stock Mínimo</label>
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-pale-slate/30 group-focus-within:text-icy-blue/50 transition-colors">
              <AlertTriangle size={14} />
            </div>
            <input
              type="number"
              {...register("min_stock", { valueAsNumber: true })}
              className={`w-full bg-white/[0.03] border ${errors.min_stock ? "border-red-500" : "border-white/10"} rounded-lg py-2.5 pl-10 pr-4 text-lavender outline-none focus:border-icy-blue/30 text-sm transition-all font-mono`}
              placeholder="0"
            />
          </div>
          {errors.min_stock && <span className="text-red-400 text-[10px] font-medium ml-1 normal-case italic">{errors.min_stock.message}</span>}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t border-white/5">
        <Button onClick={onCancel} className="px-4 py-2 text-xs font-bold text-pale-slate hover:text-white uppercase tracking-[0.2em] bg-transparent border-none shadow-none">Cancelar</Button>
        <Button type="submit" disabled={isSubmitting} className="bg-icy-blue text-jet-black px-8 py-2.5 rounded-lg font-black text-xs uppercase tracking-[0.2em] hover:bg-white shadow-lg shadow-icy-blue/10 disabled:opacity-50">
          <Save size={14} /> {initialData ? "Actualizar" : "Guardar Producto"}
        </Button>
      </div>
    </form>
  );
};