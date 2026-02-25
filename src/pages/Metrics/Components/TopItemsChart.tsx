import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface TopItemsChartProps {
  title: string;
  data: any[];
  dataKey: string; // 'product' o 'service'
  valueKey: string; // 'quantity'
  color: string; // #f59e0b (naranja) o #B0D7FF (azul)
}

export const TopItemsChart = ({
  title,
  data,
  dataKey,
  valueKey,
  color,
}: TopItemsChartProps) => {
  const topData = [...data]
    .sort((a, b) => Number(b[valueKey]) - Number(a[valueKey]))
    .slice(0, 5)
    .map((item, index) => ({
      ...item,
      fill: color,
      fillOpacity: 1 - index * 0.15,
    }));

  return (
    <div className="bg-white/[0.03] border border-white/10 p-6 rounded-lg backdrop-blur-sm w-full max-w-[500px] h-[400px] mx-auto xl:mx-0">
      {/* Header section */}
      <div className="mb-6">
        <h2 className="text-white text-sm font-black uppercase tracking-[0.2em]">
          Top 5 <span style={{ color }}>{title}</span>
        </h2>
        <p className="text-pale-slate/40 text-[8px] uppercase tracking-widest mt-1">
          Ranking por cantidad de ventas
        </p>
      </div>

      {/* Chart container */}
      <ResponsiveContainer width="100%" height="80%">
        <BarChart
          data={topData}
          margin={{ top: 10, right: 10, left: -25, bottom: 20 }}
          barGap={8}
        >
          {/* Subtle grid lines */}
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.03)"
            vertical={false}
          />

          <XAxis
            dataKey={dataKey}
            stroke="rgba(255,255,255,0.4)"
            fontSize={9}
            tickLine={false}
            axisLine={false}
            interval={0}
            angle={0}
            textAnchor="middle"
            dy={10}
          />

          <YAxis
            stroke="rgba(255,255,255,0.2)"
            fontSize={10}
            tickLine={false}
            axisLine={false}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: "#0f172a",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "8px",
              fontSize: "11px",
            }}
            itemStyle={{ color: "#fff" }}
            cursor={{ fill: "rgba(255,255,255,0.02)" }}
            formatter={(value: any) => [value, "Cantidad"]}
          />

          <Bar dataKey={valueKey} radius={[4, 4, 0, 0]} barSize={35} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
