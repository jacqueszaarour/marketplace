import React, { useState } from 'react';
import { useRouter } from 'next/router';

interface StoreManagerToggleProps {
  onToggle: (isStoreManager: boolean) => void;
  cartItemCount: number;
  onCartClick: () => void;
}

const StoreManagerToggle: React.FC<StoreManagerToggleProps> = ({ onToggle, cartItemCount, onCartClick }) => {
  const [isStoreManager, setIsStoreManager] = useState<boolean>(false);
  const router = useRouter();

  const handleToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.checked;
    setIsStoreManager(newValue);
    onToggle(newValue);
  };

  const handleAddItemClick = () => {
    void router.push('/additem');
  };

  return (
    <div className="toggle-container flex items-center space-x-4">
      <div className="form-check form-switch">
        <input
          className="form-check-input"
          type="checkbox"
          id="storeManagerToggle"
          checked={isStoreManager}
          onChange={handleToggle}
        />
        <label className="form-check-label fs-6" htmlFor="storeManagerToggle">
          Store Manager
        </label>
      </div>
      {isStoreManager ? (
        <button
          className="btn btn-primary edit-button"
          onClick={handleAddItemClick}
        >
          Add Item
        </button>
      ) : (
        <button
          className="btn btn-primary edit-button"
          onClick={onCartClick}
        >
          Cart ({cartItemCount})
        </button>
      )}
    </div>
  );
};

export default StoreManagerToggle;
