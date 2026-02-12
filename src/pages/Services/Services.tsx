import { useState, useEffect } from "react";
import {
  Search,
  Edit2,
  Trash2,
  Plus,
  Layers,
  RotateCcw,
} from "lucide-react";
import { servicesService } from "../../services/services.service";
import type {
  Service,
  ServiceForm as ServiceFormType,
  ServiceCategory,
} from "../../models/services.model";
import { ServiceForm, CategoriesForm } from "./Components";
import { toast } from "sonner";
import { handleBackendError } from "../../utilities";
import { Button, ConfirmModal, Pagination, Table, Toggle } from "../../components/";

export const Services = () => {
  /* --- MAIN STATES --- */
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [view, setView] = useState<"services" | "categories">("services");
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showInactive, setShowInactive] = useState(false);

  /* --- FORM MODAL STATES --- */
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(null);

  /* --- DELETE MODAL STATES --- */
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<number | null>(null);

  /* --- PAGINATION STATES --- */
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  /* --- DATA FETCHING --- */
  const loadData = async () => {
    try {
      setIsLoading(true);
      const [servicesRes, catsRes] = await Promise.all([
        servicesService.getAll(
          searchTerm,
          showInactive ? "inactive" : "active",
        ),
        servicesService.getCategories(showInactive ? "inactive" : "active"),
      ]);

      const servicesData = Array.isArray(servicesRes) ? servicesRes : (servicesRes?.data || []);
      const categoriesData = Array.isArray(catsRes) ? catsRes : (catsRes?.data || []);

      setServices(Array.isArray(servicesData) ? servicesData : []);
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
    } catch (error) {
      toast.error("Error al sincronizar los datos");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [searchTerm, showInactive, view]);

  /* --- FRONTEND PAGINATION LOGIC --- */
  const dataToPaginate = view === "services" 
    ? services 
    : categories.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const currentData = dataToPaginate.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );
  
  const totalItems = dataToPaginate.length;

  /* --- HANDLERS --- */
  const handleEdit = (service: Service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleEditCategory = (category: ServiceCategory) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleSave = async (data: any) => {
    try {
      if (view === "services") {
        if (selectedService) {
          await servicesService.update(selectedService.id, data);
          toast.success("¡Servicio actualizado!");
        } else {
          await servicesService.create(data);
          toast.success("¡Servicio creado!");
        }
      } else {
        if (selectedCategory) await servicesService.updateCategory(selectedCategory.id, data);
        else await servicesService.createCategory(data);
        toast.success(selectedCategory ? "Categoría actualizada" : "Categoría creada");
      }
      setIsModalOpen(false);
      setSelectedService(null);
      setSelectedCategory(null);
      loadData();
    } catch (e) {
      const msg = handleBackendError(e);
      toast.error(msg);
    }
  };

  const handleRestore = async (id: number) => {
    try {
      if (view === "services") {
        await servicesService.restore(id);
        toast.success("Servicio reactivado correctamente");
      } else {
        await servicesService.restoreCategory(id);
        toast.success("Categoría reactivada correctamente");
      }
      loadData();
    } catch (e) {
      const msg = handleBackendError(e);
      toast.error(msg);
    }
  };

  const openDeleteConfirm = (id: number) => {
    setServiceToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (serviceToDelete === null) return;
    try {
      if (view === "services") {
        await servicesService.delete(serviceToDelete);
        toast.success("Servicio desactivado");
      } else {
        await servicesService.deleteCategory(serviceToDelete);
        toast.success("Categoría desactivada");
      }
      loadData();
    } catch (e) {
      const msg = handleBackendError(e);
      toast.error(msg);
    } finally {
      setIsDeleteModalOpen(false);
      setServiceToDelete(null);
    }
  };

return (
  <div className="space-y-6 animate-in fade-in duration-500">
    {/* --- HEADER --- */}
    <div className="flex justify-between items-end">
      <div>
        <h1 className="text-2xl font-bold text-lavender tracking-tight uppercase italic font-black">
          Gestión de Servicios
        </h1>
        <div className="h-1 w-12 bg-icy-blue mt-1"></div>
      </div>

      <div className="flex justify-end">
          {!showInactive ? (
            <Button
              onClick={() => { setSelectedService(null); setSelectedCategory(null); setIsModalOpen(true); }}
              className="bg-icy-blue text-jet-black px-5 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-white transition-all shadow-lg shadow-icy-blue/10 animate-in fade-in zoom-in duration-300"
            >
              <Plus size={20} /> {view === 'services' ? 'Nuevo servicio' : 'Nueva categoría'}
            </Button>
          ) : (
            <div className="h-[40px]"></div>
          )}
      </div>
    </div>

    {/* --- TABLE CONTAINER --- */}
    <div className="bg-white/[0.02] border border-white/5 rounded-xl overflow-hidden shadow-2xl">
      <div className="p-4 border-b border-white/5 bg-white/[0.01] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-pale-slate" size={16} />
          <input
            type="text"
            placeholder={view === 'services' ? "Buscar servicio..." : "Buscar categoría..."}
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full bg-jet-black/50 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-xs text-lavender outline-none focus:border-icy-blue/30 transition-all"
          />
        </div>

        <div className="flex items-center gap-4">
          {/* VIEW TOGGLE */}
          <Toggle
            value={view}
            onChange={(val) => { setView(val); setCurrentPage(1); }}
            options={[
              { label: "Servicios", value: "services" },
              { label: "Categorías", value: "categories" },
            ]}
          />

          {/* STATUS TOGGLE */}
          <Toggle
            value={showInactive}
            onChange={(val) => { setShowInactive(val); setCurrentPage(1); }}
            options={[
              { label: "Activos", value: false },
              { label: "Inactivos", value: true },
            ]}
          />
        </div>
      </div>

      <Table
        columns={view === 'services' ? [
          { label: "ID", className: "w-16 text-center" },
          { label: "Nombre del Servicio", className: "w-64 text-left" },
          { label: "Categoría", className: "w-56 text-left" },
          { label: "Precio", className: "w-48 text-left" },
          { label: "Acciones", className: "w-32 text-right" },
        ] : [
          { label: "ID", className: "w-16 text-center" },
          { label: "Nombre de Categoría", className: "text-left" },
          { label: "Acciones", className: "w-32 text-right" },
        ]}
        isLoading={isLoading && totalItems === 0}
        isEmpty={!isLoading && totalItems === 0}
        loadingLabel="Sincronizando..."
        emptyLabel={view === 'services' ? "No se encontraron servicios" : "No se encontraron categorías"}
      >
        {view === 'services' 
          ? (currentData as Service[]).map((service) => (
                <tr key={service.id} className="transition-colors group">
                  <td className="px-6 py-4 font-mono text-xs text-pale-slate text-center opacity-40 italic">#{service.id}</td>
                  <td className="px-6 py-4 font-medium text-lavender uppercase tracking-tight">{service.name}</td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-2 text-[10px] font-bold text-icy-blue uppercase bg-icy-blue/5 px-2 py-1 rounded w-fit border border-icy-blue/10">
                      <Layers size={12} /> {service.category_name || service.category || "General"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-left font-mono font-bold text-white text-sm">
                    $ {parseFloat(service.price.toString()).toLocaleString("es-AR")}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-3 opacity-60 group-hover:opacity-100 transition-opacity">
                      {showInactive ? (
                        <div className="tooltip-container group/tip">
                          <Button onClick={() => handleRestore(service.id)} className="p-2 bg-transparent border-none shadow-none text-icy-blue hover:bg-icy-blue/10">
                            <RotateCcw size={16} />
                          </Button>
                          <span className="tooltip-text uppercase">Reactivar</span>
                        </div>
                      ) : (
                        <>
                          <div className="tooltip-container group/tip">
                            <Button onClick={() => handleEdit(service)} className="p-2 bg-transparent border-none shadow-none text-pale-slate hover:text-icy-blue hover:bg-white/5">
                              <Edit2 size={16} />
                            </Button>
                            <span className="tooltip-text uppercase">Editar</span>
                          </div>
                          <div className="tooltip-container group/tip">
                            <Button onClick={() => openDeleteConfirm(service.id)} className="p-2 bg-transparent border-none shadow-none text-pale-slate hover:text-red-500 hover:bg-red-500/10">
                              <Trash2 size={16} />
                            </Button>
                            <span className="tooltip-text uppercase">Desactivar</span>
                          </div>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
            ))
          : (currentData as ServiceCategory[]).map((category) => (
              <tr key={category.id} className="transition-colors group">
                <td className="px-6 py-4 font-mono text-xs text-pale-slate text-center opacity-40 italic">#{category.id}</td>
                <td className="px-6 py-4 font-medium text-lavender uppercase tracking-tight">
                  <span className="flex items-center gap-2">
                    <Layers size={14} className="text-icy-blue" />
                    {category.name}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-3 opacity-60 group-hover:opacity-100 transition-opacity">
                    {showInactive ? (
                      <div className="tooltip-container group/tip">
                        <Button onClick={() => handleRestore(category.id)} className="p-2 bg-transparent border-none shadow-none text-icy-blue hover:bg-icy-blue/10">
                          <RotateCcw size={16} />
                        </Button>
                        <span className="tooltip-text uppercase">Reactivar</span>
                      </div>
                    ) : (
                      <>
                        <div className="tooltip-container group/tip">
                          <Button onClick={() => handleEditCategory(category)} className="p-2 bg-transparent border-none shadow-none text-pale-slate hover:text-icy-blue hover:bg-white/5">
                            <Edit2 size={16} />
                          </Button>
                          <span className="tooltip-text uppercase">Editar</span>
                        </div>
                        <div className="tooltip-container group/tip">
                          <Button onClick={() => openDeleteConfirm(category.id)} className="p-2 bg-transparent border-none shadow-none text-pale-slate hover:text-red-500 hover:bg-red-500/10">
                            <Trash2 size={16} />
                          </Button>
                          <span className="tooltip-text uppercase">Desactivar</span>
                        </div>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))
        }
      </Table>

      {/* --- PAGINATION --- */}
      <Pagination
        className="bg-transparent border-none !rounded-none border-t border-white/5"
        currentPage={currentPage}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
      />
    </div>

    {/* --- MODALS --- */}
    {isModalOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-jet-black/90 backdrop-blur-sm"></div>
        <div className="bg-jet-black border border-white/10 p-8 rounded-xl w-full max-w-2xl relative shadow-2xl animate-in zoom-in-95 duration-200">
          <h2 className="text-xl font-bold text-lavender uppercase mb-6 italic tracking-tight">
            {view === 'services' 
              ? (selectedService ? "Actualizar Servicio" : "Nuevo Servicio")
              : (selectedCategory ? "Actualizar Categoría" : "Nueva Categoría")
            }
          </h2>
          {view === 'services' ? (
            <ServiceForm
              key={selectedService?.id || "new-service"}
              categories={categories}
              initialData={selectedService}
              onSubmit={handleSave}
              onCancel={() => { setIsModalOpen(false); setSelectedService(null); }}
            />
          ) : (
            <CategoriesForm
              key={selectedCategory?.id || "new-category"}
              initialData={selectedCategory}
              onSubmit={handleSave}
              onCancel={() => { setIsModalOpen(false); setSelectedCategory(null); }}
            />
          )}
        </div>
      </div>
    )}

    <ConfirmModal
      isOpen={isDeleteModalOpen}
      title={view === 'services' ? "¿DESACTIVAR SERVICIO?" : "¿DESACTIVAR CATEGORÍA?"}
      message={`Esta acción quitará el elemento del catálogo activo.
        \nLo puedes reactivar en cualquier momento.`}
      onConfirm={confirmDelete}
      onCancel={() => { setIsDeleteModalOpen(false); setServiceToDelete(null); }}
    />
  </div>
);
};
