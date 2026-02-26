import { useEffect, useState } from "react";
import { homeService } from "../../services/home.service";
import { type HomeDashboardResponse } from "../../models/home.model";
import { KPICard } from "../Metrics/Components/KPICard";
import { SyncLoader } from "../../components";
import { toast } from "sonner";
import { DollarSign, CheckCircle2, Clock } from "lucide-react"; // Updated icons
import { RecentServices } from "./Components/RecentServices";
import { RecentProducts } from "./Components/RecentProducts";

export const Home = () => {
  const [data, setData] = useState<HomeDashboardResponse | null>(null);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const response = await homeService.getHomeDashboard();
        setData(response);
      } catch (error) {
        toast.error("Error al sincronizar el dashboard");
        console.error(error);
      }
    };
    fetchHomeData();
  }, []);

  if (!data) {
    return (
      <div className="p-6">
        <SyncLoader label="Cargando operaciones recientes..." />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 animate-fade-in max-w-[1600px] mx-auto">
      {/* 1. HEADER */}
      <div className="flex flex-col">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-lavender tracking-tight uppercase italic font-black leading-none">
            Resumen
          </h1>
          <div className="h-1 w-12 bg-icy-blue mt-2"></div>
        </div>
        <p className="text-pale-slate/40 text-[10px] uppercase tracking-[0.3em] mt-4 font-bold">
          Estado actual del taller - Últimos 7 días
        </p>
      </div>

      {/* 2. SUMMARY KPIs WITH NEW ICONS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KPICard
          title="Ventas activas"
          value={data.summary.totalSales}
          icon={<DollarSign size={20} className="text-icy-blue" />}
        />
        <KPICard
          title="Pagos Confirmados"
          value={data.summary.confirmedPayments}
          icon={<CheckCircle2 size={20} className="text-emerald-500" />}
        />
        <KPICard
          title="Pagos Pendientes"
          value={data.summary.pendingPayments}
          icon={<Clock size={20} className="text-amber-500" />}
        />
      </div>

      {/* 3. RECENT ACTIVITY GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <RecentServices services={data.recentActivity.services} />
        <RecentProducts products={data.recentActivity.products} />
      </div>
    </div>
  );
};
