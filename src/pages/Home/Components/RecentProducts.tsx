import { type RecentProduct } from "../../../models/home.model";
import { User, Tag } from "lucide-react";

export const RecentProducts = ({ products }: { products: RecentProduct[] }) => {
  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-xl p-6">
      <h2 className="text-white text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2">
        <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
        Ventas de productos recientes
      </h2>

      <div className="space-y-4">
        {products.map((p) => (
          <div key={p.sale_id} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors">
            <div className="flex flex-col gap-1">
              <span className="text-lavender text-xs font-bold flex items-center gap-2">
                <User size={12} className="text-amber-500" />
                {p.client_name}
              </span>
              <div className="flex items-center gap-2">
                <Tag size={10} className="text-pale-slate/40" />
                <span className="text-pale-slate/40 text-[10px] uppercase font-medium">
                  {p.products[0]?.product_name} {p.products.length > 1 && `+${p.products.length - 1}`}
                </span>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-white text-[11px] font-black mb-1.5">
                ${Number(p.sale_total).toLocaleString()}
              </p>
              <span className={`text-[9px] font-black px-2 py-0.5 rounded border uppercase ${
                p.payment_status === "Pagado"
                  ? "bg-green-500/10 text-green-400 border-green-500/20"
                  : p.payment_status === "Cancelado"
                    ? "bg-red-500/10 text-red-400 border-red-500/20"
                    : "bg-orange-500/10 text-orange-400 border-orange-500/20"
              }`}>
                {p.payment_status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};