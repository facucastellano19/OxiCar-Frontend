interface SyncLoaderProps {
  label?: string;
  isTable?: boolean;
  colSpan?: number;
}

export const SyncLoader = ({
  label = "Cargando...",
  isTable = false,
  colSpan = 1,
}: SyncLoaderProps) => {
  // Content with your project's specific styling
  const LoaderContent = (
    <div className="py-20 flex flex-col items-center justify-center space-y-4">
      {/* Spinning ring for extra visual polish */}
      <div className="w-6 h-6 border-t-2 border-icy-blue rounded-full animate-spin"></div>

      <span className="text-icy-blue animate-pulse font-bold text-[10px] uppercase tracking-[0.3em]">
        {label}
      </span>
    </div>
  );

  if (isTable) {
    return (
      <tr>
        <td colSpan={colSpan} className="text-center">
          {LoaderContent}
        </td>
      </tr>
    );
  }

  return (
    <div className="w-full bg-white/[0.01] border border-white/5 rounded-xl backdrop-blur-sm">
      {LoaderContent}
    </div>
  );
};
