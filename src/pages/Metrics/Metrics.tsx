import { useEffect, useState } from "react";
import { metricsService } from "../../services/metrics.service";
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
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div className="flex flex-col">
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold text-lavender tracking-tight uppercase italic font-black leading-none">
                Métricas
              </h1>
              <div className="h-1 w-12 bg-icy-blue mt-2"></div>
            </div>
            <p className="text-pale-slate/40 text-[10px] uppercase tracking-[0.3em] mt-4 font-bold">
              Análisis de ingresos y operaciones
            </p>
          </div>

          <div className="md:self-start pt-1">
            <Toggle
              options={filterOptions}
              value={filter === "custom" ? null : (filter as any)}
              onChange={handleFilterChange} // Updated to clean dates
            />
          </div>
        </div>

        {/* DATE FILTERS SECTION */}
        <div className="flex flex-wrap items-end gap-4 bg-white/[0.02] p-4 rounded-xl border border-white/5 w-fit">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black text-lavender/40 uppercase tracking-widest ml-1">
              Desde
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-jet-black/50 border border-white/10 rounded-lg py-2 px-3 text-[11px] text-lavender outline-none focus:border-icy-blue/30 transition-all w-40"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black text-lavender/40 uppercase tracking-widest ml-1">
              Hasta
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-jet-black/50 border border-white/10 rounded-lg py-2 px-3 text-[11px] text-lavender outline-none focus:border-icy-blue/30 transition-all w-40"
            />
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => fetchMetrics(true)}
              className="p-2.5 bg-icy-blue/10 border border-icy-blue/20 text-icy-blue hover:bg-icy-blue/20 shadow-none"
            >
              <Search size={16} />
            </Button>

            {(startDate || endDate || filter === "custom") && (
              <Button
                onClick={handleReset}
                className="p-2.5 bg-white/5 border border-white/5 text-red-400 hover:bg-red-500/10 shadow-none"
              >
                <RotateCcw size={16} />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* 2. KPI CARDS */}
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

      {/* 3. REVENUES CHART */}
      <div className="w-full bg-white/[0.02] p-1 rounded-xl border border-white/5">
        <MainChart data={metrics.breakdown} />
      </div>

      {/* 4. MID SECTION */}
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

      {/* 5. CLIENTS RANKING */}
      <div className="w-full pt-2">
        <TopClientsTable clients={metrics.top.clients} />
      </div>
    </div>
  );
};
