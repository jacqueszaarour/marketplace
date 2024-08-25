import { useEffect, useState } from "react";
import ProductItem from "~/components/ProductItem";
import StoreManagerToggle from "~/components/StoreManagerToggle";
import "bootstrap/dist/css/bootstrap.min.css";

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
  const [, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        if (!response.ok) throw new Error("Network response was not ok");
        const data = (await response.json()) as Product[];
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchProducts();

    const intervalId = setInterval(() => {
      void fetchProducts();
    }, 10000);

    return () => clearInterval(intervalId);
  }, []);

  const handleToggleChange = (isStoreManager: boolean) => {
    setIsStoreManager(isStoreManager);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/products?id=${id}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        setProducts(products.filter(product => product.id !== id));
      } else {
        console.error('Failed to delete the product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };
  

  return (
    <div className="container mt-4">
      <StoreManagerToggle onToggle={handleToggleChange} />
      <h2 className="mb-4 text-center">Vention Flowers</h2>
      <div className="row">
        {products.map((product) => (
          <div key={product.id} className="col-md-3 mb-4">
            <ProductItem 
              {...product} 
              isStoreManager={isStoreManager} 
              onDelete={handleDelete} 
            />
          </div>
        ))}
      </div>
    </div>
  );
}
