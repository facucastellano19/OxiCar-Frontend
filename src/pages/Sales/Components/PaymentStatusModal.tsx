import { useState } from "react";
import { CheckCircle, XCircle, DollarSign } from "lucide-react";
import { Button, ConfirmModal } from "../../../components";
import { salesService } from "../../../services";
import { toast } from "sonner";
import { handleBackendError } from "../../../utilities";

interface Props {
  sale: any;
  onClose: () => void;
  onUpdate: () => void;
}

export const PaymentStatusModal = ({ sale, onClose, onUpdate }: Props) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<number | null>(null);

  const handlePaymentStatus = async () => {
    if (!pendingStatus) return;
    try {
      setIsUpdating(true);
      await salesService.updatePaymentStatus(sale.sale_id, pendingStatus).call;
      toast.success(
        pendingStatus === 2
          ? "Pago confirmado exitosamente"
          : "Venta cancelada exitosamente",
      );
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
            <DollarSign size={18} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-lavender uppercase tracking-wide">
              Actualizar Pago
            </h3>
            <p className="text-[10px] text-pale-slate font-mono">
              Venta #{sale.sale_id}
            </p>
          </div>
        </div>
        <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-pale-slate uppercase tracking-wider">
          {sale.payment_status}
        </div>
      </div>

      {/* Main actions */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          onClick={() => setPendingStatus(2)}
          disabled={isUpdating}
          className="bg-green-500/5 hover:bg-green-500/10 text-green-400 border border-green-500/20 hover:border-green-500/40 py-4 rounded-xl flex-col gap-2 transition-all group h-auto"
        >
          <CheckCircle
            size={20}
            className="group-hover:scale-110 transition-transform"
          />
          <span className="text-[10px] font-black uppercase tracking-widest">
            Confirmar
          </span>
        </Button>

        <Button
          onClick={() => setPendingStatus(3)}
          disabled={isUpdating}
          className="bg-red-500/5 hover:bg-red-500/10 text-red-400 border border-red-500/20 hover:border-red-500/40 py-4 rounded-xl flex-col gap-2 transition-all group h-auto"
        >
          <XCircle
            size={20}
            className="group-hover:scale-110 transition-transform"
          />
          <span className="text-[10px] font-black uppercase tracking-widest">
            Cancelar Venta
          </span>
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
        title={pendingStatus === 2 ? "Confirmar Pago" : "Cancelar Venta"}
        message={
          pendingStatus === 2
            ? "¿Estás seguro que deseas confirmar el pago? Una vez confirmado, la venta se marcará como completada y no podrás modificarla."
            : "¿Estás seguro que deseas cancelar esta venta? Esta acción es irreversible."
        }
        confirmText={pendingStatus === 2 ? "Sí, Confirmar" : "Sí, Cancelar"}
        onConfirm={handlePaymentStatus}
        onCancel={() => setPendingStatus(null)}
      />
    </div>
  );
};
