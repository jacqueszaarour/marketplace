import { useEffect, useState } from "react";
import ProductItem from "~/components/ProductItem";
import StoreManagerToggle from "~/components/StoreManagerToggle";
import CartSidebar from "~/components/CartSidebar";
import "bootstrap/dist/css/bootstrap.min.css";

export interface Product {
  id: number; 
  name: string;
  price: number;
  imageUrl: string;
  rating: number;
}

export interface CartItem {
  id: number; 
  productId: number; 
  quantity: number;
  product: Product;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isStoreManager, setIsStoreManager] = useState<boolean>(false);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products");
      if (!response.ok) throw new Error("Network response was not ok");
      const data = (await response.json()) as Product[];
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  const fetchCart = async () => {
    try {
      const response = await fetch("/api/cart");
      if (!response.ok) throw new Error("Network response was not ok");
      const data = (await response.json()) as CartItem[];
      setCart(data);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    }
  };

  useEffect(() => {
    void fetchProducts();
    void fetchCart();
  }, []);

  const handleToggleChange = (isStoreManager: boolean) => {
    setIsStoreManager(isStoreManager);
  };

  const addToCart = async (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.productId === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { id: 0, productId: product.id, quantity: 1, product }];
    });

    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id }),
      });
      if (!response.ok) {
        throw new Error("Failed to update the cart in the database.");
      }
      await fetchCart(); // Re-fetch the cart to update the UI
    } catch (error) {
      console.error("Failed to add item to cart:", error);
    }
  };

  const handleDelete = async (productId: number) => {
    try {
      setProducts((prevProducts) => prevProducts.filter((product) => product.id !== productId));
      setCart((prevCart) => prevCart.filter((item) => item.productId !== productId));

      const response = await fetch(`/api/products?id=${productId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete the product.');
      }

      await fetchCart(); 
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  const openCart = () => {
    setIsCartOpen(true);
  };

  const closeCart = () => {
    setIsCartOpen(false);
  };

  const handleDecreaseQuantity = async (productId: number) => {
    const cartItem = cart.find((item) => item.productId === productId);
    if (cartItem) {
      const newQuantity = cartItem.quantity - 1;
      if (newQuantity > 0) {
        await updateCartItem(productId, newQuantity);
      } else {
        await handleDelete(productId);
      }
    }
  };

  const updateCartItem = async (productId: number, quantity: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );

    try {
      const response = await fetch("/api/cart", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity }),
      });
      if (!response.ok) {
        throw new Error("Failed to update the cart in the database.");
      }
    } catch (error) {
      console.error("Failed to update cart item:", error);
    }
  };

  return (
    <div className="container mt-4">
      <StoreManagerToggle
        onToggle={handleToggleChange}
        cartItemCount={cart.reduce((acc, item) => acc + item.quantity, 0)}
        onCartClick={openCart}
      />
      <h2 className="mb-4 text-center">Vention Flowers</h2>
      <div className="row">
        {products.map((product) => (
          <div key={product.id} className="col-md-3 mb-4">
            <ProductItem
              {...product}
              isStoreManager={isStoreManager}
              onDelete={() => handleDelete(product.id)}
              addToCart={() => addToCart(product)}
            />
          </div>
        ))}
      </div>
      {isCartOpen && (
        <CartSidebar
          cartItems={cart}
          onClose={closeCart}
          onRemove={handleDelete}
          onDecreaseQuantity={handleDecreaseQuantity}
        />
      )}
    </div>
  );
}
