import { useEffect, useState } from "react";
import { metricsService } from "../../services/metrics.service";
import { type DashboardMetricsResponse } from "../../models";
import { SyncLoader, Toggle, type ToggleOption } from "../../components";
import { toast } from "sonner";

import {
  KPICard,
  MainChart,
  TopItemsChart,
  PaymentMethodsChart,
  TopClientsTable,
} from "./Components";

type TimeFilter = "weekly" | "monthly" | "yearly";

export const Metrics = () => {
  const [metrics, setMetrics] = useState<DashboardMetricsResponse | null>(null);
  const [filter, setFilter] = useState<TimeFilter>("weekly");

  const filterOptions: ToggleOption<TimeFilter>[] = [
    { label: "Semanal", value: "weekly" },
    { label: "Mensual", value: "monthly" },
    { label: "Anual", value: "yearly" },
  ];

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const data = await metricsService.getDashboardMetrics({ filter });
        setMetrics(data);
      } catch (error) {
        setMetrics(null);
        toast.error("No se pudieron cargar las métricas");
        console.error("Metrics synchronization failed:", error);
      }
    };
    fetchMetrics();
  }, [filter]);

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
          {/* Contenedor para alinear título con el toggle */}
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
          {/* El pt-1 es para compensar visualmente la altura del texto del H1 */}
          <Toggle
            options={filterOptions}
            value={filter}
            onChange={(val) => setFilter(val)}
          />
        </div>
      </div>

      {/* 2. KPI CARDS - Flash Info */}
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

      {/* 4. MID SECTION RANKING PRODUCTS, SERVICES AND PAYMENTMETHODS */}
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
