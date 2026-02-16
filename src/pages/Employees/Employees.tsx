import { useState, useEffect } from "react";
import { Search, Edit2, Trash2, Plus, RotateCcw, User } from "lucide-react";
import { employeesService } from "../../services/employees.service";
import type { Employee, EmployeeForm as EmployeeFormType } from "../../models/employees.model";
import { EmployeeForm } from "./Components/EmployeeForm";
import { toast } from "sonner";
import { handleBackendError } from "../../utilities";
import { Button, ConfirmModal, Pagination, Table, Toggle } from "../../components/";

export const Employees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showInactive, setShowInactive] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<number | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const loadData = async () => {
    try {
      setIsLoading(true);
      const response = await employeesService.getAll(searchTerm, showInactive ? "inactive" : "active");
      
      const employeesData = Array.isArray(response) ? response : (response?.data || []);
      setEmployees(Array.isArray(employeesData) ? employeesData : []);
    } catch (error) {
      toast.error("Error al sincronizar los datos");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [searchTerm, showInactive]);

  const currentData = employees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );
  
  const totalItems = employees.length;

  const handleEdit = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const handleSave = async (data: EmployeeFormType) => {
    try {
      if (selectedEmployee) {
        await employeesService.update(selectedEmployee.id, data);
        toast.success("¡Empleado actualizado!");
      } else {
        await employeesService.create(data);
        toast.success("¡Empleado creado!");
      }
      setIsModalOpen(false);
      setSelectedEmployee(null);
      loadData();
    } catch (e) {
      const msg = handleBackendError(e);
      toast.error(msg);
    }
  };

  const handleRestore = async (id: number) => {
    try {
      await employeesService.restore(id);
      toast.success("Empleado reactivado correctamente");
      loadData();
    } catch (e) {
      const msg = handleBackendError(e);
      toast.error(msg);
    }
  };

  const openDeleteConfirm = (id: number) => {
    setEmployeeToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (employeeToDelete === null) return;
    try {
      await employeesService.delete(employeeToDelete);
      toast.success("Empleado desactivado");
      loadData();
    } catch (e) {
      const msg = handleBackendError(e);
      toast.error(msg);
    } finally {
      setIsDeleteModalOpen(false);
      setEmployeeToDelete(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-lavender tracking-tight uppercase italic font-black">
            Gestión de Empleados
          </h1>
          <div className="h-1 w-12 bg-icy-blue mt-1"></div>
        </div>

        <div className="flex justify-end">
          {!showInactive ? (
            <Button
              onClick={() => { setSelectedEmployee(null); setIsModalOpen(true); }}
              className="bg-icy-blue text-jet-black px-5 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-white transition-all shadow-lg shadow-icy-blue/10 animate-in fade-in zoom-in duration-300"
            >
              <Plus size={20} /> Nuevo Empleado
            </Button>
          ) : (
            <div className="h-[40px]"></div>
          )}
        </div>
      </div>

      <div className="bg-white/[0.02] border border-white/5 rounded-xl overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-white/5 bg-white/[0.01] flex flex-col md:flex-row md:items-center justify-end gap-4">

          <Toggle
            value={showInactive}
            onChange={(val) => { setShowInactive(val); setCurrentPage(1); }}
            options={[
              { label: "Activos", value: false },
              { label: "Inactivos", value: true },
            ]}
          />
        </div>

        <Table
          columns={[
            { label: "ID", className: "w-16 text-center" },
            { label: "Nombre", className: "w-64 text-left" },
            { label: "Usuario", className: "w-48 text-left" },
            { label: "Email", className: "text-left" },
            { label: "Acciones", className: "w-32 text-right" },
          ]}
          isLoading={isLoading && totalItems === 0}
          isEmpty={!isLoading && totalItems === 0}
          loadingLabel="Sincronizando..."
          emptyLabel="No se encontraron empleados"
        >
          {currentData.map((employee) => (
            <tr key={employee.id} className="transition-colors group">
              <td className="px-6 py-4 font-mono text-xs text-pale-slate text-center opacity-40 italic">#{employee.id}</td>
              <td className="px-6 py-4 font-medium text-lavender uppercase tracking-tight">
                <span className="flex items-center gap-2">
                  <User size={14} className="text-icy-blue" />
                  {employee.name}
                </span>
              </td>
              <td className="px-6 py-4 text-pale-slate text-sm">{employee.username}</td>
              <td className="px-6 py-4 text-pale-slate text-sm">{employee.email}</td>
              <td className="px-6 py-4 text-right">
                <div className="flex justify-end gap-3 opacity-60 group-hover:opacity-100 transition-opacity">
                  {showInactive ? (
                    <div className="tooltip-container group/tip">
                      <Button onClick={() => handleRestore(employee.id)} className="p-2 bg-transparent border-none shadow-none text-icy-blue hover:bg-icy-blue/10">
                        <RotateCcw size={16} />
                      </Button>
                      <span className="tooltip-text uppercase">Reactivar</span>
                    </div>
                  ) : (
                    <>
                      <div className="tooltip-container group/tip">
                        <Button onClick={() => handleEdit(employee)} className="p-2 bg-transparent border-none shadow-none text-pale-slate hover:text-icy-blue hover:bg-white/5">
                          <Edit2 size={16} />
                        </Button>
                        <span className="tooltip-text uppercase">Editar</span>
                      </div>
                      <div className="tooltip-container group/tip">
                        <Button onClick={() => openDeleteConfirm(employee.id)} className="p-2 bg-transparent border-none shadow-none text-pale-slate hover:text-red-500 hover:bg-red-500/10">
                          <Trash2 size={16} />
                        </Button>
                        <span className="tooltip-text uppercase">Desactivar</span>
                      </div>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </Table>

        <Pagination
          className="bg-transparent border-none !rounded-none border-t border-white/5"
          currentPage={currentPage}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-jet-black/90 backdrop-blur-sm"></div>
          <div className="bg-jet-black border border-white/10 p-8 rounded-xl w-full max-w-2xl relative shadow-2xl animate-in zoom-in-95 duration-200">
            <h2 className="text-xl font-bold text-lavender uppercase mb-6 italic tracking-tight">
              {selectedEmployee ? "Actualizar Empleado" : "Nuevo Empleado"}
            </h2>
            <EmployeeForm
              initialData={selectedEmployee}
              onSubmit={handleSave}
              onCancel={() => { setIsModalOpen(false); setSelectedEmployee(null); }}
            />
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="¿DESACTIVAR EMPLEADO?"
        message={`Esta acción quitará al empleado del sistema activo.
          \nLo puedes reactivar en cualquier momento.`}
        onConfirm={confirmDelete}
        onCancel={() => { setIsDeleteModalOpen(false); setEmployeeToDelete(null); }}
      />
    </div>
  );
};