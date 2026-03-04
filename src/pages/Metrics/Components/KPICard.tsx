import { ResponsiveContainer, AreaChart, Area } from "recharts";

interface KPICardProps {
  title: string;
  value: string | number;
  data?: any[];
  dataKey?: string;
  icon?: React.ReactNode;
}

export const KPICard = ({
  title,
  value,
  data,
  dataKey,
  icon,
}: KPICardProps) => {
  const hasChart = data && dataKey;

  return (
    <div className="bg-white/[0.03] border border-white/10 p-5 rounded-xl backdrop-blur-sm shadow-xl flex flex-col h-36 transition-all hover:bg-white/[0.05]">
      {/* Top Section */}
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <p className="text-pale-slate/40 text-[10px] font-black uppercase tracking-[0.2em]">
            {title}
          </p>
          <h3
            className={`text-white font-bold tracking-tight ${hasChart ? "text-2xl" : "text-3xl"}`}
          >
            {value}
          </h3>
        </div>

        {icon && (
          <div
            className={`p-2 rounded-lg ${hasChart ? "bg-transparent opacity-40" : "bg-white/5 opacity-80 border border-white/5"}`}
          >
            {icon}
          </div>
        )}
      </div>

      {/* Bottom Section: Chart or Spacer */}
      <div className="mt-auto w-full">
        {hasChart ? (
          <div className="h-12 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <Area
                  type="monotone"
                  dataKey={dataKey}
                  stroke="#B0D7FF"
                  fillOpacity={1}
                  fill="rgba(176, 215, 255, 0.05)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-[2px] w-8 bg-icy-blue/30 rounded-full" />
        )}
      </div>
    </div>
  );
};
