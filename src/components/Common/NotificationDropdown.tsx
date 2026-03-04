import { Package, AlertCircle } from "lucide-react";
import { type Product } from "../../models/";

interface Props {
  products: Product[];
  onClose: () => void;
}

export const NotificationDropdown = ({ products, onClose }: Props) => {
  return (
    <div className="absolute top-12 right-0 w-80 bg-jet-black border border-white/10 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] z-[100] animate-in fade-in slide-in-from-top-2">
      {/* HEADER */}
      <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
        <h3 className="text-[10px] font-black text-lavender uppercase tracking-[0.2em]">
          Alertas de Inventario
        </h3>
        <span className="bg-orange-500/10 text-orange-400 text-[9px] font-black px-2 py-0.5 rounded border border-orange-500/20 italic">
          {products.length} CRÍTICOS
        </span>
      </div>

      {/* PRODUCTS LIST */}
      <div className="max-h-[320px] overflow-y-auto custom-scrollbar">
        {products.length === 0 ? (
          <div className="p-10 text-center">
            <Package size={24} className="mx-auto text-white/5 mb-3" />
            <p className="text-[9px] text-pale-slate/20 uppercase font-black tracking-[0.2em]">
              No se encontraron productos con stock bajo
            </p>
          </div>
        ) : (
          products.map((product) => (
            <div
              key={product.id}
              className="p-4 border-b border-white/[0.02] hover:bg-white/[0.02] transition-all group cursor-default"
            >
              <div className="flex items-start gap-3">
                <div className="mt-1 p-1.5 bg-orange-500/5 rounded border border-orange-500/10 text-orange-500/50 group-hover:text-orange-500 transition-colors">
                  <AlertCircle size={12} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-bold text-lavender/70 uppercase italic truncate tracking-wide">
                    {product.name}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[9px] font-black text-orange-500/80 uppercase">
                      Stock: {product.stock}
                    </span>
                    <span className="text-[9px] font-bold text-pale-slate/30 uppercase tracking-tighter">
                      Mínimo: {product.min_stock}
                    </span>
                  </div>

                  <div className="w-full h-[2px] bg-white/5 mt-2 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-orange-500"
                      style={{
                        width: `${Math.min((product.stock / product.min_stock) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* FOOTER */}
      <div className="p-3 bg-white/[0.01] text-center border-t border-white/5">
        <button
          onClick={onClose}
          className="text-[9px] font-black text-icy-blue/40 hover:text-icy-blue uppercase tracking-[0.3em] transition-colors"
        >
          Cerrar Panel
        </button>
      </div>
    </div>
  );
};
