import { useState, useEffect, useMemo, useCallback } from "react";
import { productsService } from "../services/products.service";
import { type Product } from "../models/";
import { toast } from "sonner";

export const useStockAlert = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStock = useCallback(async () => {
    try {
      const response = await productsService.getAll(
        undefined,
        "active",
        undefined,
      );
      if (response?.data) {
        setProducts([...response.data]);
      }
    } catch (error) {
      toast.error("No se pudieron cargar los productos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStock();
    const interval = setInterval(fetchStock, 3000);
    return () => clearInterval(interval);
  }, []);

  const lowStockProducts = useMemo(
    () => products.filter((p) => p.lowStock === true),
    [products],
  );

  return {
    lowStockProducts,
    count: lowStockProducts.length,
    loading,
    refresh: fetchStock,
  };
};
