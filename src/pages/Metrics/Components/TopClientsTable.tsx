import { Table, type TableColumn } from "../../../components";

interface TopClientsTableProps {
  clients: any[];
}

export const TopClientsTable = ({ clients }: TopClientsTableProps) => {
  /* Configuration for the ranking columns */
  const columns: TableColumn[] = [
    { label: "Posición", className: "w-20" },
    { label: "Cliente" },
    { label: "Total Facturado", className: "text-right" },
  ];

  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-xl overflow-hidden backdrop-blur-md">
      {/* Header of the ranking section */}
      <div className="p-6 border-b border-white/5 bg-white/[0.01]">
        <h2 className="text-white text-sm font-black uppercase tracking-[0.2em]">
          Mejores <span className="text-icy-blue">Clientes</span>
        </h2>
        <p className="text-pale-slate/40 text-[8px] uppercase tracking-widest mt-1">
          Ranking por volumen de facturación histórica
        </p>
      </div>

      <Table
        columns={columns}
        isEmpty={clients.length === 0}
        loadingLabel="Sincronizando ranking..."
      >
        {clients.map((item, index) => (
          <tr
            key={index}
            className="group hover:bg-white/[0.02] transition-all"
          >
            {/* Position indicator */}
            <td className="px-6 py-4">
              <span className="text-pale-slate/20 font-black text-xs italic group-hover:text-icy-blue/40 transition-colors">
                {String(index + 1).padStart(2, "0")}
              </span>
            </td>

            {/* Client Name */}
            <td className="px-6 py-4">
              <div className="flex flex-col">
                <span className="text-white font-bold text-xs uppercase tracking-widest">
                  {item.client}
                </span>
                <span className="text-[8px] text-pale-slate/30 uppercase font-medium">
                  Cliente Premium
                </span>
              </div>
            </td>

            {/* Total Spent */}
            <td className="px-6 py-4 text-right">
              <div className="flex flex-col items-end">
                <span className="text-icy-blue font-black text-xs">
                  ${Number(item.total).toLocaleString()}
                </span>
                <div className="h-1 w-16 bg-white/5 rounded-full mt-1 overflow-hidden">
                  {/* Visual progress bar relative to the top client */}
                  <div
                    className="h-full bg-icy-blue opacity-50"
                    style={{
                      width: `${(Number(item.total) / Number(clients[0].total)) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            </td>
          </tr>
        ))}
      </Table>
    </div>
  );
};
