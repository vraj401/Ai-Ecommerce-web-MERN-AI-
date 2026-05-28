import { useEffect, useState } from "react";
import {
  getCart,
  removeFromCart,
  updateCart,
} from "../api/cartApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function Cart() {
  const [cart, setCart] = useState(null);
  const navigate = useNavigate();

  const loadCart = async ({ showError = true } = {}) => {
    try {
      const res = await getCart();
      setCart(res.data);
    } catch (err) {
      if (showError) {
        toast.error("Unable to load cart");
      }
      setCart({ items: [] });
    }
  };

  useEffect(() => {
    const loadInitialCart = async () => {
      try {
        const res = await getCart();
        setCart(res.data);
      } catch (err) {
        setCart({ items: [] });
      }
    };

    loadInitialCart();
  }, []);

  const handleRemove = async (productId) => {
    try {
      await removeFromCart(productId);
      toast.success("Removed");
      loadCart();
    } catch (err) {
      toast.error("Unable to remove item");
    }
  };

  const handleQty = async (productId, qty) => {
    try {
      await updateCart(productId, qty);
      loadCart();
    } catch (err) {
      toast.error("Unable to update quantity");
    }
  };

  if (!cart || !cart.items?.length)
    return (
      <div className="min-h-screen bg-gray-100 px-5 py-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900">Shopping Cart</h1>
        </div>
        <div className="text-center py-16 bg-white rounded-lg shadow-md">
          <p className="text-lg text-gray-600">Your cart is empty</p>
          <p className="text-sm text-gray-400 mt-2">Add items to get started</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 px-5 py-10">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
        <p className="text-sm text-gray-600">{cart.items.length} item{cart.items.length !== 1 ? 's' : ''}</p>
      </div>

      <div className="max-w-2xl mx-auto">
        {cart.items.map((item) => (
          <div key={item._id} className="bg-white rounded-lg p-5 mb-4 flex gap-5 shadow-md">
            <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
              <img
                src={item.product.images?.[0] || "https://via.placeholder.com/100?text=Product"}
                className="w-full h-full object-cover"
                alt={item.product.title}
              />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-semibold text-gray-900 mb-2">{item.product.title}</h3>
              <p className="text-lg font-bold text-blue-600 mb-3">₹{item.product.sellingPrice}</p>
              <div className="flex items-center gap-2 mb-3">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleQty(item.product._id, Math.max(1, item.quantity - 1));
                  }}
                  className="w-9 h-9 border border-gray-300 bg-white rounded text-base font-semibold cursor-pointer hover:bg-gray-100 transition-colors pointer-events-auto"
                >
                  −
                </button>
                <div className="text-sm font-semibold text-gray-900 w-10 text-center">{item.quantity}</div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleQty(item.product._id, item.quantity + 1);
                  }}
                  className="w-9 h-9 border border-gray-300 bg-white rounded text-base font-semibold cursor-pointer hover:bg-gray-100 transition-colors pointer-events-auto"
                >
                  +
                </button>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleRemove(item.product._id);
                }}
                className="bg-red-500 text-white px-4 py-2 rounded text-sm font-semibold cursor-pointer hover:bg-red-600 transition-colors active:bg-red-700 pointer-events-auto"
              >
                Remove from Cart
              </button>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            navigate("/payment");
          }}
          className="w-full mt-4 bg-blue-600 text-white py-3 rounded font-bold text-base hover:bg-blue-700 active:bg-blue-800 transition-colors pointer-events-auto"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}

export default Cart;
