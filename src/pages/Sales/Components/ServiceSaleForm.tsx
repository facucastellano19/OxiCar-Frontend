import { useState, useEffect, useRef, useMemo } from "react";
import {
  Trash2,
  Plus,
  Wrench,
  User,
  CreditCard,
  Car,
  Save,
} from "lucide-react";
import { Button, Table } from "../../../components/";
import {
  clientsService,
  salesService,
  servicesService,
} from "../../../services/";
import { serviceSaleSchema } from "../../../models/sales.model";
import { toast } from "sonner";

interface Props {
  onCancel: () => void;
  onSubmit: (data: any) => void;
}

export const ServiceSaleForm = ({ onCancel, onSubmit }: Props) => {
  // --- Data States ---
  const [clients, setClients] = useState<any[]>([]);
  const [clientVehicles, setClientVehicles] = useState<any[]>([]);
  const [availableServices, setAvailableServices] = useState<any[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [errors, setErrors] = useState<Record<string, { message: string }>>({});

  // --- Searchable States ---
  const [clientSearch, setClientSearch] = useState("");
  const [isClientListOpen, setIsClientListOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const clientRef = useRef<HTMLDivElement>(null);

  const [serviceSearch, setServiceSearch] = useState("");
  const [isServiceListOpen, setIsServiceListOpen] = useState(false);
  const [currentService, setCurrentService] = useState<any>(null);
  const serviceRef = useRef<HTMLDivElement>(null);

  // --- Form Logic States ---
  const [selectedVehicleId, setSelectedVehicleId] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [observations, setObservations] = useState("");
  const [serviceCart, setServiceCart] = useState<
    { service: any; price: number }[]
  >([]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (clientRef.current && !clientRef.current.contains(e.target as Node))
        setIsClientListOpen(false);
      if (serviceRef.current && !serviceRef.current.contains(e.target as Node))
        setIsServiceListOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        const resClients = await clientsService.getAll();
        const resServices = await servicesService.getAll();
        const { call: pmsCall } = salesService.getPaymentMethods();
        const resPms = await pmsCall;

        setClients(
          Array.isArray(resClients)
            ? resClients
            : (resClients as any).data || [],
        );
        setAvailableServices(
          Array.isArray(resServices)
            ? resServices
            : (resServices as any).data || [],
        );
        setPaymentMethods(resPms.data?.data || []);
      } catch (error) {
        toast.error("Error al cargar datos del formulario");
      }
    };
    loadData();
  }, []);

  const handleSelectClient = async (client: any) => {
    setSelectedClientId(client.id);
    setClientSearch(`${client.first_name} ${client.last_name}`);
    setIsClientListOpen(false);
    setSelectedVehicleId("");
    setClientVehicles([]);
    try {
      // Llama a clientsRouter.get('/:id/vehicles')
      const resVehicles = await clientsService.getVehicles(client.id);
      setClientVehicles(
        Array.isArray(resVehicles)
          ? resVehicles
          : (resVehicles as any).data || [],
      );
      setErrors((prev) => {
        const n = { ...prev };
        delete n.client_id;
        return n;
      });
    } catch (error) {
      toast.error("Error al cargar vehículos");
    }
  };

  const addServiceToCart = () => {
    if (!currentService) return;
    if (serviceCart.some((item) => item.service.id === currentService.id))
      return toast.warning("Ya agregado");

    setServiceCart([
      ...serviceCart,
      { service: currentService, price: Number(currentService.price) },
    ]);
    setCurrentService(null);
    setServiceSearch("");
    setErrors((prev) => {
      const n = { ...prev };
      delete n.services;
      return n;
    });
  };

  const handleSubmit = () => {
    // MAPEAMOS EXACTAMENTE COMO PIDE Joi postSaleServicesSchema
    const payload = {
      client_id: selectedClientId ?? NaN,
      vehicle_id: Number(selectedVehicleId) || NaN,
      payment_method_id: Number(selectedPaymentMethod) || NaN,
      observations: observations || "",
      services: serviceCart.map((item) => ({
        service_id: Number(item.service.id),
      })),
    };

    const result = serviceSaleSchema.safeParse(payload);
    if (!result.success) {
      const newErrors: Record<string, { message: string }> = {};
      result.error.issues.forEach((issue) => {
        const key = issue.path[0]?.toString() || "form";
        newErrors[key] = { message: issue.message };
      });
      setErrors(newErrors);
      return toast.error("Por favor, revise los campos obligatorios");
    }

    setErrors({});
    onSubmit(payload);
  };

  const filteredClients = useMemo(() => {
    const lowerSearch = clientSearch.toLowerCase();
    return clients.filter(
      (c) =>
        `${c.first_name} ${c.last_name}`.toLowerCase().includes(lowerSearch) &&
        c.vehicles?.length > 0,
    );
  }, [clients, clientSearch]);

  const filteredServices = useMemo(() => {
    const lowerSearch = serviceSearch.toLowerCase();
    return availableServices.filter((s) =>
      s.name.toLowerCase().includes(lowerSearch),
    );
  }, [availableServices, serviceSearch]);

  const total = useMemo(
    () => serviceCart.reduce((acc, item) => acc + item.price, 0),
    [serviceCart],
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* CLIENT SEARCH */}
        <div className="flex flex-col gap-1.5 relative" ref={clientRef}>
          <label className="text-[10px] font-black text-lavender/40 uppercase tracking-widest ml-1">
            Cliente *
          </label>
          <div className="relative group">
            <User
              className={`absolute left-3 top-1/2 -translate-y-1/2 ${errors.client_id ? "text-red-400" : "text-pale-slate"}`}
              size={16}
            />
            <input
              type="text"
              placeholder="Buscar cliente..."
              value={clientSearch}
              onFocus={() => setIsClientListOpen(true)}
              onChange={(e) => {
                setClientSearch(e.target.value);
                setSelectedClientId(null);
              }}
              className={`w-full bg-jet-black/50 border rounded-lg py-2.5 pl-10 pr-4 text-xs text-lavender outline-none transition-all ${errors.client_id ? "border-red-500/50 focus:border-red-500" : "border-white/10 focus:border-icy-blue/30"}`}
            />
          </div>
          {errors.client_id && (
            <span className="text-red-400 text-[10px] font-medium ml-1 italic">
              {errors.client_id.message}
            </span>
          )}
          {isClientListOpen && (
            <div className="absolute top-[105%] left-0 w-full bg-jet-black border border-white/10 rounded-lg shadow-2xl z-[100] max-h-40 overflow-y-auto custom-scrollbar animate-in fade-in">
              {filteredClients.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => handleSelectClient(c)}
                  className="w-full text-left px-4 py-2 text-xs text-pale-slate hover:bg-icy-blue hover:text-jet-black border-b border-white/5 font-bold uppercase transition-colors"
                >
                  {" "}
                  {c.first_name} {c.last_name}{" "}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* VEHICLE SELECTION */}
        <div className="flex flex-col gap-1.5 relative">
          <label className="text-[10px] font-black text-lavender/40 uppercase tracking-widest ml-1">
            Vehículo *
          </label>
          <div className="relative">
            <Car
              className={`absolute left-3 top-1/2 -translate-y-1/2 ${errors.vehicle_id ? "text-red-400" : "text-pale-slate"}`}
              size={16}
            />
            <select
              disabled={!selectedClientId || clientVehicles.length === 0}
              value={selectedVehicleId}
              onChange={(e) => {
                setSelectedVehicleId(e.target.value);
                setErrors((prev) => {
                  const n = { ...prev };
                  delete n.vehicle_id;
                  return n;
                });
              }}
              className={`w-full bg-jet-black/50 border rounded-lg py-2.5 pl-10 pr-4 text-xs text-lavender outline-none appearance-none transition-all ${!selectedClientId ? "opacity-30" : "cursor-pointer"} ${errors.vehicle_id ? "border-red-500/50 focus:border-red-500" : "border-white/10 focus:border-icy-blue/30"}`}
            >
              <option value="">
                {!selectedClientId
                  ? "Elija un cliente"
                  : clientVehicles.length === 0
                    ? "Sin vehículos"
                    : "Seleccionar vehículo..."}
              </option>
              {clientVehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.license_plate?.toUpperCase() || v.plate?.toUpperCase()} -{" "}
                  {v.brand} {v.model}
                </option>
              ))}
            </select>
          </div>
          {errors.vehicle_id && (
            <span className="text-red-400 text-[10px] font-medium ml-1 italic">
              {errors.vehicle_id.message}
            </span>
          )}
        </div>
      </div>

      {/* SERVICE PICKER */}
      <div
        className={`bg-white/[0.03] p-4 rounded-xl border relative space-y-4 shadow-inner ${errors.services ? "border-red-500/30 bg-red-500/5" : "border-white/5"}`}
      >
        <div className="flex gap-4 items-end">
          <div
            className="flex-1 flex flex-col gap-1.5 relative"
            ref={serviceRef}
          >
            <label className="text-[10px] font-black text-icy-blue/60 uppercase tracking-widest ml-1">
              Agregar Servicio
            </label>
            <div className="relative">
              <Wrench
                className="absolute left-3 top-1/2 -translate-y-1/2 text-pale-slate"
                size={16}
              />
              <input
                type="text"
                placeholder="Buscar servicio..."
                value={serviceSearch}
                onFocus={() => setIsServiceListOpen(true)}
                onChange={(e) => {
                  setServiceSearch(e.target.value);
                  setCurrentService(null);
                }}
                className="w-full bg-jet-black border border-white/10 rounded-lg py-2 pl-10 pr-4 text-xs text-lavender outline-none focus:border-icy-blue/30"
              />
            </div>
            {isServiceListOpen && (
              <div className="absolute top-[105%] left-0 w-full bg-jet-black border border-white/10 rounded-lg shadow-2xl z-[100] max-h-40 overflow-y-auto custom-scrollbar animate-in fade-in">
                {filteredServices.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      setCurrentService(s);
                      setServiceSearch(s.name);
                      setIsServiceListOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-pale-slate hover:bg-icy-blue hover:text-jet-black border-b border-white/5 font-bold uppercase"
                  >
                    {s.name} - ${s.price}
                  </button>
                ))}
              </div>
            )}
          </div>
          <Button
            onClick={addServiceToCart}
            disabled={!currentService}
            className="bg-icy-blue text-jet-black px-4 py-2.5 h-[38px] rounded-lg shadow-lg active:scale-95 transition-all"
          >
            <Plus size={18} />
          </Button>
        </div>

        <div className="border border-white/5 rounded-lg bg-jet-black/20 h-[250px] overflow-y-auto custom-scrollbar">
          <Table
            columns={[
              { label: "Servicio", className: "pl-6" },
              { label: "Precio", className: "text-right" },
              { label: "", className: "pr-6 text-right" },
            ]}
            isEmpty={serviceCart.length === 0}
            emptyLabel="No hay servicios seleccionados"
          >
            {serviceCart.map((item, idx) => (
              <tr
                key={idx}
                className="border-b border-white/5 hover:bg-white/[0.01]"
              >
                <td className="px-6 py-3 text-xs text-lavender uppercase font-bold">
                  {item.service.name}
                </td>
                <td className="px-6 py-3 text-xs text-white font-bold text-right font-mono">
                  ${item.price.toLocaleString("es-AR")}
                </td>
                <td className="px-6 py-3 text-right pr-6">
                  <Button
                    onClick={() =>
                      setServiceCart(serviceCart.filter((_, i) => i !== idx))
                    }
                    className="p-1.5 bg-transparent border-none text-pale-slate hover:text-red-500 shadow-none"
                  >
                    <Trash2 size={14} />
                  </Button>
                </td>
              </tr>
            ))}
          </Table>
        </div>

        {errors.services && (
          <span className="text-red-400 text-[10px] font-medium ml-1 italic">
            {errors.services.message}
          </span>
        )}

        <div className="flex justify-between items-center px-2 py-1 border-t border-white/5 pt-3">
          <span className="text-[10px] font-bold text-lavender/40 uppercase tracking-widest italic">
            Total del Servicio
          </span>
          <span className="text-xl font-black text-icy-blue font-mono">
            ${total.toLocaleString("es-AR")}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* PAYMENT METHOD */}
        <div className="flex flex-col gap-1.5 relative">
          <label className="text-[10px] font-black text-lavender/40 uppercase tracking-widest ml-1">
            Método de Pago *
          </label>
          <div className="relative">
            <CreditCard
              className={`absolute left-3 top-1/2 -translate-y-1/2 ${errors.payment_method_id ? "text-red-400" : "text-pale-slate"}`}
              size={16}
            />
            <select
              value={selectedPaymentMethod}
              onChange={(e) => {
                setSelectedPaymentMethod(e.target.value);
                setErrors((prev) => {
                  const n = { ...prev };
                  delete n.payment_method_id;
                  return n;
                });
              }}
              className={`w-full bg-jet-black/50 border rounded-lg py-2.5 pl-10 pr-4 text-xs text-lavender outline-none appearance-none transition-all ${errors.payment_method_id ? "border-red-500/50" : "border-white/10"}`}
            >
              <option value="">Seleccionar pago...</option>
              {paymentMethods.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
          {errors.payment_method_id && (
            <span className="text-red-400 text-[10px] font-medium ml-1 italic">
              {errors.payment_method_id.message}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-black text-lavender/40 uppercase tracking-widest ml-1">
            Observaciones
          </label>
          <textarea
            value={observations}
            onChange={(e) => setObservations(e.target.value)}
            rows={1}
            className="w-full bg-jet-black/50 border border-white/10 rounded-lg p-2.5 text-xs text-lavender outline-none resize-none placeholder:text-lavender/20"
            placeholder="Notas adicionales..."
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
        <Button
          onClick={onCancel}
          className="bg-transparent text-pale-slate px-5 py-2.5 rounded-lg font-bold text-xs uppercase border-none shadow-none"
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          className="bg-icy-blue text-jet-black px-8 py-2.5 rounded-lg font-black text-xs uppercase tracking-widest hover:bg-white shadow-lg"
        >
          <Save size={16} className="mr-2" /> Confirmar Venta
        </Button>
      </div>
    </div>
  );
};
