import { useState, Fragment, useEffect } from "react";
import {
  Search,
  Edit2,
  Trash2,
  UserPlus,
  History,
  Car,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { ClientForm } from "./Components/ClientForm";
import type {
  Client,
  ClientForm as ClientFormType,
} from "../../models/clients.model";
import { clientsService } from "../../services/clients.service";
import { handleBackendError } from "../../utilities";

const Clients = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedClientId, setExpandedClientId] = useState<number | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadClients = async () => {
    try {
      setIsLoading(true);
      const response = await clientsService.getAll();
      const actualClients = response.data;
      setClients(Array.isArray(actualClients) ? actualClients : []);
    } catch (error) {
      console.error("Error fetching clients", error);
      setClients([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  const handleCreateClient = async (data: ClientFormType) => {
    try {
      await clientsService.create(data);
      await loadClients();
      setIsModalOpen(false);
      alert("¡Cliente registrado con éxito!");
    } catch (error: any) {
      const errorMessage = handleBackendError(error);
      alert(errorMessage);
      console.error("Error original del backend:", error.response?.data);
    }
  };
  const toggleExpand = (id: number) => {
    setExpandedClientId(expandedClientId === id ? null : id);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* HEADER */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-lavender tracking-tight uppercase italic font-black">
            Gestión de Clientes
          </h1>
          <div className="h-1 w-12 bg-icy-blue mt-1"></div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-icy-blue text-jet-black px-5 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-white transition-all shadow-lg shadow-icy-blue/10"
        >
          <UserPlus size={16} />
          Nuevo Cliente
        </button>
      </div>

      {/* TABLE CONTAINER */}
      <div className="bg-white/[0.02] border border-white/5 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-white/5 bg-white/[0.01]">
          <div className="relative w-full md:w-80">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-pale-slate"
              size={16}
            />
            <input
              type="text"
              placeholder="Buscar por nombre, patente o teléfono..."
              className="w-full bg-jet-black/50 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-xs text-lavender outline-none focus:border-icy-blue/30 transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-white/[0.02] text-[10px] uppercase tracking-[0.15em] text-pale-slate font-bold">
                <th className="px-6 py-4 border-b border-white/5 w-16 text-center">
                  ID
                </th>
                <th className="px-6 py-4 border-b border-white/5">Cliente</th>
                <th className="px-6 py-4 border-b border-white/5">Contacto</th>
                <th className="px-6 py-4 border-b border-white/5">Vehículos</th>
                <th className="px-6 py-4 border-b border-white/5 text-right">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.02]">
              {isLoading && clients.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="py-20 text-center text-icy-blue animate-pulse font-bold uppercase text-xs"
                  >
                    Cargando clientes...
                  </td>
                </tr>
              ) : clients.length > 0 ? (
                clients.map((client) => (
                  <Fragment key={client.id}>
                    <tr className="hover:bg-white/[0.03] transition-colors group">
                      <td className="px-6 py-4 font-mono text-xs text-pale-slate text-center">
                        #{client.id}
                      </td>
                      <td className="px-6 py-4 font-medium text-lavender uppercase">
                        {client.first_name} {client.last_name}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-lavender/60 text-xs">
                            {client.email || "Sin email"}
                          </span>
                          <span className="text-pale-slate text-[11px] font-mono">
                            {client.phone}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {client.vehicles && client.vehicles.length > 0 ? (
                          <button
                            onClick={() => toggleExpand(client.id)}
                            className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1 rounded-md text-[10px] font-bold text-pale-slate hover:border-icy-blue/30 hover:text-icy-blue transition-all"
                          >
                            <Car size={12} />
                            {client.vehicles.length}{" "}
                            {client.vehicles.length === 1
                              ? "VEHÍCULO"
                              : "VEHÍCULOS"}
                            {expandedClientId === client.id ? (
                              <ChevronUp size={12} />
                            ) : (
                              <ChevronDown size={12} />
                            )}
                          </button>
                        ) : (
                          <span className="text-pale-slate/30 text-[10px] italic uppercase">
                            Sin vehículos
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                          <button className="p-2 hover:bg-white/5 rounded-md text-pale-slate hover:text-lavender">
                            <History size={16} />
                          </button>
                          <button className="p-2 hover:bg-white/5 rounded-md text-pale-slate hover:text-icy-blue">
                            <Edit2 size={16} />
                          </button>
                          <button className="p-2 hover:bg-white/5 rounded-md text-red-400/50 hover:text-red-400">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {expandedClientId === client.id && (
                      <tr className="bg-icy-blue/[0.02] animate-in slide-in-from-top-1 duration-200">
                        <td
                          colSpan={5}
                          className="px-16 py-4 border-l-2 border-icy-blue/30"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {client.vehicles.map((v, i) => (
                              <div
                                key={i}
                                className="bg-jet-black/50 border border-white/10 p-3 rounded-lg flex justify-between items-center"
                              >
                                <div>
                                  <p className="text-[10px] font-bold text-icy-blue uppercase">
                                    {v.brand} {v.model}
                                  </p>
                                  <p className="text-lavender font-mono text-sm tracking-wider">
                                    {v.license_plate}
                                  </p>
                                  <p className="text-pale-slate text-[10px] uppercase mt-1">
                                    {v.color} • {v.year}
                                  </p>
                                </div>
                                <Car size={24} className="text-white/5" />
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="py-20 text-center text-pale-slate/30 italic text-xs uppercase tracking-[0.2em]"
                  >
                    No se encontraron clientes registrados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-jet-black/90 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          ></div>
          <div className="bg-jet-black border border-white/10 p-8 rounded-xl w-full max-w-2xl relative shadow-2xl animate-in zoom-in-95 duration-200 overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-bold text-lavender italic uppercase tracking-tight">
                  Registro de Cliente
                </h2>
                <div className="h-1 w-8 bg-icy-blue mt-1"></div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-pale-slate hover:text-white"
              >
                ✕
              </button>
            </div>
            <ClientForm
              onSubmit={handleCreateClient}
              onCancel={() => setIsModalOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Clients;
