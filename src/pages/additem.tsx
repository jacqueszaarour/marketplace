import React, { useState } from 'react';
import { useRouter } from 'next/router';

const AddItem: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [price, setPrice] = useState<number>(0);
  const [color, setColor] = useState<string>('blue'); 
  const [imageUrl, setImageUrl] = useState<string>('/blueflower.jpg'); // Default image
  const router = useRouter();

  const handleColorChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedColor = event.target.value;
    setColor(selectedColor);

    switch (selectedColor) {
      case 'blue':
        setImageUrl('/blueflower.jpg');
        break;
      case 'orange':
        setImageUrl('/orangeflower.jpg');
        break;
      case 'pink':
        setImageUrl('/pinkflower.jpg');
        break;
      case 'purple':
        setImageUrl('/purpleflower.jpg');
        break;
      case 'green':
        setImageUrl('/greenflower.jpg');
        break;
      case 'white':
        setImageUrl('/whiteflower.jpg');
        break;
      case 'black':
        setImageUrl('/blackflower.jpg');
        break;
      case 'yellow':
        setImageUrl('/yellowflower.jpg');
        break;
      case 'red':
        setImageUrl('/redflower.jpg');
        break;
      default:
        setImageUrl('');
        break;
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newItem = {
      name,
      price,
      imageUrl,
      rating: -1,
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

  const handleDoneClick = () => {
    void router.push('/');
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
            value={price.toString()} // Ensure value is a string
            onChange={(e) => setPrice(parseFloat(e.target.value) || 0)} // Handle NaN by defaulting to 0
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="color" className="form-label">Color</label>
          <select
            id="color"
            className="form-control"
            value={color}
            onChange={handleColorChange}
            required
          >
            <option value="blue">Blue</option>
            <option value="orange">Orange</option>
            <option value="pink">Pink</option>
            <option value="purple">Purple</option>
            <option value="green">Green</option>
            <option value="white">White</option>
            <option value="black">Black</option>
            <option value="red">Red</option>
            <option value="yellow">Yellow</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary">Add Item</button>
      </form>
      <button onClick={handleDoneClick} className="btn btn-secondary mt-3">Done</button>
    </div>
  );
};

export default AddItem;