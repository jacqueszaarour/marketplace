import React from "react";
import { CartItem } from "~/pages/index";

interface CartSidebarProps {
  cartItems: CartItem[];
  onClose: () => void;
  onRemove: (productId: number) => void; 
  onDecreaseQuantity: (productId: number) => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({
  cartItems,
  onClose,
  onRemove,
  onDecreaseQuantity,
}) => {
  // Calculate the total price of the cart
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  return (
    <div
      className="cart-sidebar bg-light position-fixed h-100 end-0 top-0 p-4 shadow"
      style={{ width: "500px", zIndex: 1050 }}
    >
      <button className="btn btn-secondary mb-4" onClick={onClose}>
        Close
      </button>
      <h4>Your Cart</h4>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <ul className="list-group mb-3">
          {cartItems.map((item: CartItem) => (
            <li
              key={item.productId}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <div>
                <span>{item.product.name}</span> -{" "}
                <span>${item.product.price.toFixed(2)} x {item.quantity}</span> ={" "}
                <strong>${(item.product.price * item.quantity).toFixed(2)}</strong>
              </div>
              <div>
                <button
                  className="btn btn-danger btn-sm me-2"
                  onClick={() => onDecreaseQuantity(item.productId)}
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  className="btn btn-danger btn-sm ms-2"
                  onClick={() => onRemove(item.productId)}
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-auto">
        <button className="btn btn-primary w-100">
          Total: ${totalPrice.toFixed(2)}
        </button>
      </div>
    </div>
  );
};

export default CartSidebar;
