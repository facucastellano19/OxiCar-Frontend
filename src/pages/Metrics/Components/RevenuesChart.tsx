import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface MainChartProps {
  data: any[];
}

export const MainChart = ({ data }: MainChartProps) => {
  return (
    <div className="bg-white/[0.03] border border-white/10 p-6 rounded-lg backdrop-blur-sm w-full h-[450px]">
      {/* Header Section */}
      <div className="mb-6">
        <h2 className="text-white text-lg font-black uppercase tracking-[0.2em]">
          Comparativa de <span className="text-icy-blue">Ingresos</span>
        </h2>
        <p className="text-pale-slate/40 text-[9px] font-bold uppercase tracking-widest mt-1">
          Distribución mensual: Servicios vs Productos
        </p>
      </div>

      {/* Chart Container */}
      <ResponsiveContainer width="100%" height="85%">
        <AreaChart
          data={data}
          margin={{ top: 20, right: 30, left: 10, bottom: 5 }}
        >
          {/* Gradients for clear visual depth */}
          <defs>
            {/* Blue Gradient - Services */}
            <linearGradient id="colorServices" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#B0D7FF" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#B0D7FF" stopOpacity={0} />
            </linearGradient>
            {/* Orange Gradient - Products */}
            <linearGradient id="colorProducts" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
            </linearGradient>
          </defs>

          {/* Minimalist Grid */}
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.03)"
            vertical={false}
          />

          <XAxis
            dataKey="breakdown_key"
            stroke="rgba(255,255,255,0.2)"
            fontSize={10}
            tickLine={false}
            axisLine={false}
            dy={10}
          />

          <YAxis
            stroke="rgba(255,255,255,0.2)"
            fontSize={10}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value.toLocaleString()}`}
          />

          {/* Dark themed Tooltip */}
          <Tooltip
            contentStyle={{
              backgroundColor: "#0f172a",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "12px",
              fontSize: "12px",
              color: "#fff",
            }}
            itemStyle={{ color: "#fff" }}
          />

          <Legend
            verticalAlign="top"
            align="right"
            iconType="circle"
            wrapperStyle={{
              paddingBottom: "20px",
              fontSize: "10px",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          />

          {/* Service Revenue Area (Icy Blue) */}
          <Area
            name="Ingresos por Servicios"
            type="monotone"
            dataKey="service_revenue"
            stroke="#B0D7FF"
            strokeWidth={4}
            fillOpacity={1}
            fill="url(#colorServices)"
          />

          {/* Product Revenue Area (Amber/Orange) */}
          <Area
            name="Ingresos por Productos"
            type="monotone"
            dataKey="product_revenue"
            stroke="#f59e0b"
            strokeWidth={4}
            fillOpacity={1}
            fill="url(#colorProducts)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
