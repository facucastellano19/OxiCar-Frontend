import { ResponsiveContainer, AreaChart, Area } from "recharts";

interface KPICardProps {
  title: string;
  value: string | number;
  data: any[];
  dataKey: string;
}

export const KPICard = ({ title, value, data, dataKey }: KPICardProps) => {
  return (
    <div className="bg-white/[0.03] border border-white/10 p-5 rounded-xl backdrop-blur-sm shadow-xl flex flex-col justify-between h-36">
      <div>
        <p className="text-pale-slate/60 text-[10px] font-black uppercase tracking-[0.2em]">
          {title}
        </p>
        <h3 className="text-white text-2xl font-bold mt-1 tracking-tight">
          {value}
        </h3>
      </div>

      <div className="h-10 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <Area
              type="monotone"
              dataKey={dataKey}
              stroke="#B0D7FF"
              fillOpacity={1}
              fill="rgba(176, 215, 255, 0.05)"
              strokeWidth={1.5}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
