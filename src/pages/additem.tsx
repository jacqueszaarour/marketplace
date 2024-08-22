import React, { useState } from 'react';
import { useRouter } from 'next/router';

const AddItem: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [price, setPrice] = useState<number>(0);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [rating, setRating] = useState<number>(1);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newItem = {
      name,
      price,
      imageUrl,
      rating,
    };

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newItem),
      });

      if (response.ok) {
        void router.push('/'); 
      } else {
        console.error('Failed to add item');
      }
    } catch (error) {
      console.error('Failed to add item:', error);
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Add New Item</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input
            type="text"
            id="name"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="price" className="form-label">Price</label>
          <input
            type="number"
            id="price"
            className="form-control"
            value={price}
            onChange={(e) => setPrice(parseFloat(e.target.value))}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="imageUrl" className="form-label">Image URL</label>
          <input
            type="text"
            id="imageUrl"
            className="form-control"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="rating" className="form-label">Rating</label>
          <input
            type="number"
            id="rating"
            className="form-control"
            min="1"
            max="5"
            value={rating}
            onChange={(e) => setRating(parseInt(e.target.value, 10))}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Add Item</button>
      </form>
    </div>
  );
};

export default AddItem;
