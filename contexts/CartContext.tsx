"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { gioHangAPI } from "@/lib/api";
import { GioHang } from "@/lib/types";
import { authUtils } from "@/lib/auth";

interface CartContextType {
  cart: GioHang | null;
  cartCount: number;
  loading: boolean;
  fetchCart: () => Promise<void>;
  addToCart: (sanPhamId: number, soLuong: number) => Promise<boolean>;
  updateQuantity: (maChiTiet: number, soLuong: number) => Promise<boolean>;
  removeFromCart: (maChiTiet: number) => Promise<boolean>;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<GioHang | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    const user = authUtils.getUser();
    if (!user) {
      setCart(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await gioHangAPI.layGioHang(user.id);
      setCart(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy giỏ hàng:", error);
      setCart(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const addToCart = useCallback(
    async (sanPhamId: number, soLuong: number) => {
      const user = authUtils.getUser();
      if (!user) return false;

      try {
        await gioHangAPI.themSanPham(user.id, {
          ma_san_pham: sanPhamId,
          so_luong: soLuong,
        });
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
    async (maChiTiet: number, soLuong: number) => {
      try {
        await gioHangAPI.capNhatSoLuong(maChiTiet, { so_luong: soLuong });
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
    async (maChiTiet: number) => {
      try {
        await gioHangAPI.xoaSanPham(maChiTiet);
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
    cart?.chi_tiet?.reduce(
      (sum: number, item: unknown) => sum + item.so_luong,
      0
    ) || 0;

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
