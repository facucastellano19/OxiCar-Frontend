import { useState, useEffect } from "react";
import {
  Search,
  Edit2,
  Trash2,
  Plus,
  Layers,
  RotateCcw,
  Package,
  AlertTriangle,
} from "lucide-react";
import { productsService } from "../../services/products.service";
import type {
  Product,
  ProductForm as ProductFormType,
  ProductCategory,
} from "../../models/products.model";
import { ProductForm, CategoriesForm } from "./Components";
import { toast } from "sonner";
import { handleBackendError } from "../../utilities";
import {
  Button,
  ConfirmModal,
  Pagination,
  Table,
  Toggle,
} from "../../components";
import { PermissionGate } from "../../components/Common/PermissionGate";
import { useUserStore } from "../../store";

export const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [view, setView] = useState<"products" | "categories">("products");
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | "">("");
  const [showInactive, setShowInactive] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] =
    useState<ProductCategory | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const userInfo = useUserStore((state) => state.userInfo);

  const loadData = async () => {
    try {
      setIsLoading(true);

      const categoriesStatus =
        view === "products" ? "active" : showInactive ? "inactive" : "active";

      const [productsRes, catsRes] = await Promise.all([
        productsService.getAll(
          searchTerm,
          showInactive ? "inactive" : "active",
          selectedCategoryId === "" ? undefined : Number(selectedCategoryId),
        ),
        productsService.getCategories(categoriesStatus),
      ]);

      const productsData = Array.isArray(productsRes)
        ? productsRes
        : productsRes?.data || [];
      const categoriesData = Array.isArray(catsRes)
        ? catsRes
        : catsRes?.data || [];

      setProducts(Array.isArray(productsData) ? productsData : []);
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
    } catch (error) {
      toast.error("Error al sincronizar los datos");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [searchTerm, showInactive, view, selectedCategoryId]);

  const dataToPaginate =
    view === "products"
      ? products
      : categories.filter((c) =>
          c.name.toLowerCase().includes(searchTerm.toLowerCase()),
        );

  const currentData = dataToPaginate.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const totalItems = dataToPaginate.length;

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleEditCategory = (category: ProductCategory) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleSave = async (data: any) => {
    try {
      if (view === "products") {
        if (selectedProduct) {
          await productsService.update(selectedProduct.id, data);
          toast.success("¡Producto actualizado!");
        } else {
          await productsService.create(data);
          toast.success("¡Producto creado!");
        }
      } else {
        if (selectedCategory)
          await productsService.updateCategory(selectedCategory.id, data);
        else await productsService.createCategory(data);
        toast.success(
          selectedCategory ? "Categoría actualizada" : "Categoría creada",
        );
      }
      setIsModalOpen(false);
      setSelectedProduct(null);
      setSelectedCategory(null);
      loadData();
    } catch (e) {
      const msg = handleBackendError(e);
      toast.error(msg);
    }
  };

  const handleRestore = async (id: number) => {
    try {
      if (view === "products") {
        await productsService.restore(id);
        toast.success("Producto reactivado correctamente");
      } else {
        await productsService.restoreCategory(id);
        toast.success("Categoría reactivada correctamente");
      }
      loadData();
    } catch (e) {
      const msg = handleBackendError(e);
      toast.error(msg);
    }
  };

  const openDeleteConfirm = (id: number) => {
    setProductToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (productToDelete === null) return;
    try {
      if (view === "products") {
        await productsService.delete(productToDelete);
        toast.success("Producto desactivado");
      } else {
        await productsService.deleteCategory(productToDelete);
        toast.success("Categoría desactivada");
      }
      loadData();
    } catch (e) {
      const msg = handleBackendError(e);
      toast.error(msg);
    } finally {
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-lavender tracking-tight uppercase italic font-black">
            Gestión de Productos
          </h1>
          <div className="h-1 w-12 bg-icy-blue mt-1"></div>
        </div>

        <div className="flex justify-end">
          {!showInactive ? (
            <PermissionGate allowedRoles={[1]}>
              <Button
                onClick={() => {
                  setSelectedProduct(null);
                  setSelectedCategory(null);
                  setIsModalOpen(true);
                }}
                className="bg-icy-blue text-jet-black px-5 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-white transition-all shadow-lg shadow-icy-blue/10 animate-in fade-in zoom-in duration-300"
              >
                <Plus size={20} />{" "}
                {view === "products" ? "Nuevo Producto" : "Nueva Categoría"}
              </Button>
            </PermissionGate>
          ) : (
            <div className="h-[40px]"></div>
          )}
        </div>
      </div>

      <div className="bg-white/[0.02] border border-white/5 rounded-xl overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-white/5 bg-white/[0.01] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative w-full md:w-80">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-pale-slate"
                size={16}
              />
              <input
                type="text"
                placeholder={
                  view === "products"
                    ? "Buscar producto..."
                    : "Buscar categoría..."
                }
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-jet-black/50 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-xs text-lavender outline-none focus:border-icy-blue/30 transition-all"
              />
            </div>

            {view === "products" && (
              <div className="relative w-full md:w-48">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-pale-slate pointer-events-none">
                  <Layers size={16} />
                </div>
                <select
                  value={selectedCategoryId}
                  onChange={(e) => {
                    setSelectedCategoryId(
                      e.target.value ? Number(e.target.value) : "",
                    );
                    setCurrentPage(1);
                  }}
                  className="w-full bg-jet-black/50 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-xs text-lavender outline-none focus:border-icy-blue/30 transition-all appearance-none cursor-pointer"
                >
                  <option value="">Todas las categorías</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            <Toggle
              value={view}
              onChange={(val) => {
                setView(val);
                setCurrentPage(1);
              }}
              options={[
                { label: "Productos", value: "products" },
                { label: "Categorías", value: "categories" },
              ]}
            />

            <PermissionGate allowedRoles={[1]}>
              <Toggle
                value={showInactive}
                onChange={(val) => {
                  setShowInactive(val);
                  setCurrentPage(1);
                }}
                options={[
                  { label: "Activos", value: false },
                  { label: "Inactivos", value: true },
                ]}
              />
            </PermissionGate>
          </div>
        </div>

        <Table
          columns={
            view === "products"
              ? [
                  { label: "ID", className: "w-16 text-center" },
                  { label: "Producto", className: "w-64 text-left" },
                  { label: "Categoría", className: "w-48 text-left" },
                  { label: "Precio", className: "w-32 text-left" },
                  { label: "Stock", className: "w-32 text-center" },
                  {
                    label: "Acciones",
                    className: "w-32 text-right invisible-for-employee",
                  },
                ].filter(
                  (col) => col.label !== "Acciones" || userInfo?.role_id === 1,
                )
              : [
                  { label: "ID", className: "w-16 text-center" },
                  { label: "Nombre de Categoría", className: "text-left" },
                  { label: "Acciones", className: "w-32 text-right" },
                ].filter(
                  (col) => col.label !== "Acciones" || userInfo?.role_id === 1,
                )
          }
          isLoading={isLoading && totalItems === 0}
          isEmpty={!isLoading && totalItems === 0}
          loadingLabel="Sincronizando..."
          emptyLabel={
            view === "products"
              ? "No se encontraron productos"
              : "No se encontraron categorías"
          }
        >
          {view === "products"
            ? (currentData as Product[]).map((product) => (
                <tr key={product.id} className="transition-colors group">
                  <td className="px-6 py-4 font-mono text-xs text-pale-slate text-center opacity-40 italic">
                    #{product.id}
                  </td>
                  <td className="px-6 py-4 font-medium text-lavender uppercase tracking-tight">
                    {product.name}
                  </td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-2 text-[10px] font-bold text-icy-blue uppercase bg-icy-blue/5 px-2 py-1 rounded w-fit border border-icy-blue/10">
                      <Layers size={12} /> {product.category || "General"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-left font-mono font-bold text-white text-sm">
                    ${" "}
                    {parseFloat(product.price.toString()).toLocaleString(
                      "es-AR",
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div
                      className={`flex items-center justify-center gap-1.5 font-mono font-bold text-xs ${product.lowStock ? "text-red-500" : "text-pale-slate"}`}
                    >
                      {product.lowStock && <AlertTriangle size={12} />}
                      {product.stock}
                    </div>
                  </td>

                  <PermissionGate allowedRoles={[1]}>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-3 opacity-60 group-hover:opacity-100 transition-opacity">
                        {showInactive ? (
                          <Button
                            onClick={() => handleRestore(product.id)}
                            className="p-2 bg-transparent border-none shadow-none text-icy-blue hover:bg-icy-blue/10"
                          >
                            <RotateCcw size={16} />
                          </Button>
                        ) : (
                          <>
                            <Button
                              onClick={() => handleEdit(product)}
                              className="p-2 bg-transparent border-none shadow-none text-pale-slate hover:text-icy-blue hover:bg-white/5"
                            >
                              <Edit2 size={16} />
                            </Button>
                            <Button
                              onClick={() => openDeleteConfirm(product.id)}
                              className="p-2 bg-transparent border-none shadow-none text-pale-slate hover:text-red-500 hover:bg-red-500/10"
                            >
                              <Trash2 size={16} />
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </PermissionGate>
                </tr>
              ))
            : (currentData as ProductCategory[]).map((category) => (
                <tr key={category.id} className="transition-colors group">
                  <td className="px-6 py-4 font-mono text-xs text-pale-slate text-center opacity-40 italic">
                    #{category.id}
                  </td>
                  <td className="px-6 py-4 font-medium text-lavender uppercase tracking-tight">
                    <span className="flex items-center gap-2">
                      <Layers size={14} className="text-icy-blue" />
                      {category.name}
                    </span>
                  </td>

                  <PermissionGate allowedRoles={[1]}>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-3 opacity-60 group-hover:opacity-100 transition-opacity">
                        {showInactive ? (
                          <Button
                            onClick={() => handleRestore(category.id)}
                            className="p-2 bg-transparent border-none shadow-none text-icy-blue hover:bg-icy-blue/10"
                          >
                            <RotateCcw size={16} />
                          </Button>
                        ) : (
                          <>
                            <Button
                              onClick={() => handleEditCategory(category)}
                              className="p-2 bg-transparent border-none shadow-none text-pale-slate hover:text-icy-blue hover:bg-white/5"
                            >
                              <Edit2 size={16} />
                            </Button>
                            <Button
                              onClick={() => openDeleteConfirm(category.id)}
                              className="p-2 bg-transparent border-none shadow-none text-pale-slate hover:text-red-500 hover:bg-red-500/10"
                            >
                              <Trash2 size={16} />
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </PermissionGate>
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
              {view === "products"
                ? selectedProduct
                  ? "Actualizar Producto"
                  : "Nuevo Producto"
                : selectedCategory
                  ? "Actualizar Categoría"
                  : "Nueva Categoría"}
            </h2>
            {view === "products" ? (
              <ProductForm
                initialData={selectedProduct}
                categories={categories}
                onSubmit={handleSave}
                onCancel={() => {
                  setIsModalOpen(false);
                  setSelectedProduct(null);
                }}
              />
            ) : (
              <CategoriesForm
                initialData={selectedCategory}
                onSubmit={handleSave}
                onCancel={() => {
                  setIsModalOpen(false);
                  setSelectedCategory(null);
                }}
              />
            )}
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title={
          view === "products"
            ? "¿DESACTIVAR PRODUCTO?"
            : "¿DESACTIVAR CATEGORÍA?"
        }
        message={`Esta acción quitará el elemento del catálogo activo.
          \nLo puedes reactivar en cualquier momento.`}
        onConfirm={confirmDelete}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setProductToDelete(null);
        }}
      />
    </div>
  );
};
