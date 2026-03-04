import { useState, useEffect, useCallback, useMemo } from "react";
import { Plus, Search, Wrench, Eye, RotateCcw, DollarSign } from "lucide-react";
import {
  Button,
  Table,
  Toggle,
  Pagination,
  ActionButton,
} from "../../components/";
import { useApi } from "../../hooks";
import { salesService } from "../../services/";
import { type Sale } from "../../models/sales.model";
import { ProductSaleForm } from "./Components/ProductSaleForm";
import { toast } from "sonner";
import { handleBackendError } from "../../utilities";
import { ServiceSaleForm } from "./Components/ServiceSaleForm";
import { SaleDetailsModal } from "./Components/SaleDetailsModal";
import { PaymentStatusModal } from "./Components/PaymentStatusModal";
import { ServiceStatusModal } from "./Components/ServiceStatusModal";

export const Sales = () => {
  const [view, setView] = useState<"products" | "services">("products");
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [serviceStatus, setServiceStatus] = useState("");

  // --- Modal control states ---
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isServiceStatusModalOpen, setIsServiceStatusModalOpen] =
    useState(false);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);

  // --- Pagination States ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const {
    loading: loadingProducts,
    data: productsData,
    fetch: fetchProducts,
  } = useApi(salesService.getProductsSales);

  const {
    loading: loadingServices,
    data: servicesData,
    fetch: fetchServices,
  } = useApi(salesService.getServicesSales);

  const loadData = useCallback(() => {
    const params = {
      clientName: searchTerm || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      paymentStatusId: paymentStatus ? Number(paymentStatus) : undefined,
      serviceStatusId:
        view === "services" && serviceStatus
          ? Number(serviceStatus)
          : undefined,
    };

    if (view === "products") fetchProducts(params);
    else fetchServices(params);
  }, [
    view,
    searchTerm,
    startDate,
    endDate,
    paymentStatus,
    serviceStatus,
    fetchProducts,
    fetchServices,
  ]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleProductSubmit = useCallback(
    async (data: any) => {
      try {
        await salesService.postProductSale(data).call;
        toast.success("¡Venta de producto registrada con éxito!");
        setIsProductModalOpen(false);
        loadData();
      } catch (e) {
        toast.error(handleBackendError(e));
      }
    },
    [loadData],
  );

  const handleServiceSubmit = useCallback(
    async (data: any) => {
      try {
        await salesService.postServiceSale(data).call;
        toast.success("¡Venta de servicio registrada con éxito!");
        setIsServiceModalOpen(false);
        loadData();
      } catch (e) {
        toast.error(handleBackendError(e));
      }
    },
    [loadData],
  );

  const handleViewDetails = (sale: Sale) => {
    setSelectedSale(sale);
    setIsDetailsModalOpen(true);
  };

  const handlePaymentClick = (sale: Sale) => {
    setSelectedSale(sale);
    setIsPaymentModalOpen(true);
  };

  const handleServiceStatusClick = (sale: Sale) => {
    setSelectedSale(sale);
    setIsServiceStatusModalOpen(true);
  };

  const rawData =
    view === "products" ? productsData?.data || [] : servicesData?.data || [];
  const isLoading = view === "products" ? loadingProducts : loadingServices;

  // Pagination logic
  const totalItems = rawData.length;
  const currentData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return rawData.slice(start, start + itemsPerPage);
  }, [rawData, currentPage, itemsPerPage]);

  const isPaymentModifiable = (status: string) => {
    const s = status?.toLowerCase() || "";
    return !(
      s.includes("pagado") ||
      s.includes("completado") ||
      s.includes("cancelado")
    );
  };

  const isServiceModifiable = (status: string) => {
    const s = status?.toLowerCase() || "";
    return !(s.includes("completado") || s.includes("cancelado"));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* HEADER */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-lavender tracking-tight uppercase italic font-black">
            Control de Ventas
          </h1>
          <div className="h-1 w-12 bg-icy-blue mt-1"></div>
        </div>

        <div className="flex gap-3">
          {view === "services" && (
            <Button
              onClick={() => setIsServiceModalOpen(true)}
              className="bg-icy-blue text-jet-black px-5 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-white transition-all shadow-lg shadow-icy-blue/10 animate-in fade-in zoom-in duration-300"
            >
              <Plus size={18} className="mr-2" /> Venta Servicio
            </Button>
          )}
          {view === "products" && (
            <Button
              onClick={() => setIsProductModalOpen(true)}
              className="bg-icy-blue text-jet-black px-5 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-white transition-all shadow-lg shadow-icy-blue/10 animate-in fade-in zoom-in duration-300"
            >
              <Plus size={18} className="mr-2" /> Venta Producto
            </Button>
          )}
        </div>
      </div>

      {/* FILTERS & TABLE CARD */}
      <div className="bg-white/[0.02] border border-white/5 rounded-xl overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-white/5 bg-white/[0.01] space-y-6">
          <div className="flex flex-col lg:flex-row justify-between gap-4 items-end">
            <div className="flex flex-wrap gap-4 items-end">
              {/* SEARCH */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-lavender/40 uppercase tracking-widest ml-1">
                  Cliente
                </label>
                <div className="relative w-full md:w-64">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-pale-slate"
                    size={16}
                  />
                  <input
                    type="text"
                    placeholder="Buscar cliente..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full bg-jet-black/50 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-xs text-lavender outline-none focus:border-icy-blue/30 transition-all"
                  />
                </div>
              </div>

              {/* DATE FILTERS */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-lavender/40 uppercase tracking-widest ml-1">
                  Desde
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="bg-jet-black/50 border border-white/10 rounded-lg py-2 px-3 text-[11px] text-lavender outline-none focus:border-icy-blue/30 transition-all w-36 custom-scrollbar"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-lavender/40 uppercase tracking-widest ml-1">
                  Hasta
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="bg-jet-black/50 border border-white/10 rounded-lg py-2 px-3 text-[11px] text-lavender outline-none focus:border-icy-blue/30 transition-all w-36"
                />
              </div>

              {(startDate || endDate) && (
                <Button
                  onClick={() => {
                    setStartDate("");
                    setEndDate("");
                  }}
                  className="p-2 bg-white/5 border-none text-red-400 hover:bg-red-500/10 mb-[2px] shadow-none"
                >
                  <RotateCcw size={14} />
                </Button>
              )}
            </div>

            {/* VIEW TOGGLE */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black text-lavender/40 uppercase tracking-widest ml-1">
                VENTAS DE:
              </label>
              <Toggle
                value={view}
                onChange={(val) => {
                  setView(val as any);
                  setCurrentPage(1);
                }}
                options={[
                  { label: "Productos", value: "products" },
                  { label: "Servicios", value: "services" },
                ]}
              />
            </div>
          </div>

          {/* STATUS SELECTORS */}
          <div className="flex flex-wrap gap-3 items-center border-t border-white/5 pt-4">
            <select
              value={paymentStatus}
              onChange={(e) => {
                setPaymentStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-jet-black/50 border border-white/10 rounded-lg py-1.5 px-3 text-[10px] text-lavender outline-none focus:border-icy-blue/30 appearance-none cursor-pointer"
            >
              <option value="">Estado Pago (Todos)</option>
              <option value="1">Pendiente</option>
              <option value="2">Completado</option>
              <option value="3">Cancelado</option>
            </select>
            {view === "services" && (
              <select
                value={serviceStatus}
                onChange={(e) => {
                  setServiceStatus(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-jet-black/50 border border-white/10 rounded-lg py-1.5 px-3 text-[10px] text-lavender outline-none focus:border-icy-blue/30 appearance-none cursor-pointer"
              >
                <option value="">Estado Servicio (Todos)</option>
                <option value="1">Pendiente</option>
                <option value="2">En Progreso</option>
                <option value="3">Completado</option>
              </select>
            )}
          </div>
        </div>

        <Table
          columns={
            view === "products"
              ? [
                  { label: "ID", className: "w-20 text-left pl-6" },
                  { label: "Cliente", className: "w-64 text-left" },
                  { label: "Detalle", className: "w-40 text-left" },
                  { label: "Total", className: "w-40 text-left" },
                  { label: "Método Pago", className: "w-40 text-left" },
                  { label: "Estado Pago", className: "w-40 text-left" },
                  { label: "Fecha", className: "w-48 text-left" },
                  { label: "Acciones", className: "w-32 text-right pr-6" },
                ]
              : [
                  { label: "ID", className: "w-20 text-left pl-6" },
                  { label: "Cliente", className: "w-56 text-left" },
                  { label: "Detalles", className: "w-40 text-left" },
                  { label: "Total $", className: "w-40 text-left" },
                  { label: "Método Pago", className: "w-40 text-left" },
                  { label: "Estado Pago", className: "w-40 text-left" },
                  { label: "Estado Servicio", className: "w-40 text-left" },
                  { label: "Fecha", className: "w-48 text-left" },
                  { label: "Acciones", className: "w-32 text-right pr-6" },
                ]
          }
          isLoading={isLoading}
          isEmpty={!isLoading && currentData.length === 0}
          loadingLabel="Cargando ventas..."
        >
          {currentData.map((sale: Sale) => (
            <tr
              key={sale.sale_id}
              className="group transition-colors hover:bg-white/[0.01]"
            >
              <td className="px-6 py-4 font-mono text-xs text-pale-slate opacity-40 italic">
                #{sale.sale_id}
              </td>
              <td className="px-6 py-4 text-xs font-bold text-lavender uppercase">
                {sale.client_name}
              </td>
              <td className="px-6 py-4 text-[10px] text-pale-slate uppercase italic">
                {view === "products"
                  ? `${sale.products?.length || 0} Prod.`
                  : `${sale.services?.length || 0} Serv.`}
              </td>
              <td className="px-6 py-4 font-mono font-bold text-white text-xs">
                ${" "}
                {parseFloat(sale.sale_total.toString()).toLocaleString("es-AR")}
              </td>
              <td className="px-6 py-4 text-[10px] text-pale-slate uppercase italic">
                {sale.payment_method}
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2.5">
                  {/* Punto con color sólido y glow sutil */}
                  <span
                    className={`w-1.5 h-1.5 rounded-full shadow-[0_0_6px] ${
                      sale.payment_status === "Pagado" ||
                      sale.payment_status === "Completado"
                        ? "bg-green-500 shadow-green-500/50"
                        : sale.payment_status === "Cancelado"
                          ? "bg-red-500 shadow-red-500/50"
                          : "bg-amber-500 shadow-amber-500/50"
                    }`}
                  />
                  <span className="text-[10px] font-black text-lavender/80 uppercase tracking-tight italic">
                    {sale.payment_status}
                  </span>
                </div>
              </td>
              {view === "services" && (
                <td className="px-6 py-4">
                  <span
                    className={`text-[9px] font-black px-2.5 py-0.5 rounded border uppercase tracking-tighter italic transition-all ${
                      sale.service_status === "Completado"
                        ? "border-icy-blue text-icy-blue bg-icy-blue/5"
                        : sale.service_status === "En Progreso"
                          ? "border-blue-500 text-blue-400 bg-blue-500/5"
                          : sale.service_status === "Cancelado"
                            ? "border-red-500 text-red-500 bg-red-500/5"
                            : "border-amber-500/40 text-amber-500 bg-amber-500/5"
                    }`}
                  >
                    {sale.service_status}
                  </span>
                </td>
              )}
              <td className="px-6 py-4 text-[10px] text-pale-slate font-mono uppercase">
                {new Date(sale.created_at).toLocaleString("es-AR", {
                  dateStyle: "short",
                  timeStyle: "short",
                })}
              </td>
              <td className="px-6 py-4 text-right pr-6">
                <div className="flex justify-end gap-1">
                  <ActionButton
                    icon={Eye}
                    label="Ver Detalles"
                    onClick={() => handleViewDetails(sale)}
                    hoverColor="hover:text-white hover:bg-white/5"
                  />

                  <ActionButton
                    icon={DollarSign}
                    label="Gestionar Pago"
                    onClick={() => handlePaymentClick(sale)}
                    disabled={!isPaymentModifiable(sale.payment_status)}
                    hoverColor="hover:text-green-400 hover:bg-green-500/10"
                  />

                  {view === "services" && (
                    <ActionButton
                      icon={Wrench}
                      label="Gestionar servicio"
                      onClick={() => handleServiceStatusClick(sale)}
                      disabled={!isServiceModifiable(sale.service_status || "")}
                      hoverColor="hover:text-icy-blue hover:bg-icy-blue/10"
                    />
                  )}
                </div>
              </td>
            </tr>
          ))}
        </Table>

        <Pagination
          currentPage={currentPage}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* MODALS */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-jet-black/90 backdrop-blur-sm"></div>
          <div className="bg-jet-black border border-white/10 p-8 rounded-xl w-full max-w-3xl relative shadow-2xl animate-in zoom-in-95 duration-200 custom-scrollbar overflow-y-auto max-h-[90vh]">
            <h2 className="text-xl font-bold text-lavender uppercase mb-6 italic tracking-tight">
              Nueva Venta de Productos
            </h2>
            <ProductSaleForm
              onCancel={() => setIsProductModalOpen(false)}
              onSubmit={handleProductSubmit}
            />
          </div>
        </div>
      )}

      {isServiceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Background overlay */}
          <div className="absolute inset-0 bg-jet-black/90 backdrop-blur-sm"></div>

          {/* Modal Content Container */}
          <div className="bg-jet-black border border-white/10 p-8 rounded-xl w-full max-w-3xl relative shadow-2xl animate-in zoom-in-95 duration-200 custom-scrollbar overflow-y-auto max-h-[90vh]">
            <h2 className="text-xl font-bold text-lavender uppercase mb-6 italic tracking-tight">
              Nueva Venta de Servicios
            </h2>

            <ServiceSaleForm
              onCancel={() => setIsServiceModalOpen(false)}
              onSubmit={handleServiceSubmit}
            />
          </div>
        </div>
      )}

      {isDetailsModalOpen && selectedSale && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-jet-black/90 backdrop-blur-sm"></div>
          <div className="bg-jet-black border border-white/10 p-8 rounded-xl w-full max-w-3xl relative shadow-2xl animate-in zoom-in-95 duration-200 custom-scrollbar overflow-y-auto max-h-[90vh]">
            <h2 className="text-xl font-bold text-lavender uppercase mb-6 italic tracking-tight">
              Detalle de Venta #{selectedSale.sale_id}
            </h2>
            <SaleDetailsModal
              sale={selectedSale}
              onClose={() => setIsDetailsModalOpen(false)}
            />
          </div>
        </div>
      )}

      {isPaymentModalOpen && selectedSale && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-jet-black/90 backdrop-blur-sm"></div>
          <div className="bg-jet-black border border-white/10 p-8 rounded-xl w-full max-w-md relative shadow-2xl animate-in zoom-in-95 duration-200">
            <PaymentStatusModal
              sale={selectedSale}
              onClose={() => setIsPaymentModalOpen(false)}
              onUpdate={loadData}
            />
          </div>
        </div>
      )}

      {isServiceStatusModalOpen && selectedSale && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-jet-black/90 backdrop-blur-sm"></div>
          <div className="bg-jet-black border border-white/10 p-8 rounded-xl w-full max-w-md relative shadow-2xl animate-in zoom-in-95 duration-200">
            <ServiceStatusModal
              sale={selectedSale}
              onClose={() => setIsServiceStatusModalOpen(false)}
              onUpdate={loadData}
            />
          </div>
        </div>
      )}
    </div>
  );
};
