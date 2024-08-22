import { useEffect, useState } from "react";
import ProductItem from "~/components/ProductItem";
import StoreManagerToggle from "~/components/StoreManagerToggle";
import 'bootstrap/dist/css/bootstrap.min.css';

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  rating: number;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isStoreManager, setIsStoreManager] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch("/api/products");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json() as Product[];
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setIsLoading(false); // Ensure loading state is set to false after fetching
      }
    }

    void fetchProducts();
  }, []);

  const handleToggleChange = (isStoreManager: boolean) => {
    setIsStoreManager(isStoreManager);
  };

  return (
    <div className="relative min-h-screen">
      <div className="absolute top-4 right-4 z-50">
        <StoreManagerToggle onToggle={handleToggleChange} />
      </div>
      <div className="w-full bg-gray-100 p-4">
        <h2 className="mb-4 mt-2 text-2xl font-bold">Products</h2>
        {isLoading ? (
          <div className="text-gray-400">Loading...</div>
        ) : products.length > 0 ? (
          <div className="grid gap-x-4 gap-y-6 md:grid-cols-4">
            {products.map((product) => (
              <ProductItem
                key={product.id}
                name={product.name}
                price={product.price}
                imageUrl={product.imageUrl}
                rating={product.rating}
              />
            ))}
          </div>
        ) : (
          <div className="text-gray-400">No products available</div>
        )}
      </div>
    </div>
  );
}
