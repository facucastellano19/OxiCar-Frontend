import { useEffect, useState } from "react";
import { metricsService } from "../../services/metrics.service";
import { type DashboardMetricsResponse } from "../../models";
import { KPICard } from "./Components/KPICard";
import { Toggle, type ToggleOption } from "../../components";
import { MainChart } from "./Components/RevenuesChart";
import { toast } from "sonner";

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
  if (!metrics) return null;

  return (
    <div className="p-6 space-y-8 animate-fade-in">
      {/* Header and Toggle */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-white text-2xl font-bold tracking-tighter uppercase">
            Performance <span className="text-icy-blue">Dashboard</span>
          </h1>
          <p className="text-pale-slate/40 text-[10px] uppercase tracking-widest mt-1">
            Análisis de ingresos y operaciones
          </p>
        </div>

        <Toggle
          options={filterOptions}
          value={filter}
          onChange={(val) => setFilter(val)}
        />
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Ingresos por servicios"
          value={`$${metrics.general.totalServiceRevenue}`}
          data={metrics.breakdown}
          dataKey="service_revenue"
        />
        <KPICard
          title="Ingresos por productos"
          value={`$${metrics.general.totalProductRevenue}`}
          data={metrics.breakdown}
          dataKey="product_revenue"
        />
        <KPICard
          title="Ingresos TOTALES"
          value={`$${metrics.general.totalRevenue}`}
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

      {/* Main Performance Chart */}
      <div className="w-full">
        <MainChart data={metrics.breakdown} />
      </div>
    </div>
  );
};
