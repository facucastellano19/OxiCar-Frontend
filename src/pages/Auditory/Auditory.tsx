import { useEffect, useState, useCallback } from "react";
import { auditService } from "../../services";
import { type AuditLog, type AuditSearchParams } from "../../models";
import { Table, type TableColumn, Button } from "../../components";
import { toast } from "sonner";
import {
  Search,
  RotateCcw,
  User,
  Database,
  Activity,
  Terminal,
} from "lucide-react";
import { AuditDetailsModal } from "./Components/AuditoryDetailsModal";

export const Auditory = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const [filters, setFilters] = useState<AuditSearchParams>({
    username: "",
    actionType: "",
    entityType: "",
    startDate: "",
    endDate: "",
  });

  const actionLabels: Record<string, string> = {
    CREATE: "CREACIÓN",
    DELETE: "DESACTIVAR",
    UPDATE: "MODIFICACIÓN",
    RESTORE: "RESTAURACIÓN",
    LOGIN_SUCCESS: "ACCESO EXITOSO",
    LOGIN_FAIL: "ACCESO FALLIDO",
  };

  const entityLabels: Record<string, string> = {
    product: "PRODUCTOS",
    client: "CLIENTES",
    service: "SERVICIOS",
    service_category: "CATEGORÍAS DE SERVICIO",
    product_category: "CATEGORÍAS DE PRODUCTO",
    sale_service: "VENTA SERVICIOS",
    sale_product: "VENTA PRODUCTOS",
    user: "USUARIOS",
    employee: "USUARIOS",
  };

  const columns: TableColumn[] = [
    { label: "Usuario" },
    { label: "Acción" },
    { label: "Entidad" },
    { label: "Referencia" },
    { label: "Fecha" },
    { label: "Detalles", className: "text-right" },
  ];

  const fetchLogs = useCallback(
    async (searchFilters = filters) => {
      setLoading(true);
      try {
        const cleanFilters = Object.fromEntries(
          Object.entries(searchFilters).filter(([_, v]) => v !== ""),
        );
        const response = await auditService.getAuditLogs(cleanFilters);
        setLogs(response.data);
      } catch (error) {
        toast.error("Error al cargar los registros");
      } finally {
        setLoading(false);
      }
    },
    [filters],
  );

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleReset = () => {
    const resetValues = {
      username: "",
      actionType: "",
      entityType: "",
      startDate: "",
      endDate: "",
    };
    setFilters(resetValues);
    fetchLogs(resetValues);
  };

  const getActionClass = (action: string) => {
    switch (action) {
      case "CREATE":
        return "bg-green-500/10 text-green-400 border-green-500/20";
      case "UPDATE":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "LOGIN_SUCCESS":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "LOGIN_FAIL":
        return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      case "RESTORE":
        return "bg-green-500/10 text-green-400 border-green-500/20";
      default:
        return "bg-orange-500/10 text-orange-400 border-orange-500/20";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-[1600px] mx-auto">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold text-lavender uppercase italic font-black">
          Auditoría
        </h1>
        <div className="h-1 w-12 bg-icy-blue mt-2"></div>
        <p className="text-pale-slate/40 text-[10px] uppercase tracking-[0.3em] mt-4 font-bold">
          Trazabilidad de NcDetailing
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4 bg-white/[0.02] border border-white/5 p-4 rounded-xl items-end">
        <div className="flex flex-col gap-1.5">
          <label className="text-[9px] font-black text-lavender/30 uppercase ml-1 flex items-center gap-1">
            <User size={10} /> Usuario
          </label>
          <input
            type="text"
            placeholder="Buscar..."
            value={filters.username}
            onChange={(e) =>
              setFilters({ ...filters, username: e.target.value })
            }
            className="bg-jet-black/50 border border-white/10 rounded-lg py-2 px-3 text-[11px] text-lavender outline-none focus:border-icy-blue/30"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[9px] font-black text-lavender/30 uppercase ml-1 flex items-center gap-1">
            <Activity size={10} /> Acción
          </label>
          <select
            value={filters.actionType}
            onChange={(e) =>
              setFilters({ ...filters, actionType: e.target.value })
            }
            className="bg-jet-black/50 border border-white/10 rounded-lg py-2 px-3 text-[11px] text-lavender outline-none appearance-none cursor-pointer"
          >
            <option value="">TODAS</option>
            {Object.entries(actionLabels).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[9px] font-black text-lavender/30 uppercase ml-1 flex items-center gap-1">
            <Database size={10} /> Entidad
          </label>
          <select
            value={filters.entityType}
            onChange={(e) =>
              setFilters({ ...filters, entityType: e.target.value })
            }
            className="bg-jet-black/50 border border-white/10 rounded-lg py-2 px-3 text-[11px] text-lavender outline-none appearance-none cursor-pointer"
          >
            <option value="">TODAS</option>
            {Array.from(
              new Set(Object.entries(entityLabels).map(([_, label]) => label)),
            ).map((label) => {
              const key = Object.keys(entityLabels).find(
                (k) => entityLabels[k] === label,
              );
              return (
                <option key={key} value={key}>
                  {label}
                </option>
              );
            })}
          </select>
        </div>

        <div className="xl:col-span-2 grid grid-cols-2 gap-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] font-black text-lavender/30 uppercase ml-1">
              Desde
            </label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) =>
                setFilters({ ...filters, startDate: e.target.value })
              }
              className="bg-jet-black/50 border border-white/10 rounded-lg py-2 px-3 text-[11px] text-lavender w-full"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] font-black text-lavender/30 uppercase ml-1">
              Hasta
            </label>
            <div className="flex gap-2">
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) =>
                  setFilters({ ...filters, endDate: e.target.value })
                }
                className="bg-jet-black/50 border border-white/10 rounded-lg py-2 px-3 text-[11px] text-lavender w-full"
              />
              <Button
                onClick={() => fetchLogs()}
                className="p-2.5 bg-icy-blue/10 text-icy-blue"
              >
                <Search size={16} />
              </Button>
              <Button
                onClick={handleReset}
                className="p-2.5 bg-white/5 text-red-400"
              >
                <RotateCcw size={16} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/[0.03] border border-white/10 rounded-xl overflow-hidden">
        <Table
          columns={columns}
          isLoading={loading}
          isEmpty={logs.length === 0}
        >
          {logs.map((log) => (
            <tr key={log.id} className="border-b border-white/[0.02]">
              <td className="px-6 py-4">
                <div className="flex flex-col font-bold text-xs text-lavender">
                  {log.username}
                  <span className="text-[9px] text-pale-slate/30">
                    {log.ip_address}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4">
                <span
                  className={`text-[9px] font-black px-2 py-0.5 rounded border ${getActionClass(log.action_type)}`}
                >
                  {actionLabels[log.action_type] || log.action_type}
                </span>
              </td>
              <td className="px-6 py-4 text-[10px] text-pale-slate/60 font-black uppercase italic">
                {entityLabels[log.entity_type ?? ""] ||
                  log.entity_type ||
                  "SISTEMA"}
              </td>
              <td className="px-6 py-4 text-xs text-lavender/60 font-mono">
                #{log.entity_id || "-"}
              </td>
              <td className="px-6 py-4 text-xs text-lavender/60">
                {new Date(log.created_at).toLocaleString()}
              </td>
              <td className="px-6 py-4 text-right">
                <button
                  onClick={() => setSelectedLog(log)}
                  className="p-2 text-icy-blue/40 hover:text-icy-blue hover:bg-icy-blue/10 rounded-lg transition-all"
                >
                  <Terminal size={14} />
                </button>
              </td>
            </tr>
          ))}
        </Table>
      </div>

      {selectedLog && (
        <AuditDetailsModal
          log={selectedLog}
          onClose={() => setSelectedLog(null)}
        />
      )}
    </div>
  );
};
