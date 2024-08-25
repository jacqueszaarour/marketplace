import Image from 'next/image';
import { useState } from 'react';
import Rating from './Rating';

interface ProductItemProps {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  rating: number;
  isStoreManager: boolean;
  onDelete: (id: string) => void;
}

const ProductItem: React.FC<ProductItemProps> = ({ id, name, price, imageUrl, rating, isStoreManager, onDelete }) => {
  const [currentRating, setCurrentRating] = useState<number>(rating);

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

  return (
    <div className="flex flex-col h-full rounded-lg bg-white p-4 shadow relative">
      {isStoreManager && (
        <button
          onClick={() => onDelete(id)}
          className="absolute top-2 right-2 text-red-600 hover:text-red-800 bg-white rounded-full w-6 h-6 flex items-center justify-center"
        >
          ✖
        </button>
      )}
      <div className="h-64 w-full overflow-hidden rounded-lg mb-4 flex items-center justify-center">
        <Image
          src={imageUrl}
          alt={name}
          width={270} 
          height={200}
          className="object-contain rounded-lg"
        />
      </div>
      <div className="flex flex-col items-center">
        <h3 className="text-lg font-bold text-center">{name}</h3>
        <p className="text-gray-600 text-center">${price.toFixed(2)}</p>
        <div className="text-gray-600 text-center">
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
