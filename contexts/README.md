# Context API - Hướng dẫn sử dụng

## 1. AppContext - Quản lý User & Authentication

```tsx
import { useApp } from "@/contexts/AppContext";

function MyComponent() {
  const { user, isAuthenticated, logout, refreshUser } = useApp();

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <p>Xin chào, {user?.ten_dang_nhap}</p>
          <button onClick={logout}>Đăng xuất</button>
        </div>
      ) : (
        <p>Chưa đăng nhập</p>
      )}
    </div>
  );
}
```

## 2. CartContext - Quản lý Giỏ hàng

```tsx
import { useCart } from "@/contexts/CartContext";

function MyComponent() {
  const {
    cart,
    cartCount,
    addToCart,
    updateQuantity,
    removeFromCart,
    fetchCart,
  } = useCart();

  const handleAddToCart = async () => {
    const success = await addToCart(productId, 1);
    if (success) {
      message.success("Đã thêm vào giỏ hàng");
    }
  };

  return (
    <div>
      <p>Giỏ hàng: {cartCount} sản phẩm</p>
      <button onClick={handleAddToCart}>Thêm vào giỏ</button>
    </div>
  );
}
```

## 3. Custom Hooks - Cache data

### useProducts - Lấy danh sách sản phẩm (có cache)

```tsx
import { useProducts } from "@/hooks/useProducts";

function ProductList() {
  const { products, loading, refetch } = useProducts();

  return (
    <div>
      {loading ? (
        <Spin />
      ) : (
        products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))
      )}
      <button onClick={refetch}>Làm mới</button>
    </div>
  );
}
```

### useProduct - Lấy chi tiết sản phẩm

```tsx
import { useProduct } from "@/hooks/useProducts";

function ProductDetail({ id }: { id: number }) {
  const { product, loading } = useProduct(id);

  if (loading) return <Spin />;
  return <div>{product?.ten_san_pham}</div>;
}
```

### useNews - Lấy danh sách tin tức (có cache)

```tsx
import { useNews } from "@/hooks/useNews";

function NewsList() {
  const { news, loading, refetch } = useNews();

  return (
    <div>
      {news.map((item) => (
        <NewsCard key={item.id} news={item} />
      ))}
    </div>
  );
}
```

## Lợi ích

1. **Tránh re-render không cần thiết**: Data được cache, không fetch lại mỗi lần component mount
2. **Quản lý state tập trung**: User, Cart được quản lý ở 1 nơi
3. **Dễ bảo trì**: Thay đổi logic ở 1 chỗ, áp dụng toàn bộ app
4. **Performance tốt hơn**: Cache 5 phút, giảm số lượng API calls

## Migration

Thay vì:

```tsx
// Cũ
const [products, setProducts] = useState([]);
useEffect(() => {
  fetchProducts();
}, []);
```

Dùng:

```tsx
// Mới
const { products, loading } = useProducts();
```
