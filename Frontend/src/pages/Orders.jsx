import { useEffect, useState } from "react";
import { getMyOrders } from "../api/orderApi";

function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const loadOrders = async () => {
      const res = await getMyOrders();

      setOrders(res.data);
    };

    loadOrders();
  }, []);

  if (!orders.length) {
    return (
      <div className="text-center text-xl mt-10">
        No orders found
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      
      <h1 className="text-2xl font-bold mb-6">
        My Orders
      </h1>

      <div className="space-y-6">
        
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white shadow rounded-lg p-5"
          >
            
            {/* TOP INFO */}
            <div className="flex justify-between mb-4">
              
              <div>
                <p className="font-semibold">
                  Order ID
                </p>

                <p className="text-gray-500 text-sm">
                  {order._id}
                </p>
              </div>

              <div>
                <p className="font-semibold">
                  Total
                </p>

                <p className="text-green-600 font-bold">
                  ₹{order.totalAmount}
                </p>
              </div>
            </div>

            {/* STATUS */}
            <div className="flex gap-4 mb-4">
              
              <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded">
                {order.orderStatus}
              </div>

              <div className="bg-green-100 text-green-700 px-3 py-1 rounded">
                {order.paymentStatus}
              </div>
            </div>

            {/* ITEMS */}
            <div className="space-y-4">
              
              {order.items.map((item) => (
                <div
                  key={item._id}
                  className="flex gap-4 items-center border-b pb-3"
                >
                  
                  <img
                    src={item.product.images?.[0]}
                    className="w-20 h-20 object-contain"
                  />

                  <div>
                    <h3 className="font-semibold">
                      {item.product.title}
                    </h3>

                    <p>
                      Qty: {item.quantity}
                    </p>

                    <p className="text-green-600">
                      ₹{item.product.sellingPrice}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}

export default Orders;