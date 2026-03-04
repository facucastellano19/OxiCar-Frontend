import { useState, Fragment, useEffect } from "react";
import {
  Search,
  Edit2,
  UserPlus,
  History,
  Car,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import type {
  Client,
  ClientForm as ClientFormType,
} from "../../models/clients.model";
import { clientsService } from "../../services/clients.service";
import { handleBackendError } from "../../utilities";
import { toast } from "sonner";
import { ClientForm, PurchaseHistoryModal } from "./Components";
import { Button, Table, Pagination, ActionButton } from "../../components";

export const Clients = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [expandedClientId, setExpandedClientId] = useState<number | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [clients, setClients] = useState<Client[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");

  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [historyData, setHistoryData] = useState<any>(null);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const clientsPerPage = 10;

  const loadClients = async (search?: string) => {
    try {
      setIsLoading(true);
      const response = await clientsService.getAll(search);
      const actualClients = response.data;
      setClients(Array.isArray(actualClients) ? actualClients : []);
    } catch (error) {
      toast.error("No se pudieron cargar los clientes");
      setClients([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadClients(searchTerm);
  }, [searchTerm]);

  const handleEditClick = (client: Client) => {
    setSelectedClient(client);
    setIsModalOpen(true);
  };

  const handleSaveClient = async (data: ClientFormType) => {
    try {
      if (selectedClient) {
        await clientsService.update(selectedClient.id, data);
        toast.success("¡Cliente actualizado con éxito!");
      } else {
        await clientsService.create(data);
        toast.success("¡Cliente registrado con éxito!");
      }

      await loadClients();
      setIsModalOpen(false);
      setSelectedClient(null);
    } catch (error: any) {
      const errorMessage = handleBackendError(error);
      toast.error(errorMessage);
    }
  };

  const handleViewHistory = async (client: Client) => {
    try {
      setSelectedClient(client);
      setIsHistoryModalOpen(true);
      setLoadingHistory(true);

      const data = await clientsService.getPurchaseHistory(client.id);
      setHistoryData(data);
    } catch (error) {
      toast.error("Error al obtener el historial de compras");
      setIsHistoryModalOpen(false);
    } finally {
      setLoadingHistory(false);
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedClientId(expandedClientId === id ? null : id);
  };

  const indexOfLastClient = currentPage * clientsPerPage;
  const indexOfFirstClient = indexOfLastClient - clientsPerPage;
  const currentClients = clients.slice(indexOfFirstClient, indexOfLastClient);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

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

        <Button
          onClick={() => {
            setSelectedClient(null);
            setIsModalOpen(true);
          }}
          className="bg-icy-blue text-jet-black px-5 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-white transition-all shadow-lg shadow-icy-blue/10 animate-in fade-in zoom-in duration-300"
        >
          <UserPlus size={20} />
          Nuevo Cliente
        </Button>
      </div>

      <div className="bg-white/[0.02] border border-white/5 rounded-xl shadow-2xl">
        {/* SEARCH BAR */}
        <div className="p-4 border-b border-white/5 bg-white/[0.01]">
          <div className="relative w-full md:w-80">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-pale-slate"
              size={16}
            />
            <input
              type="text"
              placeholder="Buscar por nombre, patente o teléfono..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-jet-black/50 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-xs text-lavender outline-none focus:border-icy-blue/30 transition-all"
            />
          </div>
        </div>

        <Table
          columns={[
            { label: "ID", className: "w-16 text-center" },
            { label: "Cliente", className: "text-left" },
            { label: "Contacto", className: "text-left" },
            { label: "Vehículos", className: "text-left" },
            { label: "Acciones", className: "w-32 text-right" },
          ]}
          isLoading={isLoading && clients.length === 0}
          isEmpty={!isLoading && clients.length === 0}
          loadingLabel="Cargando clientes..."
          emptyLabel="No se encontraron clientes"
        >
          {currentClients.map((client) => (
            <Fragment key={client.id}>
              <tr className="transition-colors group">
                <td className="px-6 py-4 font-mono text-xs text-pale-slate text-center italic">
                  #{client.id}
                </td>
                <td className="px-6 py-4 font-medium text-lavender uppercase tracking-tight">
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
                      {client.vehicles.length === 1 ? "VEHÍCULO" : "VEHÍCULOS"}
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
                  <div className="flex justify-end gap-3 opacity-60 group-hover:opacity-100 transition-opacity">
                    <div className="tooltip-container group/tip">
                      <ActionButton
                        icon={History}
                        label="Ver Historial"
                        onClick={() => handleViewHistory(client)}
                      />
                    </div>
                    <div className="tooltip-container group/tip">
                      <ActionButton
                        icon={Edit2}
                        label="Editar Cliente"
                        onClick={() => handleEditClick(client)}
                      />
                    </div>
                  </div>
                </td>
              </tr>
              {expandedClientId === client.id && (
                <tr className="bg-icy-blue/[0.02] hover:bg-icy-blue/[0.02] animate-in slide-in-from-top-1 duration-200">
                  <td
                    colSpan={5}
                    className="px-16 py-4 border-l-2 border-icy-blue/30"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {client.vehicles.map((v, i) => (
                        <div
                          key={i}
                          className="bg-jet-black/50 border border-white/10 p-3 rounded-lg flex justify-between items-center shadow-inner"
                        >
                          <div>
                            <p className="text-[10px] font-bold text-icy-blue uppercase">
                              {v.brand} {v.model}
                            </p>
                            <p className="text-lavender font-mono text-sm tracking-wider">
                              {v.license_plate}
                            </p>
                            <p className="text-pale-slate text-[10px] uppercase mt-1 opacity-50">
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
          ))}
        </Table>

        <Pagination
          className="bg-transparent border-none !rounded-none border-t border-white/5"
          currentPage={currentPage}
          totalItems={clients.length}
          itemsPerPage={clientsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-jet-black/90 backdrop-blur-sm"
            onClick={() => {
              setSelectedClient(null);
            }}
          ></div>

          <div className="bg-jet-black border border-white/10 p-8 rounded-xl w-full max-w-2xl relative">
            <h2 className="text-xl font-bold text-lavender uppercase mb-6">
              {selectedClient ? "Editar Cliente" : "Nuevo Cliente"}
            </h2>

            <ClientForm
              initialData={selectedClient || undefined}
              onSubmit={handleSaveClient}
              onCancel={() => {
                setIsModalOpen(false);
                setSelectedClient(null);
              }}
            />
          </div>
        </div>
      )}

      {/* PURCHASE HISTORY MODAL */}
      {isHistoryModalOpen && (
        <PurchaseHistoryModal
          history={historyData}
          clientName={`${selectedClient?.first_name} ${selectedClient?.last_name}`}
          isLoading={loadingHistory}
          onClose={() => {
            setIsHistoryModalOpen(false);
            setHistoryData(null);
            setSelectedClient(null);
          }}
        />
      )}
    </div>
  );
};
