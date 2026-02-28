import { useMemo } from "react";
import {
  X,
  ArrowRight,
  PlusCircle,
  History,
  AlertCircle,
  Package,
} from "lucide-react";
import { type AuditLog } from "../../../models";

const ENTITY_NAMES: Record<string, string> = {
  product: "Producto",
  client: "Cliente",
  sale_service: "Venta de Servicio",
  sale_product: "Venta de Producto",
  user: "Usuario/Empleado",
  employee: "Empleado",
  vehicle: "Vehículo",
  service_category: "Categoría de Servicio",
  product_category: "Categoría de Producto",
  services: "Servicio",
  sales: "Venta",
};

const FIELD_LABELS: Record<string, string> = {
  total: "Monto Total",
  phone: "Teléfono",
  created_by: "ID Usuario Responsable",
  payment_method_id: "Método de Pago",
  payment_status_id: "Estado de Pago",
  service_status_id: "Estado del Servicio",
  min_stock: "Stock Mínimo",
  category_id: " ID Categoría",
  description: "Descripción",
  stock: "Stock Actual",
  price: "Precio",
  vehicle_id: "ID Vehículo",
  name: "Nombre",
  products: "Productos Vendidos",
  services: "Servicios Realizados",
  first_name: "Nombre",
  observations: "Observaciones",
  last_name: "Apellido",
  sale_type_id: "Tipo de Venta",
  role_id: "Rol",
  username: "Usuario",
  client_id: "ID Cliente",
  email: "Email",
  client_name: "Nombre del Cliente",
  vehicle_details: "Vehículo / Patente",
  deleted_at: "Estado del Registro",
  vehicles: "Vehículos Asociados",
  errorMessage: "Motivo del Error",
};

const VALUE_MAPS: Record<string, Record<number | string, string>> = {
  payment_method_id: { 1: "Efectivo", 2: "Transferencia" },
  payment_status_id: { 1: "Pendiente", 2: "Pagado", 3: "Cancelado" },
  service_status_id: {
    1: "Pendiente",
    2: "En proceso",
    3: "Completado",
    4: "Cancelado",
  },
  role_id: { 1: "Administrador", 2: "Empleado" },
  sale_type_id: { 1: "Servicio", 2: "Producto" },
};

const BLACKLIST = [
  "created_at",
  "updated_at",
  "updated_by",
  "deleted_by",
  "token",
  "password",
  "ipAddress",
  "username",
];

// --- HELPERS & SUB-COMPONENTS---

const formatCurrency = (val: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(val);

const extractData = (data: any, entity_type: string): Record<string, any> => {
  if (!data || typeof data !== "object") return {};
  if (data.errorMessage || data.error_message)
    return { errorMessage: data.errorMessage || data.error_message };

  let raw;
  if (data.client || data.vehicles) {
    raw = {
      ...(data.client || {}),
      vehicles: Array.isArray(data.vehicles) ? data.vehicles : [],
    };
  } else {
    raw = data[entity_type ?? ""] || data.sale || data;
  }

  if (typeof raw !== "object" || raw === null) return {};

  return Object.fromEntries(
    Object.entries(raw).filter(([k]) => !BLACKLIST.includes(k)),
  );
};

const ValueRenderer = ({
  value,
  rKey,
  colorClass,
}: {
  value: any;
  rKey: string;
  colorClass: string;
}) => {
  if (rKey === "deleted_at") return value ? "Desactivado (Baja)" : "Activo";
  if (value === null || value === undefined || value === "") return "—";
  if (["total", "price", "subtotal"].includes(rKey))
    return formatCurrency(Number(value));

  const items = Array.isArray(value)
    ? value
    : value?.products || value?.services;

  if (Array.isArray(items)) {
    return (
      <div className="flex flex-col gap-2 w-full text-center">
        {items.map((item: any, idx: number) => (
          <div
            key={idx}
            className={`flex flex-col items-center p-2 rounded ${colorClass} bg-white/[0.03] border border-white/5`}
          >
            <div className="flex items-center gap-1.5 uppercase font-black tracking-tighter text-[10px]">
              <span className="opacity-30">
                #{item.product_id || item.service_id || item.id || "?"}
              </span>
              <span className="truncate max-w-[150px]">
                {item.product_name ||
                  item.service_name ||
                  item.name ||
                  (item.brand ? `${item.brand} ${item.model}` : "Sin nombre")}
              </span>
            </div>
            {item.quantity && (
              <div className="text-[9px] mt-1 font-mono opacity-50 italic">
                x{item.quantity}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }
  return VALUE_MAPS[rKey]?.[Number(value)] || String(value);
};

export const AuditDetailsModal = ({
  log,
  onClose,
}: {
  log: AuditLog;
  onClose: () => void;
}) => {
  const {
    id,
    action_type,
    entity_type,
    entity_id,
    ip_address,
    status,
    changes,
  } = log;

  const isUpdateAction = ["UPDATE", "DELETE", "RESTORE"].includes(action_type);

  const { oldVal, newVal } = useMemo(() => {
    return {
      oldVal: extractData(changes?.oldValue, entity_type ?? ""),
      newVal: extractData(changes?.newValue, entity_type ?? ""),
    };
  }, [changes, entity_type]);

  const relevantKeys = useMemo(() => {
    const keys = new Set([...Object.keys(oldVal), ...Object.keys(newVal)]);
    return Array.from(keys).filter((key) => {
      if (entity_type === "sale_product" && key === "service_status_id")
        return false;

      const sOld = JSON.stringify(oldVal[key] ?? "");
      const sNew = JSON.stringify(newVal[key] ?? "");

      if (["stock", "products", "services", "total"].includes(key))
        return sOld !== sNew;

      if (key === "deleted_at") return sOld !== sNew;

      if (isUpdateAction && newVal.deleted_at !== oldVal.deleted_at)
        return false;

      return sOld !== sNew;
    });
  }, [oldVal, newVal, entity_type, isUpdateAction]);

  const getModalTitle = () => {
    if (status === "FAILURE")
      return entity_type === "user" ? "Acceso Denegado" : "Error en Operación";
    if (
      entity_type === "user" &&
      relevantKeys.length === 0 &&
      status === "SUCCESS"
    )
      return "Login Exitoso";
    const titles: Record<string, string> = {
      CREATE: "Alta",
      INSERT: "Alta",
      DELETE: "Desactivación",
      RESTORE: "Restauración",
    };
    return titles[action_type] || "Modificación";
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-jet-black/98 backdrop-blur-xl animate-fade-in font-sans text-left">
      <div className="bg-jet-black border border-white/10 w-full max-w-xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* HEADER */}
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
          <div className="flex items-center gap-4">
            <div
              className={`p-2 rounded-lg ${status === "FAILURE" ? "bg-rose-500/10 text-rose-400" : isUpdateAction ? "bg-blue-500/10 text-blue-400" : "bg-emerald-500/10 text-emerald-400"}`}
            >
              {status === "FAILURE" ? (
                <AlertCircle size={20} />
              ) : isUpdateAction ? (
                <History size={20} />
              ) : (
                <PlusCircle size={20} />
              )}
            </div>
            <div>
              <h2 className="font-black uppercase tracking-[0.2em] text-[10px] italic text-white leading-none">
                {getModalTitle()}
              </h2>
              <p className="text-[9px] text-pale-slate/40 uppercase font-black mt-1">
                {ENTITY_NAMES[entity_type ?? ""] || entity_type} • ID #
                {entity_id || "N/A"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-pale-slate/40 hover:text-white transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-8 overflow-y-auto custom-scrollbar space-y-8">
          {relevantKeys.length > 0 ? (
            relevantKeys.map((key) => (
              <div key={key} className="space-y-4">
                <label className="text-[10px] font-black text-icy-blue/40 uppercase tracking-[0.2em] flex items-center gap-2">
                  <Package size={12} />{" "}
                  {FIELD_LABELS[key] || key.replace(/_/g, " ")}
                </label>

                {isUpdateAction ? (
                  <div className="relative flex w-full bg-white/[0.01] border border-white/5 rounded-xl overflow-hidden min-h-[80px]">
                    <div className="w-1/2 p-5 flex flex-col justify-center border-white/5">
                      <span className="text-[8px] text-rose-400/30 font-black uppercase block mb-3 text-center">
                        Anterior
                      </span>
                      <div className="text-xs text-rose-400/80 italic text-center px-2 break-words leading-tight flex justify-center">
                        <ValueRenderer
                          value={oldVal[key]}
                          rKey={key}
                          colorClass="text-rose-400"
                        />
                      </div>
                    </div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 opacity-20">
                      <ArrowRight size={16} className="text-white" />
                    </div>
                    <div className="w-1/2 p-5 flex flex-col justify-center">
                      <span className="text-[8px] text-emerald-400/30 font-black uppercase block mb-3 text-center">
                        Actual
                      </span>
                      <div className="text-xs text-emerald-400 font-bold text-center px-2 break-words leading-tight flex justify-center">
                        <ValueRenderer
                          value={newVal[key]}
                          rKey={key}
                          colorClass="text-emerald-400"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white/[0.02] border border-white/5 rounded-xl px-5 py-3.5 w-full text-center">
                    <div className="text-xs text-lavender font-bold leading-none flex justify-center">
                      <ValueRenderer
                        value={newVal[key]}
                        rKey={key}
                        colorClass="text-lavender"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
              <div
                className={`p-4 rounded-full ${status === "FAILURE" ? "bg-rose-500/10 text-rose-400" : "bg-emerald-500/10 text-emerald-400"}`}
              >
                {status === "FAILURE" ? (
                  <AlertCircle size={40} className="animate-pulse" />
                ) : (
                  <PlusCircle size={40} className="opacity-20" />
                )}
              </div>
              <div className="space-y-2">
                <p className="text-sm text-white font-bold uppercase tracking-widest italic">
                  {getModalTitle()}
                </p>
                <p className="text-[11px] text-pale-slate/60 max-w-[280px] leading-relaxed mx-auto font-medium">
                  {(log as any).errorMessage ||
                    (log as any).error_message ||
                    newVal.errorMessage ||
                    (status === "FAILURE"
                      ? "El intento de acceso fue rechazado por el servidor."
                      : "La operación se registró correctamente.")}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="p-5 bg-white/[0.01] border-t border-white/5 flex justify-between items-center px-8 text-[7px] text-pale-slate/20 font-mono tracking-widest uppercase italic">
          <div className="flex gap-4">
            <span>IP: {ip_address}</span>
            <span>Trace: {id}</span>
          </div>
          <button
            onClick={onClose}
            className="px-10 py-3 bg-white/5 text-white text-[9px] rounded-xl font-black uppercase hover:bg-white/10 border border-white/5 transition-all"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
