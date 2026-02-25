import { PieChart, Pie, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface PaymentMethodsChartProps {
  data: any[];
}
const COLORS = ["#B0D7FF", "#f59e0b", "#10b981", "#475569"];

export const PaymentMethodsChart = ({ data }: PaymentMethodsChartProps) => {
  const chartData = data
    .filter((item) => Number(item.total) > 0)
    .map((item, index) => ({
      name: item.method,
      value: Number(item.total),
      fill: COLORS[index % COLORS.length],
    }));

  return (
    <div className="bg-white/[0.03] border border-white/10 p-6 rounded-lg backdrop-blur-sm w-full max-w-[500px] h-[400px] mx-auto xl:mx-0">
      {/* Header section */}
      <div className="mb-2">
        <h2 className="text-white text-sm font-black uppercase tracking-[0.2em]">
          Métodos de <span className="text-icy-blue">Pago</span>
        </h2>
        <p className="text-pale-slate/40 text-[8px] uppercase tracking-widest mt-1">
          Distribución porcentual de ingresos
        </p>
      </div>

      {/* Chart container */}
      <ResponsiveContainer width="100%" height="90%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="45%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
            stroke="none"
          />

          <Tooltip
            contentStyle={{
              backgroundColor: "#0f172a",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "8px",
              fontSize: "11px",
            }}
            itemStyle={{ color: "#fff" }}
            formatter={(value: any) => {
              if (value === undefined || value === null) return ["$0", "Monto"];
              return [`$${Number(value).toLocaleString()}`, "Monto"];
            }}
          />

          <Legend
            verticalAlign="bottom"
            align="center"
            iconType="circle"
            wrapperStyle={{
              fontSize: "10px",
              textTransform: "uppercase",
              letterSpacing: "1px",
              paddingTop: "20px",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
