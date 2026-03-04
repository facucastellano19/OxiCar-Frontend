import { useState, useEffect, useRef, useMemo } from "react";
import {
  Trash2,
  Plus,
  Package,
  User,
  CreditCard,
  Hash,
  Save,
} from "lucide-react";
import { Button, Table } from "../../../components/";
import {
  productsService,
  clientsService,
  salesService,
} from "../../../services/";
import type { Product } from "../../../models/products.model";
import { productSaleSchema } from "../../../models/sales.model";
import { toast } from "sonner";

interface Props {
  onCancel: () => void;
  onSubmit: (data: any) => void;
}

export const ProductSaleForm = ({ onCancel, onSubmit }: Props) => {
  // --- Data and Selection States ---
  const [clients, setClients] = useState<any[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);

  // Custom error state mimicking React Hook Form structure
  const [errors, setErrors] = useState<Record<string, { message: string }>>({});

  // --- Searchable Client States ---
  const [clientSearch, setClientSearch] = useState("");
  const [isClientListOpen, setIsClientListOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const clientDropdownRef = useRef<HTMLDivElement>(null);

  // --- Searchable Product States ---
  const [productSearch, setProductSearch] = useState("");
  const [isProductListOpen, setIsProductListOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const productDropdownRef = useRef<HTMLDivElement>(null);

  // --- Form Logic States ---
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [observations, setObservations] = useState("");
  const [currentQuantity, setCurrentQuantity] = useState<number>(1);
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>(
    [],
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        clientDropdownRef.current &&
        !clientDropdownRef.current.contains(event.target as Node)
      )
        setIsClientListOpen(false);
      if (
        productDropdownRef.current &&
        !productDropdownRef.current.contains(event.target as Node)
      )
        setIsProductListOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Initial Data Load
  useEffect(() => {
    const loadData = async () => {
      try {
        const resClients = await clientsService.getAll();
        const resProducts = await productsService.getAll();
        const { call: pmsCall } = salesService.getPaymentMethods();
        const resPms = await pmsCall;

        setClients(
          Array.isArray(resClients)
            ? resClients
            : (resClients as any).data || [],
        );
        setProducts(
          Array.isArray(resProducts)
            ? resProducts
            : (resProducts as any).data || [],
        );
        setPaymentMethods(resPms.data?.data || []);
      } catch (error) {
        toast.error("Error al cargar los datos del formulario");
      }
    };
    loadData();
  }, []);

  // Selection Handlers
  const handleSelectClient = (client: any) => {
    setSelectedClientId(client.id);
    setClientSearch(`${client.first_name} ${client.last_name}`);
    setIsClientListOpen(false);
    // Clear error on selection
    setErrors((prev) => {
      const n = { ...prev };
      delete n.client_id;
      return n;
    });
  };

  const handleSelectProduct = (product: Product) => {
    setCurrentProduct(product);
    setProductSearch(product.name);
    setIsProductListOpen(false);
  };

  const addToCart = () => {
    if (!currentProduct) return;
    if (isNaN(currentQuantity) || currentQuantity < 1) {
      setErrors((prev) => ({
        ...prev,
        currentQuantity: { message: "Mínimo: 1" },
      }));
      return;
    }

    if (currentQuantity > currentProduct.stock)
      return toast.error("Stock insuficiente");

    const exists = cart.find((item) => item.product.id === currentProduct.id);
    const totalQty = exists
      ? exists.quantity + currentQuantity
      : currentQuantity;

    if (totalQty > currentProduct.stock)
      return toast.error("La cantidad total supera el stock disponible");

    if (exists) {
      setCart(
        cart.map((item) =>
          item.product.id === currentProduct.id
            ? { ...item, quantity: totalQty }
            : item,
        ),
      );
    } else {
      setCart([
        ...cart,
        { product: currentProduct, quantity: currentQuantity },
      ]);
    }

    setCurrentProduct(null);
    setProductSearch("");
    setCurrentQuantity(1);
    setErrors((prev) => {
      const n = { ...prev };
      delete n.products;
      delete n.currentQuantity;
      return n;
    });
  };

  const handleSubmit = () => {
    const payload = {
      client_id: selectedClientId ?? NaN,
      payment_method_id: Number(selectedPaymentMethod) || NaN,
      observations: observations || "",
      products: cart.map((item) => ({
        product_id: item.product.id,
        quantity: item.quantity,
      })),
    };

    const result = productSaleSchema.safeParse(payload);

    if (!result.success) {
      const newErrors: Record<string, { message: string }> = {};
      result.error.issues.forEach((issue) => {
        const key = issue.path[0]?.toString() || "form";
        newErrors[key] = { message: issue.message };
      });
      setErrors(newErrors);
      return toast.error("Por favor, revise los campos obligatorios");
    }

    setErrors({});
    onSubmit(payload);
  };

  const filteredClients = useMemo(() => {
    const lowerSearch = clientSearch.toLowerCase();
    return clients.filter((c) =>
      `${c.first_name} ${c.last_name}`.toLowerCase().includes(lowerSearch),
    );
  }, [clients, clientSearch]);

  const filteredProducts = useMemo(() => {
    const lowerSearch = productSearch.toLowerCase();
    return products.filter(
      (p) => p.name.toLowerCase().includes(lowerSearch) && p.stock > 0,
    );
  }, [products, productSearch]);

  const total = useMemo(() => {
    return cart.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0,
    );
  }, [cart]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* CLIENT SEARCH */}
        <div className="flex flex-col gap-1.5 relative" ref={clientDropdownRef}>
          <label className="text-[10px] font-black text-lavender/40 uppercase tracking-widest ml-1">
            Cliente *
          </label>
          <div className="relative">
            <User
              className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${errors.client_id ? "text-red-400" : "text-pale-slate"}`}
              size={16}
            />
            <input
              type="text"
              placeholder="Buscar cliente..."
              value={clientSearch}
              onFocus={() => setIsClientListOpen(true)}
              onChange={(e) => {
                setClientSearch(e.target.value);
                if (selectedClientId) setSelectedClientId(null);
              }}
              className={`w-full bg-jet-black/50 border rounded-lg py-2.5 pl-10 pr-4 text-xs text-lavender outline-none transition-all ${errors.client_id ? "border-red-500/50 focus:border-red-500" : "border-white/10 focus:border-icy-blue/30"}`}
            />
          </div>
          {/* ERROR STYLE FROM PRODUCT FORM */}
          {errors.client_id && (
            <span className="text-red-400 text-[10px] font-medium ml-1 italic">
              {errors.client_id.message}
            </span>
          )}

          {isClientListOpen && (
            <div className="absolute top-[105%] left-0 w-full bg-jet-black border border-white/10 rounded-lg shadow-2xl z-[100] max-h-48 overflow-y-auto custom-scrollbar animate-in fade-in zoom-in-95 duration-200">
              {filteredClients.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => handleSelectClient(c)}
                  className="w-full text-left px-4 py-2.5 text-xs text-pale-slate hover:bg-icy-blue hover:text-jet-black transition-colors border-b border-white/5 uppercase font-bold"
                >
                  {c.first_name} {c.last_name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* PAYMENT METHOD */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-black text-lavender/40 uppercase tracking-widest ml-1">
            Método de Pago *
          </label>
          <div className="relative">
            <CreditCard
              className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${errors.payment_method_id ? "text-red-400" : "text-pale-slate"}`}
              size={16}
            />
            <select
              value={selectedPaymentMethod}
              onChange={(e) => {
                setSelectedPaymentMethod(e.target.value);
                setErrors((prev) => {
                  const n = { ...prev };
                  delete n.payment_method_id;
                  return n;
                });
              }}
              className={`w-full bg-jet-black/50 border rounded-lg py-2.5 pl-10 pr-4 text-xs text-lavender outline-none appearance-none cursor-pointer transition-all ${errors.payment_method_id ? "border-red-500/50 focus:border-red-500" : "border-white/10 focus:border-icy-blue/30"}`}
            >
              <option value="">Seleccionar método...</option>
              {paymentMethods.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
          {errors.payment_method_id && (
            <span className="text-red-400 text-[10px] font-medium ml-1 italic">
              {errors.payment_method_id.message}
            </span>
          )}
        </div>
      </div>

      {/* PRODUCTS SELECTOR SECTION */}
      <div
        className={`bg-white/[0.03] p-4 rounded-xl border transition-colors space-y-4 shadow-inner ${errors.products ? "border-red-500/30 bg-red-500/5" : "border-white/5"}`}
      >
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div
            className="flex-1 flex flex-col gap-1.5 relative"
            ref={productDropdownRef}
          >
            <label className="text-[10px] font-black text-icy-blue/60 uppercase tracking-widest ml-1">
              Agregar Producto
            </label>
            <div className="relative">
              <Package
                className="absolute left-3 top-1/2 -translate-y-1/2 text-pale-slate"
                size={16}
              />
              <input
                type="text"
                placeholder="Buscar productos..."
                value={productSearch}
                onFocus={() => setIsProductListOpen(true)}
                onChange={(e) => {
                  setProductSearch(e.target.value);
                  if (currentProduct) setCurrentProduct(null);
                }}
                className="w-full bg-jet-black border border-white/10 rounded-lg py-2 pl-10 pr-4 text-xs text-lavender outline-none focus:border-icy-blue/30"
              />
            </div>
            {isProductListOpen && (
              <div className="absolute top-[105%] left-0 w-full bg-jet-black border border-white/10 rounded-lg shadow-2xl z-[100] max-h-48 overflow-y-auto custom-scrollbar animate-in fade-in zoom-in-95 duration-200">
                {filteredProducts.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleSelectProduct(p)}
                    className="w-full text-left px-4 py-2.5 text-xs text-pale-slate hover:bg-icy-blue hover:text-jet-black transition-colors border-b border-white/5 uppercase font-bold"
                  >
                    {p.name} - ${p.price}{" "}
                    <span className="opacity-40 ml-2 font-mono text-[10px]">
                      (Stock: {p.stock})
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="w-24 flex flex-col gap-1.5 relative">
            <label className="text-[10px] font-black text-lavender/40 uppercase tracking-widest ml-1">
              Cant.
            </label>
            <div className="relative">
              <Hash
                className={`absolute left-3 top-1/2 -translate-y-1/2 ${errors.currentQuantity ? "text-red-400" : "text-white/20"}`}
                size={14}
              />
              <input
                type="number"
                value={currentQuantity}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  setCurrentQuantity(val);
                  if (val > 0)
                    setErrors((prev) => {
                      const n = { ...prev };
                      delete n.currentQuantity;
                      return n;
                    });
                }}
                className={`w-full bg-jet-black border rounded-lg py-2 pl-8 pr-2 text-xs text-lavender outline-none transition-all ${errors.currentQuantity ? "border-red-500/50" : "border-white/10"}`}
              />
            </div>
            {/* ABSOLUTE ERROR TO KEEP UI STABLE */}
            {errors.currentQuantity && (
              <span className="absolute -bottom-3.5 left-1 text-[9px] text-red-400 font-bold uppercase italic tracking-tighter">
                {errors.currentQuantity.message}
              </span>
            )}
          </div>

          <Button
            onClick={addToCart}
            disabled={!currentProduct}
            className="bg-icy-blue text-jet-black px-4 py-2.5 h-[38px] rounded-lg shadow-lg shadow-icy-blue/10 transition-all active:scale-95"
          >
            <Plus size={18} />
          </Button>
        </div>

        {/* CART TABLE */}
        <div className="border border-white/5 rounded-lg bg-jet-black/20 h-[250px] overflow-y-auto custom-scrollbar">
          <Table
            columns={[
              { label: "Producto", className: "pl-6" },
              { label: "Cant", className: "text-center" },
              { label: "Subtotal", className: "text-right" },
              { label: "", className: "pr-6" },
            ]}
            isEmpty={cart.length === 0}
            emptyLabel="No hay productos seleccionados"
          >
            {cart.map((item) => (
              <tr
                key={item.product.id}
                className="border-b border-white/5 group hover:bg-white/[0.01]"
              >
                <td className="px-6 py-3 text-xs text-lavender uppercase font-bold">
                  {item.product.name}
                </td>
                <td className="px-6 py-3 text-xs text-lavender text-center">
                  {item.quantity}
                </td>
                <td className="px-6 py-3 text-xs text-white font-bold text-right font-mono">
                  ${(item.product.price * item.quantity).toLocaleString()}
                </td>
                <td className="px-6 py-3 text-right pr-6">
                  <Button
                    onClick={() =>
                      setCart(
                        cart.filter((i) => i.product.id !== item.product.id),
                      )
                    }
                    className="p-1.5 bg-transparent border-none text-pale-slate hover:text-red-500 shadow-none"
                  >
                    <Trash2 size={14} />
                  </Button>
                </td>
              </tr>
            ))}
          </Table>
        </div>

        {/* EMPTY CART ERROR */}
        {errors.products && (
          <span className="text-red-400 text-[10px] font-medium ml-1 italic">
            {errors.products.message}
          </span>
        )}

        <div className="flex justify-between items-center px-2 py-2 border-t border-white/5">
          <span className="text-[10px] font-bold text-pale-slate uppercase tracking-widest italic">
            Total de la venta
          </span>
          <span className="text-xl font-black text-icy-blue font-mono">
            ${total.toLocaleString("es-AR")}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-black text-lavender/40 uppercase tracking-widest ml-1">
          Observaciones
        </label>
        <textarea
          value={observations}
          onChange={(e) => setObservations(e.target.value)}
          rows={2}
          className="w-full bg-jet-black/50 border border-white/10 rounded-lg p-3 text-xs text-lavender outline-none focus:border-icy-blue/30 transition-all resize-none"
          placeholder="Notas adicionales..."
        />
      </div>

      {/* FOOTER ACTIONS */}
      <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
        <Button
          onClick={onCancel}
          className="bg-transparent text-pale-slate px-5 py-2.5 rounded-lg font-bold text-xs uppercase hover:text-white border-none shadow-none"
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          className="bg-icy-blue text-jet-black px-8 py-2.5 rounded-lg font-black text-xs uppercase tracking-widest hover:bg-white shadow-lg shadow-icy-blue/20"
        >
          <Save size={16} className="mr-2" /> Confirmar Venta
        </Button>
      </div>
    </div>
  );
};
