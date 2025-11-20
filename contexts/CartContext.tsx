"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { gioHangService } from "@/services/gioHangService";
import { GioHang } from "@/types";

interface CartContextType {
  cart: GioHang | null;
  cartCount: number;
  loading: boolean;
  fetchCart: () => Promise<void>;
  addToCart: (sanPhamId: number, soLuong: number) => Promise<boolean>;
  updateQuantity: (sanPhamId: number, soLuong: number) => Promise<boolean>;
  removeFromCart: (sanPhamId: number) => Promise<boolean>;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<GioHang | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      const data = await gioHangService.layGioHang();
      setCart(data);
    } catch (error) {
      console.error("Lỗi khi lấy giỏ hàng:", error);
      setCart(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const addToCart = useCallback(
    async (sanPhamId: number, soLuong: number) => {
      try {
        await gioHangService.themVaoGioHang(sanPhamId, soLuong);
        await fetchCart();
        return true;
      } catch (error) {
        console.error("Lỗi khi thêm vào giỏ hàng:", error);
        return false;
      }
    },
    [fetchCart]
  );

  const updateQuantity = useCallback(
    async (sanPhamId: number, soLuong: number) => {
      try {
        await gioHangService.capNhatSoLuong(sanPhamId, soLuong);
        await fetchCart();
        return true;
      } catch (error) {
        console.error("Lỗi khi cập nhật số lượng:", error);
        return false;
      }
    },
    [fetchCart]
  );

  const removeFromCart = useCallback(
    async (sanPhamId: number) => {
      try {
        await gioHangService.xoaKhoiGioHang(sanPhamId);
        await fetchCart();
        return true;
      } catch (error) {
        console.error("Lỗi khi xóa khỏi giỏ hàng:", error);
        return false;
      }
    },
    [fetchCart]
  );

  const clearCart = useCallback(() => {
    setCart(null);
  }, []);

  const cartCount =
    cart?.chi_tiet?.reduce((sum, item) => sum + item.so_luong, 0) || 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        loading,
        fetchCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
