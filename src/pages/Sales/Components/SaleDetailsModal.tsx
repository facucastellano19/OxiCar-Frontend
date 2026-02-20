import { Button, Table } from "../../../components";

interface Props {
  sale: any;
  onClose: () => void;
}

export const SaleDetailsModal = ({ sale, onClose }: Props) => {
  const isProductSale = sale.products && sale.products.length > 0;
  const items = isProductSale ? sale.products : sale.services;

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-white/[0.02] p-5 rounded-xl border border-white/5 grid grid-cols-2 gap-6">
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-black text-lavender/40 uppercase tracking-widest">
            Cliente
          </span>
          <span className="text-sm font-bold text-lavender uppercase">
            {sale.client_name}
          </span>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-black text-lavender/40 uppercase tracking-widest">
            Método de Pago
          </span>
          <span className="text-sm font-bold text-pale-slate uppercase">
            {sale.payment_method}
          </span>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-black text-lavender/40 uppercase tracking-widest">
            Fecha
          </span>
          <span className="text-sm font-medium text-pale-slate">
            {sale.created_at
              ? new Date(sale.created_at).toLocaleString("es-AR", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })
              : "-"}
          </span>
        </div>

        <div className="flex flex-col gap-1.5">
          {sale.vehicle ? (
            <>
              <span className="text-[10px] font-black text-lavender/40 uppercase tracking-widest">
                Vehículo
              </span>
              <span className="text-sm font-bold text-pale-slate uppercase">
                {typeof sale.vehicle === "object"
                  ? `${sale.vehicle.brand || ""} ${sale.vehicle.model || ""} ${
                      sale.vehicle.license_plate || ""
                    }`
                  : sale.vehicle}
              </span>
            </>
          ) : (
            <span className="hidden md:block" />
          )}
        </div>
      </div>

      {/* Items Table */}
      <div className="border border-white/5 rounded-lg bg-jet-black/20 overflow-hidden">
        <Table
          columns={[
            {
              label: isProductSale ? "Producto" : "Servicio",
              className: "pl-6",
            },
            ...(isProductSale
              ? [
                  { label: "Cant.", className: "text-center" },
                  { label: "Precio Unit.", className: "text-right" },
                ]
              : []),
            { label: "Subtotal", className: "text-right pr-6" },
          ]}
          isEmpty={!items || items.length === 0}
        >
          {items?.map((item: any, idx: number) => (
            <tr
              key={idx}
              className="border-b border-white/5 hover:bg-white/[0.01]"
            >
              <td className="px-6 py-3 text-xs text-lavender uppercase font-bold">
                {item.product_name || item.name || item.service_name}
              </td>
              {isProductSale && (
                <>
                  <td className="px-6 py-3 text-xs text-pale-slate text-center font-mono">
                    {item.quantity}
                  </td>
                  <td className="px-6 py-3 text-xs text-pale-slate text-right font-mono">
                    $
                    {Number(item.price || item.unit_price).toLocaleString(
                      "es-AR",
                    )}
                  </td>
                </>
              )}
              <td className="px-6 py-3 text-xs text-white font-bold text-right font-mono pr-6">
                ${Number(item.subtotal || item.price).toLocaleString("es-AR")}
              </td>
            </tr>
          ))}
        </Table>
        <div className="flex justify-end items-center px-6 py-3 bg-white/[0.02]">
          <span className="text-xs font-black text-lavender/40 uppercase tracking-widest mr-4">
            Total Venta
          </span>
          <span className="text-xl font-black text-icy-blue font-mono">
            ${Number(sale.sale_total).toLocaleString("es-AR")}
          </span>
        </div>
      </div>

      {/* Observations */}
      {sale.observations && (
        <div className="bg-white/[0.02] p-4 rounded-lg border border-white/5">
          <span className="text-[10px] font-black text-lavender/40 uppercase tracking-widest block mb-1">
            Observaciones
          </span>
          <p className="text-xs text-pale-slate italic">
            "{sale.observations}"
          </p>
        </div>
      )}

      {/* Footer Close */}
      <div className="flex justify-end pt-4 border-t border-white/5">
        <Button
          onClick={onClose}
          className="bg-white/5 text-pale-slate hover:text-white px-6 py-2.5 rounded-lg font-bold text-xs uppercase tracking-widest border border-white/10 hover:bg-white/10 transition-all"
        >
          Cerrar
        </Button>
      </div>
    </div>
  );
};
