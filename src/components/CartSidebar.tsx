import React from "react";
import { type CartItem } from "~/pages/index";
import Image from "next/image";

interface CartSidebarProps {
  cartItems: CartItem[];
  onClose: () => void;
  onRemove: (productId: number) => void;
  onDecreaseQuantity: (productId: number) => void;
  onIncreaseQuantity: (productId: number) => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({
  cartItems,
  onClose,
  onRemove,
  onDecreaseQuantity,
  onIncreaseQuantity,
}) => {
  // Calculate the total price of the cart
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  return (
    <div
      className="cart-sidebar bg-light position-fixed h-100 end-0 top-0 p-4 shadow"
      style={{ width: "300px", zIndex: 1050 }}
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
              className="list-group-item d-flex justify-content-between align-items-center position-relative"
              style={{ padding: "10px" }} // Increased padding
            >
              <button
                className="btn btn-danger btn-sm position-absolute"
                style={{ top: "-10px", left: "-10px" }} // Position X button on the top left
                onClick={() => onRemove(item.productId)}
              >
                x
              </button>
              <div className="d-flex align-items-center">
                <Image
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                    borderRadius: "5px",
                  }}
                />
                <div className="ms-3">
                  <div
                    className="d-flex align-items-center justify-content-between"
                    style={{ marginBottom: "10px" }} // Increased space between lines
                  >
                    <div>
                      <span>${item.product.price.toFixed(2)}</span>
                    </div>
                  </div>
                  <strong>${(item.product.price * item.quantity).toFixed(2)}</strong>
                </div>
              </div>
              <div className="d-flex flex-column align-items-center ms-3">
                <button
                  className="btn btn-light btn-sm"
                  onClick={() => onIncreaseQuantity(item.productId)}
                >
                  +
                </button>
                <span> {item.quantity}</span>
                <button
                  className="btn btn-light btn-sm"
                  onClick={() => onDecreaseQuantity(item.productId)}
                >
                  -
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
