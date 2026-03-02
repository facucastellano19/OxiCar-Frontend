import { Button, Table } from "../../../components";
import { Clock } from "lucide-react";

interface Props {
  sale: any;
  onClose: () => void;
}

export const SaleDetailsModal = ({ sale, onClose }: Props) => {
  const isProductSale = sale.products && sale.products.length > 0;
  const items = isProductSale ? sale.products : sale.services;

  const formatTraceDate = (date: string | null) => {
    if (!date) return null;
    return new Date(date).toLocaleString("es-AR", {
      dateStyle: "short",
      timeStyle: "short",
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white/[0.02] p-4 rounded-xl border border-white/5 flex flex-col gap-1">
          <span className="text-[10px] font-black text-lavender/40 uppercase tracking-widest">
            Cliente
          </span>
          <span className="text-sm font-bold text-lavender uppercase tracking-tight">
            {sale.client_name}
          </span>
        </div>

        {sale.vehicle && (
          <div className="bg-white/[0.02] p-4 rounded-xl border border-white/5 flex flex-col gap-1 border-l-icy-blue/30 shadow-[inset_4px_0_0_rgba(165,243,252,0.05)]">
            <span className="text-[10px] font-black text-lavender/40 uppercase tracking-widest">
              Vehículo en Servicio
            </span>
            <span className="text-sm font-bold text-icy-blue uppercase tracking-tight italic">
              {typeof sale.vehicle === "object"
                ? `${sale.vehicle.brand || ""} ${sale.vehicle.model || ""} — ${sale.vehicle.license_plate || ""}`
                : sale.vehicle}
            </span>
          </div>
        )}

        <div className="bg-white/[0.02] p-4 rounded-xl border border-white/5 flex flex-col gap-1">
          <span className="text-[10px] font-black text-lavender/40 uppercase tracking-widest">
            Método de Pago
          </span>
          <span className="text-sm font-bold text-pale-slate uppercase tracking-tight">
            {sale.payment_method}
          </span>
        </div>

        <div className="bg-white/[0.02] p-4 rounded-xl border border-white/5 flex flex-col gap-1">
          <span className="text-[10px] font-black text-lavender/40 uppercase tracking-widest">
            Fecha de Registro
          </span>
          <span className="text-sm font-medium text-pale-slate">
            {formatTraceDate(sale.created_at)}
          </span>
        </div>
      </div>

      {!isProductSale && (
        <div className="bg-white/[0.01] border border-white/5 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Clock size={12} className="text-lavender/30" />
            <h4 className="text-[9px] font-black text-lavender/30 uppercase tracking-[0.2em]">
              Línea de Tiempo Operativa
            </h4>
          </div>

          <div
            className={`grid grid-cols-1 gap-6 ${sale.cancelled_at ? "sm:grid-cols-2" : "sm:grid-cols-3"}`}
          >
            <div className="flex flex-col gap-1 border-l border-amber-500/40 pl-4 py-1">
              <span className="text-[9px] font-black text-amber-500/80 uppercase italic">
                Registrado
              </span>
              <span className="text-[11px] text-lavender/70 font-mono">
                {formatTraceDate(sale.created_at)}
              </span>
            </div>

            {sale.cancelled_at ? (
              <div className="flex flex-col gap-1 border-l border-red-500/60 pl-4 py-1 bg-red-500/5 rounded-r">
                <span className="text-[9px] font-black text-red-500 uppercase italic">
                  Servicio Cancelado
                </span>
                <span className="text-[11px] text-red-400/80 font-mono">
                  {formatTraceDate(sale.cancelled_at)}
                </span>
              </div>
            ) : (
              <>
                <div
                  className={`flex flex-col gap-1 border-l pl-4 py-1 transition-all ${
                    sale.started_at
                      ? "border-blue-500/60"
                      : "border-white/5 opacity-20"
                  }`}
                >
                  <span
                    className={`text-[9px] font-black uppercase italic ${
                      sale.started_at ? "text-blue-400" : "text-pale-slate"
                    }`}
                  >
                    Iniciado
                  </span>
                  <span className="text-[11px] text-lavender/70 font-mono">
                    {formatTraceDate(sale.started_at) || "En espera..."}
                  </span>
                </div>

                <div
                  className={`flex flex-col gap-1 border-l pl-4 py-1 transition-all ${
                    sale.completed_at
                      ? "border-icy-blue/60"
                      : "border-white/5 opacity-20"
                  }`}
                >
                  <span
                    className={`text-[9px] font-black uppercase italic ${
                      sale.completed_at ? "text-icy-blue" : "text-pale-slate"
                    }`}
                  >
                    Finalizado
                  </span>
                  <span className="text-[11px] text-lavender/70 font-mono">
                    {formatTraceDate(sale.completed_at) || "Pendiente"}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <div className="border border-white/5 rounded-xl bg-jet-black/20 overflow-hidden">
        <Table
          columns={[
            {
              label: isProductSale ? "Producto / Insumo" : "Servicio Detallado",
              className: "pl-6 py-4",
            },
            ...(isProductSale
              ? [
                  { label: "Cant.", className: "text-center" },
                  { label: "Unitario", className: "text-right" },
                ]
              : []),
            { label: "Subtotal", className: "text-right pr-6" },
          ]}
          isEmpty={!items || items.length === 0}
        >
          {items?.map((item: any, idx: number) => (
            <tr
              key={idx}
              className="border-b border-white/5 hover:bg-white/[0.01] transition-colors"
            >
              <td className="px-6 py-3.5 text-xs text-lavender uppercase font-black italic tracking-tight">
                {item.product_name || item.name || item.service_name}
              </td>
              {isProductSale && (
                <>
                  <td className="px-6 py-3.5 text-xs text-pale-slate text-center font-mono">
                    {item.quantity}
                  </td>
                  <td className="px-6 py-3.5 text-xs text-pale-slate text-right font-mono">
                    $
                    {Number(item.price || item.unit_price).toLocaleString(
                      "es-AR",
                    )}
                  </td>
                </>
              )}
              <td className="px-6 py-3.5 text-xs text-white font-bold text-right font-mono pr-6">
                ${Number(item.subtotal || item.price).toLocaleString("es-AR")}
              </td>
            </tr>
          ))}
        </Table>

        <div className="flex justify-end items-center px-6 py-4 bg-white/[0.03] border-t border-white/5 gap-4">
          <span className="text-[10px] font-black text-lavender/30 uppercase tracking-[0.2em]">
            Importe Total
          </span>
          <span className="text-lg font-black text-icy-blue font-mono tracking-tighter">
            ${Number(sale.sale_total).toLocaleString("es-AR")}
          </span>
        </div>
      </div>

      {sale.observations && (
        <div className="bg-white/[0.01] p-4 rounded-xl border border-white/5 border-dashed">
          <span className="text-[9px] font-black text-lavender/30 uppercase tracking-widest block mb-2">
            Notas de Taller
          </span>
          <p className="text-xs text-pale-slate italic leading-relaxed">
            "{sale.observations}"
          </p>
        </div>
      )}

      <div className="flex justify-between items-center pt-4 border-t border-white/5">
        <Button
          onClick={onClose}
          className="bg-white/5 text-pale-slate hover:text-white px-8 py-2 rounded-lg font-black text-[10px] uppercase tracking-[0.2em] border border-white/10 hover:bg-white/10 transition-all shadow-md"
        >
          Cerrar
        </Button>
      </div>
    </div>
  );
};
