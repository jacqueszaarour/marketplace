import Image from 'next/image';
import { useState } from 'react';
import Rating from './Rating';

interface ProductItemProps {
  id: number; 
  name: string;
  price: number;
  imageUrl: string;
  rating: number;
  isStoreManager: boolean;
  onDelete?: (id: number) => void;  
  addToCart?: () => void;
}

const ProductItem: React.FC<ProductItemProps> = ({
  id, name, price, imageUrl, rating, isStoreManager, onDelete, addToCart
}) => {
  const [currentRating, setCurrentRating] = useState<number>(rating);
  const [hovered, setHovered] = useState<boolean>(false);

  const handleRatingChange = async (newRating: number) => {
    try {
      const response = await fetch(`/api/products?id=${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rating: newRating }),
      });

      if (response.ok) {
        setCurrentRating(newRating);
      } else {
        console.error('Failed to update the rating');
      }
    } catch (error) {
      console.error('Error updating rating:', error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/products?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        onDelete?.(id);
      } else {
        console.error('Failed to delete product.');
      }
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  return (
    <div 
      className="card h-100 position-relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {isStoreManager && (
        <button
          onClick={handleDelete}
          className="btn btn-sm btn-danger position-absolute top-0 end-0 m-2"
          style={{ zIndex: 10 }}
        >
          X
        </button>
      )}
      <div className="position-relative d-flex align-items-center justify-content-center overflow-hidden" style={{ height: '200px' }}>
        <Image
          src={imageUrl}
          alt={name}
          width={205}
          height={200}
          className="img-fluid"
          style={{ objectFit: 'contain', objectPosition: 'center' }}
        />
        {!isStoreManager && addToCart && hovered && (
          <button
            onClick={addToCart}
            className="btn btn-sm btn-light position-absolute top-50 start-50 translate-middle"
            style={{ opacity: 0.9, zIndex: 5 }}
          >
            Add to Cart
          </button>
        )}
      </div>
      <div className="card-body text-center">
        <h5 className="card-title">{name}</h5>
        <p className="card-text">${price.toFixed(2)}</p>
        <div className="text-center">
          <Rating
            count={5}
            value={currentRating}
            edit={!isStoreManager}
            onChange={handleRatingChange}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
