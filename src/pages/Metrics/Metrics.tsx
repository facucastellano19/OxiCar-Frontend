import { useEffect, useState } from "react";
import { metricsService } from "../../services/";
import { type DashboardMetricsResponse } from "../../models";
import {
  SyncLoader,
  Toggle,
  type ToggleOption,
  Button,
} from "../../components";
import { toast } from "sonner";
import { RotateCcw, Search } from "lucide-react";

import {
  KPICard,
  MainChart,
  TopItemsChart,
  PaymentMethodsChart,
  TopClientsTable,
} from "./Components";

type TimeFilter = "weekly" | "monthly" | "yearly" | "custom";

export const Metrics = () => {
  const [metrics, setMetrics] = useState<DashboardMetricsResponse | null>(null);
  const [filter, setFilter] = useState<TimeFilter>("weekly");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const filterOptions: ToggleOption<Exclude<TimeFilter, "custom">>[] = [
    { label: "Semanal", value: "weekly" },
    { label: "Mensual", value: "monthly" },
    { label: "Anual", value: "yearly" },
  ];

  const fetchMetrics = async (isCustom = false) => {
    if (isCustom && (!startDate || !endDate)) {
      toast.error("Debes ingresar ambos rangos (Desde y Hasta)");
      return;
    }

    try {
      const params = isCustom
        ? { startDate, endDate }
        : { filter: filter !== "custom" ? filter : "weekly" };

      const data = await metricsService.getDashboardMetrics(params);
      setMetrics(data);

      if (isCustom) setFilter("custom");
    } catch (error) {
      setMetrics(null);
      toast.error("No se pudieron cargar las métricas");
      console.error("Metrics synchronization failed:", error);
    }
  };

  useEffect(() => {
    if (filter !== "custom") {
      fetchMetrics();
    }
  }, [filter]);

  // Clean dates when switching back to predefined filters
  const handleFilterChange = (val: Exclude<TimeFilter, "custom">) => {
    setStartDate("");
    setEndDate("");
    setFilter(val);
  };

  const handleReset = () => {
    setStartDate("");
    setEndDate("");
    setFilter("weekly");
  };

  if (!metrics) {
    return (
      <div className="p-6">
        <SyncLoader label="Cargando métricas del sistema..." />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 animate-fade-in max-w-[1600px] mx-auto">
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div className="flex flex-col">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-lavender tracking-tight uppercase italic font-black leading-none">
              Métricas
            </h1>
            <div className="h-1 w-12 bg-icy-blue mt-2"></div>
          </div>
        </div>
      </div>

      {/* 2. FILTER TOOLBAR  */}
      <div className="flex flex-wrap items-center gap-6 pb-2 border-b border-white/5">
        {/* FAST FILTERS (LEFT) */}
        <div className="flex flex-col gap-2">
          <label className="text-[9px] font-black text-lavender/30 uppercase tracking-[0.2em] ml-1">
            Filtros Rápidos
          </label>
          <Toggle
            options={filterOptions}
            value={filter === "custom" ? null : (filter as any)}
            onChange={handleFilterChange}
          />
        </div>

        {/* CUSTOM DATE RANGE (RIGHT) */}
        <div className="flex flex-col gap-2">
          <label className="text-[9px] font-black text-lavender/30 uppercase tracking-[0.2em] ml-1">
            Rango Personalizado
          </label>
          <div className="flex items-center gap-3 bg-white/[0.02] border border-white/10 rounded-xl px-4 h-[42px]">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-transparent text-[11px] font-bold text-lavender uppercase outline-none focus:text-icy-blue transition-all w-32"
            />
            <span className="text-white/10 font-black text-xs">/</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-transparent text-[11px] font-bold text-lavender uppercase outline-none focus:text-icy-blue transition-all w-32"
            />
            <button
              onClick={() => fetchMetrics(true)}
              className={`ml-2 p-1.5 rounded-lg transition-all ${
                startDate && endDate
                  ? "text-icy-blue hover:bg-icy-blue/10"
                  : "text-white/10 cursor-not-allowed"
              }`}
            >
              <Search size={16} />
            </button>
          </div>
        </div>

        {/* RESET BUTTON */}
        {(startDate || endDate || filter === "custom") && (
          <div className="flex flex-col gap-2 self-end">
            <Button
              onClick={handleReset}
              className="h-[42px] px-4 bg-red-500/5 border border-red-500/10 text-red-400 hover:bg-red-500/10 shadow-none rounded-xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"
            >
              <RotateCcw size={14} />
            </Button>
          </div>
        )}
      </div>

      {/* 3. KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Ingresos por servicios"
          value={`$${Number(metrics.general.totalServiceRevenue).toLocaleString()}`}
          data={metrics.breakdown}
          dataKey="service_revenue"
        />
        <KPICard
          title="Ingresos por productos"
          value={`$${Number(metrics.general.totalProductRevenue).toLocaleString()}`}
          data={metrics.breakdown}
          dataKey="product_revenue"
        />
        <KPICard
          title="Ingresos TOTALES"
          value={`$${Number(metrics.general.totalRevenue).toLocaleString()}`}
          data={metrics.breakdown}
          dataKey="service_revenue"
        />
        <KPICard
          title="Clientes atendidos"
          value={metrics.general.totalClientsAttended}
          data={metrics.breakdown}
          dataKey="service_count"
        />
      </div>

      {/* 4. REVENUES CHART */}
      <div className="w-full bg-white/[0.02] p-1 rounded-xl border border-white/5">
        <MainChart data={metrics.breakdown} />
      </div>

      {/* 5. MID SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-start">
        <TopItemsChart
          title="Productos"
          data={metrics.top.products}
          dataKey="product"
          valueKey="quantity"
          color="#f59e0b"
        />
        <TopItemsChart
          title="Servicios"
          data={metrics.top.services}
          dataKey="service"
          valueKey="quantity"
          color="#B0D7FF"
        />
        <PaymentMethodsChart data={metrics.paymentMethods} />
      </div>

      {/* 6. CLIENTS RANKING */}
      <div className="w-full pt-2">
        <TopClientsTable clients={metrics.top.clients} />
      </div>
    </div>
  );
};
