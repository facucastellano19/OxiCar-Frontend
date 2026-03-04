import { useState } from "react";
import { CheckCircle, XCircle, Play, Wrench } from "lucide-react";
import { Button, ConfirmModal } from "../../../components";
import { salesService } from "../../../services";
import { toast } from "sonner";
import { handleBackendError } from "../../../utilities";

interface Props {
  sale: any;
  onClose: () => void;
  onUpdate: () => void;
}

export const ServiceStatusModal = ({ sale, onClose, onUpdate }: Props) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<number | null>(null);

  const getServiceStatusId = (status: string) => {
    const s = status?.toLowerCase() || "";
    if (s.includes("pendiente")) return 1;
    if (s.includes("proceso")) return 2;
    if (s.includes("completado")) return 3;
    if (s.includes("cancelado")) return 4;
    return 1;
  };

  const currentStatusId =
    sale.service_status_id || getServiceStatusId(sale.service_status);

  const handleServiceStatus = async () => {
    if (!pendingStatus) return;
    try {
      setIsUpdating(true);
      await salesService.updateServiceStatus(sale.sale_id, pendingStatus).call;

      const messages: Record<number, string> = {
        2: "Servicio iniciado correctamente",
        3: "Servicio completado exitosamente",
        4: "Servicio cancelado",
      };
      toast.success(messages[pendingStatus] || "Estado actualizado");
      onUpdate();
      onClose();
    } catch (e) {
      toast.error(handleBackendError(e));
    } finally {
      setIsUpdating(false);
      setPendingStatus(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/5 rounded-lg text-icy-blue">
            <Wrench size={18} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-lavender uppercase tracking-wide">
              Estado Servicio
            </h3>
            <p className="text-[10px] text-pale-slate font-mono">
              Venta #{sale.sale_id}
            </p>
          </div>
        </div>
        <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-pale-slate uppercase tracking-wider">
          {sale.service_status}
        </div>
      </div>

      {/* Actions List */}
      <div className="flex flex-col gap-3">
        {currentStatusId === 1 && (
          <Button
            onClick={() => setPendingStatus(2)}
            disabled={isUpdating}
            className="w-full bg-icy-blue/5 hover:bg-icy-blue/10 text-icy-blue border border-icy-blue/20 hover:border-icy-blue/40 py-3 rounded-xl group transition-all"
          >
            <div className="w-full flex items-center justify-between px-2">
              <span className="text-[10px] font-black uppercase tracking-widest">
                Iniciar Servicio
              </span>
              <Play
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </div>
          </Button>
        )}

        {currentStatusId === 2 && (
          <Button
            onClick={() => setPendingStatus(3)}
            disabled={isUpdating}
            className="w-full bg-green-500/5 hover:bg-green-500/10 text-green-400 border border-green-500/20 hover:border-green-500/40 py-3 rounded-xl group transition-all"
          >
            <div className="w-full flex items-center justify-between px-2">
              <span className="text-[10px] font-black uppercase tracking-widest">
                Completar Servicio
              </span>
              <CheckCircle
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </div>
          </Button>
        )}

        <Button
          onClick={() => setPendingStatus(4)}
          disabled={isUpdating}
          className="w-full bg-red-500/5 hover:bg-red-500/10 text-red-400 border border-red-500/20 hover:border-red-500/40 py-3 rounded-xl group transition-all"
        >
          <div className="w-full flex items-center justify-between px-2">
            <span className="text-[10px] font-black uppercase tracking-widest">
              Cancelar Servicio
            </span>
            <XCircle
              size={16}
              className="group-hover:translate-x-1 transition-transform"
            />
          </div>
        </Button>
      </div>
      
      <button
        onClick={onClose}
        className="text-[10px] font-bold text-pale-slate/40 hover:text-white uppercase tracking-widest transition-colors self-center"
      >
        Cerrar sin cambios
      </button>

      <ConfirmModal
        isOpen={!!pendingStatus}
        title={
          pendingStatus === 2
            ? "Iniciar Servicio"
            : pendingStatus === 3
              ? "Completar Servicio"
              : "Cancelar Servicio"
        }
        message={
          pendingStatus === 2
            ? "¿Estás seguro que deseas iniciar el servicio ahora?"
            : pendingStatus === 3
              ? "¿Confirmas que el trabajo ha sido terminado y entregado?"
              : "¿Estás seguro que deseas cancelar este servicio? Esta acción no se puede deshacer."
        }
        confirmText={
          pendingStatus === 2
            ? "Sí, Iniciar"
            : pendingStatus === 3
              ? "Sí, Completar"
              : "Sí, Cancelar"
        }
        onConfirm={handleServiceStatus}
        onCancel={() => setPendingStatus(null)}
      />
    </div>
  );
};
