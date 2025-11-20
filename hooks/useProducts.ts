"use client";

import { useState, useEffect, useCallback } from "react";
import { sanPhamAPI } from "@/lib/api";
import { SanPham } from "@/lib/types";

let cachedProducts: SanPham[] | null = null;
let cacheTime: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 phút

export function useProducts() {
  const [products, setProducts] = useState<SanPham[]>(cachedProducts || []);
  const [loading, setLoading] = useState(!cachedProducts);

  const fetchProducts = useCallback(async (forceRefresh = false) => {
    const now = Date.now();

    // Nếu có cache và chưa hết hạn, dùng cache
    if (!forceRefresh && cachedProducts && now - cacheTime < CACHE_DURATION) {
      setProducts(cachedProducts);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await sanPhamAPI.layTatCa();
      const data = response.data;
      cachedProducts = data;
      cacheTime = now;
      setProducts(data);
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, loading, refetch: () => fetchProducts(true) };
}

export function useProduct(id: number) {
  const [product, setProduct] = useState<SanPham | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await sanPhamAPI.layTheoId(id);
        setProduct(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  return { product, loading };
}
