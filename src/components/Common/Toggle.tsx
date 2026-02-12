export interface ToggleOption<T> {
  label: string;
  value: T;
}

interface ToggleProps<T> {
  options: ToggleOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

export const Toggle = <T extends string | number | boolean>({
  options,
  value,
  onChange,
  className = "",
}: ToggleProps<T>) => {
  return (
    <div className={`flex bg-white/[0.03] border border-white/10 p-1 rounded-lg backdrop-blur-sm ${className}`}>
      {options.map((option) => (
        <button
          key={String(option.value)}
          onClick={() => onChange(option.value)}
          className={`px-4 py-1.5 rounded-md text-[9px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${
            value === option.value
              ? "bg-icy-blue text-jet-black shadow-[0_0_15px_rgba(176,215,255,0.2)]"
              : "text-pale-slate/40 hover:text-pale-slate"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};